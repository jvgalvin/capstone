#!/bin/bash

# Start minikube
minikube start

# Remove existing minikube images
minikube image rm landmund/fastapi:20231120
minikube image rm landmund/postgres:20231120
minikube image rm landmund/nodejs:20231120

# Remove local images
docker rmi landmund/fastapi:20231120
docker rmi landmund/postgres:20231120
docker rmi landmund/nodejs:20231120

# Build local images
docker build . -t landmund/fastapi:20231120 -f project/Dockerfile
docker build . -t landmund/postgres:20231120 -f db_container/Dockerfile
docker build . -t landmund/nodejs:20231120 -f ui/alzheimer-predict-ui/Dockerfile

# Push local images to minikube
minikube image load landmund/fastapi:20231120
minikube image load landmund/postgres:20231120
minikube image load landmund/nodejs:20231120