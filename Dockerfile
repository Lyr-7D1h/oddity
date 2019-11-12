FROM node:latest

# App Directory
WORKDIR /usr/src/app

# Moves files to App Directory
COPY . /usr/src/app

# Create User
RUN useradd -s /bin/bash -M app

# Set permissions for files
RUN chown -R app:app /usr/src/app
RUN chmod +x /usr/src/app/start.sh

# Start App
USER app
RUN /usr/src/app/start.sh

EXPOSE 5000

# # Run Start Script
# RUN chmod +x start.sh
# RUN chown app:app start.sh

# USER app

# RUN ./start.sh

# EXPOSE 5000

# # Move package-lock.json and package.json
# COPY client/package*.json ./
# COPY server/package*.json ./





# RUN groupadd api-group
# RUN useradd -ms /bin/bash api-user
# WORKDIR /app
# RUN chown -R api-user:api-group /app

# USER api-user
# COPY package.json /app/
# RUN yarn install
# COPY . /app/
# COPY src/ /app/
# CMD npm start
# EXPOSE 3000