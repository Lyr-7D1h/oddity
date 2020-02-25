#!/bin/bash

CYAN='\033[0;36m'
NY='\033[0m'

echo -e "\n\n${CYAN}CLIENT: Installing dependencies${NY}" && \
cd client && \
npm ci && \
echo -e "\n\n${CYAN}CLIENT: Building minified static files${NY}" && \
npm run build && \

echo -e "\n\n${CYAN}SERVER: Installing dependencies${NY}" && \
cd ../server && \
npm ci && \

echo -e "\n\n${CYAN}MODULES: Linking node_modules from server to modules${NY}" && \
cd .. && \
ln -s "$(pwd)/server/node_modules" "$(pwd)/modules/"
