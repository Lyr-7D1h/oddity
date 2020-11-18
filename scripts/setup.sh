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

# load modules
echo -e "\n\n${CYAN}MODULES: writing import files${NY}" && \
cd $ROOT/module_loader && \
npm start && \

echo -e "\n\n${CYAN}CLIENT: Installing dependencies${NY}" && \
cd $ROOT/client && \
npm ci && \

echo -e "\n\n${CYAN}CLIENT: Building minified static files${NY}" && \
npm run build