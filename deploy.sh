#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting deployment process...${NC}"

# Deploy backend worker first
echo -e "${BLUE}Deploying backend worker...${NC}"
cd worker
yarn install
yarn build
yarn deploy
cd ..

# Deploy frontend to Cloudflare Pages
echo -e "${BLUE}Deploying frontend...${NC}"
yarn install
yarn build

# Deploy to Cloudflare Pages using wrangler
echo -e "${BLUE}Publishing to Cloudflare Pages...${NC}"
yarn wrangler pages deploy dist --project-name=carbonledger

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${BLUE}Frontend: https://carbonledger.pages.dev${NC}"
echo -e "${BLUE}Backend: https://api.carbonledger.com${NC}"
