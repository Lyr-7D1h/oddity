FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Build Server
WORKDIR /usr/src/app/server
RUN npm ci --production

# Create module_loader_imports file
RUN node module_loader

# Link node_modules for modules
WORKDIR /usr/src/app
RUN ln -fs "$(pwd)/server/node_modules" "$(pwd)/modules/" 

# Build Client
WORKDIR /usr/src/app/client
RUN npm ci --production
RUN npm run build

# Start App
WORKDIR /usr/src/app/server
CMD npm start
EXPOSE 5000
