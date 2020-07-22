#!/bin/bash

CYAN='\033[0;36m'
NY='\033[0m'

# Move to relative path and use pwd as cwd
cd `dirname $0`
ROOT=$(pwd)/..

cd $ROOT/server && \

echo -e "\n\n${CYAN}Removing Database${NY}" && \
npx sequelize-cli db:drop && \

echo -e "\n\n${CYAN}Creating Database${NY}" && \
npx sequelize-cli db:create && \

echo -e "\n\n${CYAN}Executing module_loader to get most recent db files${NY}" && \
node module_loader

echo -e "\n\n${CYAN}Executing models_sync to load tables${NY}" && \
node models_sync

# echo -e "${CYAN}Executing Migrations${NY}" && \
# npx sequelize-cli db:migrate && \

echo -e "\n\n${CYAN}Seeding Database${NY}" && \
npx sequelize-cli db:seed:all --debug=true
