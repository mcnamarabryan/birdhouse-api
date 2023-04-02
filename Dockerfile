# Set the base image to use
FROM node:14

# Set a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./birdhouse-api/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./birdhouse-api/ .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
