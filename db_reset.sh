CYAN='\033[0;36m'
NY='\033[0m'

cd server && \

echo -e "\n\n${CYAN}Removing Database${NY}" && \
npx sequelize-cli db:drop && \

echo -e "\n\n${CYAN}Creating Database${NY}" && \
npx sequelize-cli db:create && \

echo -e "\n\n${CYAN}Starting Server To Load Tables ${NY}" && \
timeout 5 npm start

#echo -e "${CYAN}Executing Migrations${NY}" && \
#npx sequelize-cli db:migrate && \

echo -e "\n\n${CYAN}Seeding Database${NY}" && \
npx sequelize-cli db:seed:all
