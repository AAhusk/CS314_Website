#!/bin/bash

check_error() {
  if [ $1 -ne 0 ]
  then
    echo "run.sh: Build failed!"
    exit $1
  fi
}

./build_client.sh
check_error $?
./build_server.sh
check_error $?
./run_server.sh
