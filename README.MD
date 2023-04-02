# Birdhouse API

An API server built with Express.js for uploading images and posting messages to a log table. The project uses MySQL as the database and provides API endpoints to interact with the data.

This project was built with the help of ChatGPT-4, an AI language model by OpenAI.

## Getting Started

These instructions will help you get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 14 or higher)
- MySQL server

### Installing

Clone the repository to your local machine:

```
git clone https://github.com/mcnamarabryan/birdhouse-api.git
```
Change to the project directory:
```
cd birdhouse-api
```
Modify the env.docker.birdhouse-api and env.docker.mysql files in the root directory of the project with the appropriate content to configure the database connection and environment variables for your Docker setup.
Run Docker build:
```
docker-compose build
docker-compose up -d
```
In database/migrations, run the SQL provided.

The application will be accessible at http://localhost:3000.

### API Endpoints

The API server provides the following endpoints:

  POST /api/images: Upload an image file to the server.

  POST /api/messages: Post a message to the log table.

### Built With

  Express - Fast, unopinionated, minimalist web framework for Node.js
  
  MySQL - Open-source relational database management system

### Contributing

This project was developed with the help of ChatGPT-4 by OpenAI. Contributions to this project are welcome. Please feel free to submit issues and pull requests.

License

This project is licensed under the MIT License - see the LICENSE file for details.