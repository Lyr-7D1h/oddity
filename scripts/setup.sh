#!/bin/bash

CYAN='\033[0;36m'
NY='\033[0m'

# Move to relative path and use pwd as cwd
cd `dirname $0`
ROOT=$(pwd)/..




echo -e "\n\n${CYAN}SERVER: Installing dependencies${NY}" && \
cd $ROOT/server && \
npm ci && \

# link node_modules after done installing
echo -e "\n\n${CYAN}MODULES: Linking node_modules from server to modules${NY}" && \
ln -fs "${ROOT}/server/node_modules" "${ROOT}/modules/" && \
echo OK && \

#echo -e "\n\n${CYAN}SERVER: Executing module_loader to copy and paste DB Files${NY}" && \
#node module_loader && \

#echo -e "\n\n${CYAN}SERVER: Executing models_sync to create all tables${NY}" && \
#node models_sync && \

# SEEDING IS INTEGRATED IN SERVER
# Depends on Modules being loaded
#echo -e "\n\n${CYAN}SERVER: Seeding database${NY}" && \
#npx sequelize-cli db:seed:all


echo -e "\n\n${CYAN}CLIENT: Installing dependencies${NY}" && \
cd $ROOT/client && \
npm ci && \

echo -e "\n\n${CYAN}CLIENT: Building minified static files${NY}" && \
npm run build