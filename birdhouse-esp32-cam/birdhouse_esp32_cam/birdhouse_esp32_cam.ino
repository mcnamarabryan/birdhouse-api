#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <SD.h>
#include <SPI.h>
#include "esp_camera.h"
#include "FS.h"
#include "SD_MMC.h"
#include <TimeLib.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

// NTP Client configuration
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);

// Replace with your Wi-Fi credentials
const char* ssid = "Hyperspace";
const char* password = "Jdy?u53K+y";

// Birdhouse API endpoint
const char* server = "cloud-birdhouse.bkm-tech.com";
const char* loginEndpoint = "/login/auth";
const char* postEndpoint = "/image/post";
const char* apiUsername = "birdmodeos";
const char* apiPassword = "password";

// Maximum SD card storage size in bytes (512 MB)
const uint32_t maxStorageSize = 512 * 1024 * 1024;

// Camera configuration
// Camera configuration
camera_config_t cameraConfig;

// Interval between captures in milliseconds
const unsigned long captureInterval = 20000;
unsigned long lastCaptureTime = 0;

// Authentication token
String authToken;

uint8_t fileBuf[1024];

// Function prototypes
String createFilename();
void checkAndRemoveOldestFile();
void uploadFileToApi(const String &filename);
bool login();

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi");

  // Initialize NTP client
  timeClient.begin();
  Serial.print("Getting time from NTP server...");
  while (!timeClient.update()) {
    timeClient.forceUpdate();
  }
  setTime(timeClient.getEpochTime());
  Serial.println(" Time set.");

  // Initialize SD card
  if (!SD_MMC.begin()) {
    Serial.println("SD Card Mount Failed");
    return;
  }

  // Initialize the camera
  cameraConfig.ledc_channel = LEDC_CHANNEL_0;
  cameraConfig.ledc_timer = LEDC_TIMER_0;
  cameraConfig.pin_d0 = 5;
  cameraConfig.pin_d1 = 18;
  cameraConfig.pin_d2 = 19;
  cameraConfig.pin_d3 = 21;
  cameraConfig.pin_d4 = 36;
  cameraConfig.pin_d5 = 39;
  cameraConfig.pin_d6 = 34;
  cameraConfig.pin_d7 = 35;
  cameraConfig.pin_xclk = 0;
  cameraConfig.pin_pclk = 22;
  cameraConfig.pin_vsync = 25;
  cameraConfig.pin_href = 23;
  cameraConfig.pin_sscb_sda = 26;
  cameraConfig.pin_sscb_scl = 27;
  cameraConfig.pin_pwdn = 32;
  cameraConfig.pin_reset = -1;
  cameraConfig.xclk_freq_hz = 20000000;
  cameraConfig.pixel_format = PIXFORMAT_JPEG;
  cameraConfig.frame_size = FRAMESIZE_SVGA;
  cameraConfig.jpeg_quality = 10;
  cameraConfig.fb_count = 1;

  if (esp_camera_init(&cameraConfig) != ESP_OK) {
    Serial.println("Camera Init Failed");
    return;
  }

  // Login to the Birdhouse API
  if (!login()) {
    Serial.println("Login failed");
    return;
  }
  Serial.println("Logged in successfully");
}

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - lastCaptureTime >= captureInterval) {
    lastCaptureTime = currentTime;

    // Take a photo and save it to the SD card
    String filename = createFilename();
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      return;
    }

    File file = SD_MMC.open("/" + filename, FILE_WRITE);
    if (!file) {
      Serial.println("Failed to create file");
      return;
    }

    file.write(fb->buf, fb->len);
    file.close();
    esp_camera_fb_return(fb);
    delay(1000);
    Serial.printf("Image saved as %s\n", filename.c_str());
    // Check if SD card storage reached the limit and remove the oldest file if needed
    checkAndRemoveOldestFile();
    delay(1000);

    // Attempt to upload the file to the Birdhouse API
    uploadFileToApi(filename);
  }
}

String urlEncode(const String &str) {
  String encoded = "";
  char hex[4]; // Increase the buffer size to 4
  for (char c : str) {
    if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')) {
      encoded += c;
    } else {
      snprintf(hex, sizeof(hex), "%%%02X", c); // No changes here, but hex has enough space now
      encoded += hex;
    }
  }
  return encoded;
}

bool login() {
  WiFiClientSecure client;
  client.setInsecure(); // For testing purposes, disable SSL certificate verification
  HTTPClient http;
  String url = String("https://") + server + loginEndpoint;

  String encodedPassword = urlEncode("2qwidsDSJ__sdd+33=wasd.wESD__-w+wsfsaJIKMVKNNKJD39002948");
  String requestBody = "username=" + String(apiUsername) + "&password=" + encodedPassword;

  http.begin(client, url);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  int httpCode = http.POST(requestBody);
  String response = http.getString(); // Add this line to get the response body

  if (httpCode == HTTP_CODE_OK) {
    Serial.println("Login response:");
    Serial.println(response);

    // Extract auth token from the response
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);
    const char* token = doc["token"];
    if (token) {
      authToken = token;
      return true;
    }
  } else {
    Serial.printf("Login failed, error: %s\n", http.errorToString(httpCode).c_str());
    Serial.println("HTTP response body:"); // Add this line to print the response body
    Serial.println(response); // Add this line to print the response body
  }

  http.end();
  return false;
}



