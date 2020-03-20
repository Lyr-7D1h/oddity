#!/bin/bash

cd client
gnome-terminal --tab --command 'npm start'

cd ../server
gnome-terminal --tab --active --command 'npm run dev'
