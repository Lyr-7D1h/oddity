FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Build Client
WORKDIR /usr/src/app/client
RUN npm ci
RUN npm run build
# Test Client
RUN npm test

# Build Server
WORKDIR /usr/src/app/server
RUN cd ../server/
RUN npm ci
# Test Server
RUN DB_HOST=postgres npm test

# Start App
CMD npm start
EXPOSE 5000