#!/usr/bin/env bash

SERVER="$(pwd)/server"
CLIENT="$(pwd)/client"

start_server() {
	echo "[PROD] Starting server"
	cd $SERVER
	ENV="production"
	npm start
}
start_server_dev() {
	echo "[DEV] Starting Server"
	cd $SERVER
	npm run dev
}

build_client() {
	echo "Building client"
	cd $CLIENT
	npm run build
	#start_server
}
start_client() {
	echo "Starting client"
	cd $CLIENT
	npm start &
}

if [[ $1 = "dev" ]]; then
	start_client
	start_server_dev
else  
	build_client
	start_server
fi

echo "your argument is $1"
