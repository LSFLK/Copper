#!/bin/bash

# remove containers

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)


# remove images

docker rmi copper-is
docker rmi copper-openldap