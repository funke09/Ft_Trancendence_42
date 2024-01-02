# Use the official Node.js image as the base image
FROM node:20.6.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install \
    && npm i -g @nestjs/cli \
    && npm i -g prisma \
    && npx prisma generate

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "start:dev"]
