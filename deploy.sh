#!/bin/bash

# Exit on error
set -e

# Print debugging information
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Clean up any previous builds
echo "Cleaning up previous builds..."
rm -rf dist
rm -rf node_modules

# Install dependencies
echo "Installing dependencies..."
yarn install

# Create production env file if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "Creating .env.production..."
    cp .env.example .env.production
fi

# Build the application
echo "Building application..."
NODE_ENV=production yarn build

# Verify build output
echo "Verifying build output..."
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found!"
    exit 1
fi

echo "Contents of dist directory:"
ls -la dist

# Check for index.html
if [ ! -f "dist/index.html" ]; then
    echo "Error: dist/index.html not found!"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy dist \
  --project-name carbonledger-app \
  --branch production \
  --commit-dirty=true

echo "Deployment complete!"