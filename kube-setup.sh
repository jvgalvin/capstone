#!/bin/bash

bash ./kube-delete.sh

# Build local images
docker build . -t landmund/fastapi:20231120 -f project/Dockerfile
docker build . -t landmund/postgres:20231120 -f db_container/Dockerfile
docker build . -t landmund/nodejs:20231120 -f ui/alzheimer-predict-ui/Dockerfile

# Push local images to minikube
minikube image load landmund/fastapi:20231120
minikube image load landmund/postgres:20231120
minikube image load landmund/nodejs:20231120

# Call launch script
bash ./kube-launch.sh