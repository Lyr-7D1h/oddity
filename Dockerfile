FROM node:latest

# App Directory
# WORKDIR /usr/src/app


# # Run start script
# RUN chmod +x start.sh
# RUN ./start.sh

# # Move package-lock.json and package.json
# COPY client/package*.json ./
# COPY server/package*.json ./





RUN groupadd api-group
RUN useradd -ms /bin/bash api-user
WORKDIR /app
RUN chown -R api-user:api-group /app

USER api-user
COPY package.json /app/
RUN yarn install
COPY . /app/
COPY src/ /app/
CMD npm start
EXPOSE 3000