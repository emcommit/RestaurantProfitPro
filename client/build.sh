#!/bin/bash
echo "Node.js version:"
node -v
echo "npm version:"
npm -v
echo "Listing node_modules/.bin:"
ls -la node_modules/.bin
echo "Checking for vite:"
npm list vite || echo "vite not found"
echo "Running build..."
./node_modules/.bin/vite build