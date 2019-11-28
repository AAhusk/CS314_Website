#!/bin/bash

#LICENSE: this script was written by Ben Gillett, and posted on Piazza
trap 'printf "\nExiting...\n"; trap - SIGTERM && kill -- -$$' SIGINT SIGTERM EXIT
# make sure to pick a server and set your username
ssh -L 56247:faure.cs.colostate.edu:3306 "$CS_USERNAME"@whatever-server.cs.colostate.edu -N &
sleep 1
mvn package
java -jar target/server-*.jar 31400 &
export BROWSER='none'
run --prefix client dev &

sleep 0.1
read -rp "Press any key to exit..."