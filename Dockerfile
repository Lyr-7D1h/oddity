#
# Production Build: client + server
#


FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Build Server
WORKDIR /usr/src/app/server
RUN yarn install 
RUN yarn build

# Load modules
WORKDIR /usr/src/app
# TODO: needed in prod?
RUN ln -fs "$(pwd)/server/node_modules" "$(pwd)/modules/"  
WORKDIR /usr/src/app/module_loader
RUN yarn install --production
RUN yarn start

# Build Client
WORKDIR /usr/src/app/client
RUN yarn install --production
RUN yarn build

# Start App
WORKDIR /usr/src/app/server
CMD yarn start:prod
EXPOSE 5000
