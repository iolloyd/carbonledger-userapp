#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the application
echo "Building application..."
yarn build

# Deploy to Cloudflare Pages as preview
echo "Deploying preview to Cloudflare Pages..."
wrangler pages deploy dist \
  --project-name carbonledger-app \
  --branch preview \
  --commit-hash $(git rev-parse HEAD) \
  --commit-message "Preview deployment" \
  --commit-dirty=true 