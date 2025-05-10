#!/bin/bash
echo "Current directory:"
pwd
echo "Node.js version:"
node -v
echo "Yarn version:"
yarn -v
echo "Installing dependencies..."
yarn install
echo "Listing node_modules/.bin:"
ls -la node_modules/.bin
echo "Checking for vite:"
yarn list vite || echo "vite not found"