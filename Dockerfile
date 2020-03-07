FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Build Client
WORKDIR /usr/src/app/client
RUN npm ci
RUN npm run build

# Build Server
WORKDIR /usr/src/app/server
RUN cd ../server/
RUN npm ci

# Link node_modules for modules
WORKDIR /usr/src/app
RUN ln -fs "$(pwd)/server/node_modules" "$(pwd)/modules/" 

# Load module Files

# Start App
CMD npm start
EXPOSE 5000
