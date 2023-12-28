#!/bin/bash


set -e
# Load nvm if not already loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Specify Node.js version using nvm
nvm use 18.19.0

# Change directory to the frontend
cd frontend || exit

# Remove existing node_modules directory
rm -rf node_modules

# Install Node.js dependencies
npm install

# Start the frontend development server
npm run dev

