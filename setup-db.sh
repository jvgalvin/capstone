#!/bin/bash
yellow='\033[0;33m'
printf "${yellow}Adding Alzheimer Predict Database..."
ALZHEIMER_PREDICT_DB=pgsql-alzheimer-predict
docker stop $(docker ps -aqf "name=$ALZHEIMER_PREDICT_DB")
docker rm $(docker ps -aqf "name=$ALZHEIMER_PREDICT_DB")
docker rmi $(docker images -q postgres)

docker run --name $ALZHEIMER_PREDICT_DB -e POSTGRES_PASSWORD=12345678 -e POSTGRES_USER=alzheimer_predict_user -e POSTGRES_DB=alzheimer_predict -p 5432:5432 -d postgres

sleep 20

node ./ui/alzheimer-predict-ui/src/setup-db.js