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


### On a linux system with gnome-terminal
run `./setup.sh` and after that `./dev.sh`

### On a linux system without gnome-terminal
run `./setup.sh`

Run client in a process/window
```
cd client
npm start
```
Run server in a seperate process/window
```
cd server
npm run dev
```


## Credits
Thanks to orbital for the artwork <3
