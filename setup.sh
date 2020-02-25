#!/bin/bash

cd client
npm ci
npm run build

cd ../server
npm ci

cd ..
ln -s "$(pwd)/server/node_modules" "$(pwd)/modules/"
