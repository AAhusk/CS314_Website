#!/bin/bash

if [ ! -d "./client/node_modules" ]; then
  # install all dependencies into node_modules
  npm install --prefix client
fi

# compile and bundle client side JavaScript into a single distribution
npm run bundle --prefix client
exit $?
