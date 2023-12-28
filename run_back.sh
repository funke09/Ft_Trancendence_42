#!/bin/bash

set -e
# Run Docker Compose
docker compose -f docker-compose.yml up -d

# Copy .env file to backend directory
cp .env backend/

# Change directory to the backend
cd backend || exit

# Install Node.js dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run Prisma database migrations
npx prisma migrate dev

# Start the backend server in development mode
npm run start:dev

