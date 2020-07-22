#!/bin/bash

# Mainly used for personal development

# Move to relative path and use pwd as cwd
cd `dirname $0`
ROOT=$(pwd)/..

cd $ROOT/server
alacritty -e /bin/bash npm run dev &
cd $ROOT/client
npm start
