#!/bin/bash

# Mainly used for personal development

# Move to relative path and use pwd as cwd
cd `dirname $0`
ROOT=$(pwd)/..

cd $ROOT/server
alacritty -e yarn start &
cd $ROOT/client
yarn start
