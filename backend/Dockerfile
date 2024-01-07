# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN apt-get update && \
    apt-get install -y build-essential
RUN npm install \
    && npm install --target_arch=x64 --target_platform=linux --target_libc=glibc -f \
    && npm i -g @nestjs/cli \
    && npm i -g prisma \
    && npx prisma generate \
    && npx prisma migrate dev


# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 5000

RUN npm run build
# Command to run the application
CMD ["npm", "run", "start"]
