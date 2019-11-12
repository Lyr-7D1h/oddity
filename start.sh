#!/usr/bin/env bash

SERVER="$(pwd)/server"
CLIENT="$(pwd)/client"

start_server_prod() {
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
elif [[ $1 = "prod" ]]; then 
	build_client
	start_server_prod
else 
	cd $CLIENT
	npm ci 

	cd $SERVER
	npm ci

	build_client
	start_server_prod
fi


