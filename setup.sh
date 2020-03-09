#!/bin/bash

CYAN='\033[0;36m'
NY='\033[0m'


echo -e "\n\n${CYAN}SERVER: Installing dependencies${NY}" && \
cd server && \
npm ci && \

echo -e "\n\n${CYAN}SERVER: Seeding database${NY}" && \
npx sequelize-cli db:seed:all

echo -e "\n\n${CYAN}MODULES: Linking node_modules from server to modules${NY}" && \
cd .. && \
ln -fs "$(pwd)/server/node_modules" "$(pwd)/modules/" && \
echo OK && \

echo -e "\n\n${CYAN}SERVER: Starting server to load Tables & Modules${NY}" && \
cd server && \
node module_loader && \
# timeout 5 npm start 


echo -e "\n\n${CYAN}CLIENT: Installing dependencies${NY}" && \
cd ../client && \
npm ci && \
echo -e "\n\n${CYAN}CLIENT: Building minified static files${NY}" && \
npm run build