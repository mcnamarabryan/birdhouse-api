# Birdhouse API

This project is an API server built with the Express framework. It provides two main API endpoints: one for uploading images to the `images` table in the database, and another for posting messages to the `logs` table.

## Features

- Upload images to the `images` table in the database
- Post messages to the `logs` table in the database

## Installation

1. Clone this repository:

```sh
git clone https://github.com/mcnamarabryan/birdhouse-api.git
```
2. Install the required dependencies:
```
cd birdhouse-api
npm install
```
3. Set up the environment variables for the database configuration:
- Modify env.docker.birdhouse-api in the root directory of the project with the following content:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```
- Update the env.docker.mysql file in the root directory of the project with the corresponding values for MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD.
Replace your_db_host, your_db_user, your_db_password, and your_db_name with your actual database credentials.

4. Run the server:
```
npm start
```
The server should be running at http://localhost:3000.

### API Endpoints

- Upload an image:
- - Endpoint: POST /upload-image
- - Parameters: user_id (integer), image (multipart file)
- Post a message:
- - Endpoint: POST /post-message
- - Parameters: user_id (integer), message (string)

### Acknowledgements

This project was developed with the assistance of OpenAI's ChatGPT-4, which helped in writing the code and providing guidance.

Contributors

Bryan McNamara (mcnamarabryan)
ChatGPT-4 by OpenAI