# Use the official Node.js image as the base image
FROM node:18.19.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Create a non-root user and switch to it
RUN useradd -m myuser
USER myuser

# Expose the port that the app will run on
EXPOSE 3000

# Optionally: Define a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Command to run the application
CMD ["npm", "run", "start"]
