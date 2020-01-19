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

# Start App
CMD npm start
EXPOSE 5000
