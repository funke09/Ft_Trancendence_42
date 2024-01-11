# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN apt-get update && \
    apt-get install -y build-essential netcat-openbsd && \
    npm install \
    && npm install --target_arch=x64 --target_platform=linux --target_libc=glibc -f

# Copy the rest of the application code to the container
COPY . .
COPY script.sh /script.sh
RUN chmod +x /script.sh

# Generate Prisma Client
RUN npx prisma generate --schema ./schema.prisma

# Expose the port that the app will run on
EXPOSE 5000

# Command to run the application with script script
CMD /script.sh && npx prisma migrate dev --name init && npm run build && npm run start
