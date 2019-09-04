#!/bin/bash

# compile server side Java into a single executable JAR file
mvn clean && mvn package
exit $?
