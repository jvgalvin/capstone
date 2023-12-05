#!/bin/bash

bash ./kube-delete.sh

# Build local images
docker build . -t alzheimer/fastapi:20231120 -f project/Dockerfile
docker build . -t alzheimer/postgres:20231120 -f db_container/Dockerfile
docker build . -t alzheimer/nodejs:20231120 -f ui/alzheimer-predict-ui/Dockerfile

# Push local images to minikube
minikube image load alzheimer/fastapi:20231120
minikube image load alzheimer/postgres:20231120
minikube image load alzheimer/nodejs:20231120

# Call launch script
bash ./kube-start.sh