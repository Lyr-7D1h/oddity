#
# Production Build: client + server
#


# TODO: switch alpine when armv7 works
FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Load modules
WORKDIR /usr/src/app
# TODO: needed in prod?
RUN ln -fs "$(pwd)/server/node_modules" "$(pwd)/modules/"  
WORKDIR /usr/src/app/module_loader
RUN npm ci --production
RUN npm start

# Build Client
WORKDIR /usr/src/app/client
RUN npm ci --production
RUN npm run build

# Build Server
WORKDIR /usr/src/app/server
# Install needed build dependencies
RUN npm ci 
RUN npm run build
# Remove build dependencies
RUN npm ci --production

# Start App
CMD npm run start:prod
EXPOSE 5000
