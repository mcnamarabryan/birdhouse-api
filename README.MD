# Birdhouse API

This is the API server for the Birdhouse application. It allows users to register, log in, upload images, and log messages.

## Dependencies

- bcrypt
- body-parser
- express
- jsonwebtoken
- multer
- mysql2

## How to use

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a .env file in the root directory with the following information:

    ```
    JWT_SECRET=<your_secret_key>
    DB_HOST=<your_db_host>
    DB_USER=<your_db_user>
    DB_PASSWORD=<your_db_password>
    DB_NAME=<your_db_name>
    ```

4. Start the server: `npm start`

### Endpoints

- `POST /api/login`: Login with username and password, returns JWT token
- `POST /api/register`: Register a new user with username and password, returns JWT token
- `POST /api/image`: Upload an image, requires JWT token
- `POST /api/log`: Log a message, requires JWT token

## How it works

The server is built with Node.js and Express, and uses a MySQL database to store user information, images, and logs. Bcrypt is used for password hashing, and jsonwebtoken is used to create and verify JWT tokens.

The server has middleware to verify JWT tokens on protected routes, and handles errors with a custom error handling middleware.

### File structure

The code is organized into the following directories:

- `routes`: Contains the route handlers for each endpoint
- `utils`: Contains utility functions and the token verification middleware
- `uploads`: Contains uploaded images

The root directory contains the `index.js` file, which starts the server, and the `package.json` file, which lists the dependencies and start script.

