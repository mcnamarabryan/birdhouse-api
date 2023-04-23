# Birdhouse API

This repository contains the source code for the Birdhouse API, a RESTful API designed to work with the Birdhouse ESP32-CAM project. The API is built using Node.js, Express, and Sequelize ORM. It provides endpoints for user authentication and image uploads from the ESP32-CAM.

## Features

- User authentication using JWT
- Image upload from the ESP32-CAM
- Image storage on the server's file system
- Pagination support for image retrieval

## Prerequisites

- Node.js (v14 or higher)

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

Install dependencies:

``npm install``

Create a .env file in the root directory of the project with the following variables:
```
JWT_SECRET=your_jwt_secret_here
PORT=3000
DB_HOST=your_database_host_here
DB_PORT=your_database_port_here
DB_USERNAME=your_database_username_here
DB_PASSWORD=your_database_password_here
DB_NAME=your_database_name_here
```

Replace the variables with your own values.

Build and run the application with Docker Compose:

``docker-compose build && docker-compose up -d --force-recreate``

The Birdhouse API should now be running on http://localhost:3000.

## API Endpoints

### User Routes
POST /login/auth: Log in with an existing user
Image Routes
POST /api/images: Upload an image (requires authentication)
GET /api/images: Retrieve images with pagination (requires authentication)
GET /api/images/:id: Retrieve a specific image by its ID (requires authentication)
DELETE /api/images/:id: Delete a specific image by its ID (requires authentication)

## License

This project is licensed under the MIT License.

## Authors

Bryan McNamara

ChatGPT
