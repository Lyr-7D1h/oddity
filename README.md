# ODDITY

![Tests](https://github.com/OddityServers/oddity/workflows/Tests/badge.svg)

## Introduction

This is the base of the project. Web interface (client) + API (server)

- As a database we use PostgreSQL
- We have a client for user interacting with the API this is a react app.
- We have a server for inter-domain communications this is an API made with Fasitfy this is what communicates with the Database

## Setup

Requirements

- npm installed (V6.14 used)
- node installed (V13.1 used)
- postgresql (V12.2 used)

### Linux Based Systems (or in Windows WLS)

run `./setup.sh`

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
npm run dev
```

This will start the server in a development mode. It will proxy requests to the client development server if it isn't prefixed with `/api` or `/documentation`

## Credits

Thanks to orbital for the artwork <3
