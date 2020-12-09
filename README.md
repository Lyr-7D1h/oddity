# ODDITY

A completely modulare web application, aimed for gaming communities. Let your community flourish and reach its full potential by using this application. Our main priorities are ease of use and developer friendliness. We use the most recent and modern technologies available to us for a very fast and stable environment.

![CI](https://github.com/OddityServers/oddity/workflows/CI/badge.svg)

## Introduction

This is the base of the project. Web interface (client) + API (server)

- As a database we use PostgreSQL
- We have a client for user interacting with the API this is a react app.
- We have a server for inter-domain communications this is an API made with Fasitfy

## Setup

### Docker Compose

Requirements

- Docker
- Docker Compose

Check out the application without any setup with docker-compose

Hint: some features might not work because of invalid environment variables

```
docker-compose up
```

Application available on localhost:5000

### Manually (in development mode)

#### Environment Variables

Required:

DB_NAME - Name of the Postgres database\
DB_USERNAME - Name of the Postgres user\
DB_PASSWORD - Password of the Postgres user\
SESSION_SECRET - The secret used to create sessions MUST BE 32+ CHARACTERS\
CAPTCHA_CLIENT - Captcha V2 checkbox Site key (https://www.google.com/recaptcha/admin/create) \
CAPTCHA_SERVER - Captcha V2 checkbox Secret key (https://www.google.com/recaptcha/admin/create) (you can also fill in a random string but then captcha will not work)

Optional:

DB_HOST=localhost - Host of the Postgres database, can be either an IP or Domain Name\
DB_LOGGING_ENABLED=false - Show queries in the logs

#### Build and Run

run `./scripts/setup.sh` (or run commands manually)

Run client

```
cd client
npm start
```

This will start a development server which is intended only for development.
This will refresh modified files.

Run server in a seperate process/window

```
cd server
npm start
```

This will start the server in a development mode. It will proxy requests to the client development server if it isn't prefixed with `/api` or `/documentation`

## Credits

Thanks to orbital for the artwork <3