// Generate a timestamp-based filename
String createFilename() {
  String filename;
  char buffer[32];
  snprintf(buffer, sizeof(buffer), "BHOUSE-%02d-%02d-%04d-%02d-%02d-%02d.jpg",
           day(), month(), year(), hour(), minute(), second());
  filename = buffer;
  return filename;
}

// Check the SD card storage and remove the oldest file if the limit is reached
void checkAndRemoveOldestFile() {
  uint32_t totalSize = 0;
  String oldestFilename;
  uint32_t oldestTimestamp = UINT32_MAX;

  File root = SD_MMC.open("/");
  while (true) {
    File entry = root.openNextFile();
    if (!entry) {
      break;
    }

    if (entry.isDirectory()) {
      continue;
    }

    totalSize += entry.size();
    uint32_t fileTimestamp = extractTimestamp(entry.name());
    if (fileTimestamp < oldestTimestamp) {
      oldestTimestamp = fileTimestamp;
      oldestFilename = entry.name();
    }
    entry.close();
  }
  root.close();

  if (totalSize >= maxStorageSize) {
    if (SD_MMC.remove(oldestFilename.c_str())) {
      Serial.printf("Removed oldest file: %s\n", oldestFilename.c_str());
    } else {
      Serial.printf("Failed to remove oldest file: %s\n", oldestFilename.c_str());
    }
  }
}

// Extract timestamp from the filename
uint32_t extractTimestamp(const char* filename) {
  int day, month, year, hour, minute, second;
  sscanf(filename, "BHOUSE-%02d-%02d-%04d-%02d-%02d-%02d.jpg", &day, &month, &year, &hour, &minute, &second);
  tmElements_t tm;
  tm.Day = day;
  tm.Month = month;
  tm.Year = year - 1970;
  tm.Hour = hour;
  tm.Minute = minute;
  tm.Second = second;
  return makeTime(tm);
}

#pragma GCC optimize("O3")
void uploadFileToApi(const String& filename) {
  WiFiClientSecure client;
  client.setInsecure(); // For testing purposes, disable SSL certificate verification
  HTTPClient http;
  String url = String("https://") + server + "/image/post";
  String boundary = "------------------------" + String(millis(), HEX);

  // Open the file
  File file = SD_MMC.open("/" + filename, FILE_READ);
  if (!file) {
    Serial.printf("Failed to open file for upload: %s\n", filename.c_str());
    return;
  }

  // Calculate the content length
  size_t contentLength = file.size() + boundary.length() + 28; // 28 = size of headers

  // Build the request headers
  http.begin(client, url);
  http.addHeader("Authorization", "Bearer " + authToken);
  http.addHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
  http.addHeader("Content-Length", String(contentLength));

  // Build the request body
  WiFiClient* stream = http.getStreamPtr();
  stream->print("--" + boundary + "\r\n");
  stream->print("Content-Disposition: form-data; name=\"user_id\"\r\n\r\n");
  stream->print("1\r\n");
  stream->print("--" + boundary + "\r\n");
  stream->print("Content-Disposition: form-data; name=\"image\"; filename=\"" + filename + "\"\r\n");
  stream->print("Content-Type: image/jpeg\r\n\r\n");

  // Write the file contents to the request body
  uint8_t buffer[1024];
  size_t bytesRead;
  while ((bytesRead = file.read(buffer, sizeof(buffer))) > 0) {
    stream->write(buffer, bytesRead);
    delay(10); // Add a short delay to give the ESP32-CAM time to handle the upload
  }

  // Close the request body
  stream->print("\r\n--" + boundary + "--\r\n");

  // Send the request and get the response
  int httpCode = http.POST("");
  String response = http.getString();

  // Print the response
  if (httpCode == HTTP_CODE_OK) {
    Serial.println("File uploaded. Server response:");
    Serial.println(response);
  } else if (httpCode == HTTP_CODE_UNAUTHORIZED) {
    Serial.println("Token invalid, attempting to log in again");
    if (login()) {
      // Retry the upload with the new token
      uploadFileToApi(filename);
    } else {
      Serial.println("Login failed");
    }
  } else {
    Serial.printf("File upload failed, error: %s\n", http.errorToString(httpCode).c_str());
    Serial.println("Server response:");
    Serial.println(response);
  }

  // Close the file and end the HTTP session
  file.close();
  client.stop(); // Add this line to close the WiFiClientSecure connection
  http.end();
}

