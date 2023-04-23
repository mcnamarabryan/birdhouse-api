# Birdhouse API

This repository contains the source code for the Birdhouse API, a RESTful API designed to work with the Birdhouse ESP32-CAM project. The API is built using Node.js, Express, and Sequelize ORM. It provides endpoints for user authentication and image uploads from the ESP32-CAM.

## Features

- User authentication using JWT
- Image upload from the ESP32-CAM
- Image storage on the server's file system
- Pagination support for image retrieval

## Prerequisites

- Docker

## Libraries Used

- Express: Fast, unopinionated, minimalist web framework for Node.js
- Sequelize: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server
- jsonwebtoken: JSON Web Token implementation for Node.js
- Multer: Middleware for handling multipart/form-data (file uploads)

## Installation

Clone the repository:

``git clone https://github.com/mcnamarabryan/birdhouse-api.git``

Change to the project directory:

``cd birdhouse-api``

Modify the env.docker.birdhouse-api and env.docker.mysql files in the root directory of the project with preferred values.

Build and run the application with Docker Compose:

``docker-compose build && docker-compose up -d --force-recreate``

The Birdhouse API should now be running on http://localhost:3000.

The birdhouse-api/database directory has a migration that will fill out the database, and a seeder that will create a user:

``node createUser <username> <password>``

## API Endpoints

### User Routes
```
POST /login/auth: Log in with an existing user
```
### Image Routes
```
POST /api/images: Upload an image (requires authentication)
GET /api/images: Retrieve images with pagination (requires authentication)
GET /api/images/:id: Retrieve a specific image by its ID (requires authentication)
DELETE /api/images/:id: Delete a specific image by its ID (requires authentication)
```

## License

This project is licensed under the MIT License.

## Authors

Bryan McNamara

ChatGPT
