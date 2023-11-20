# Capstone
Application for the detection of dementia in Alzheimer's patients

# How to build API and DB locally without containers:

## Prerequisites:
Make sure that the dependencies in [requirements.txt](./requirements.txt) are installed.

## Steps
1. Navigate the the root folder `/capstone`
2. Run the following command to start up the database: `bash run.sh`
3. Run the following command to start up the API: `uvicorn project.src.main:app`
4. Copy the URL/link from the logs and run in a browser

# How to build containers and Kubernetes deployment

## How to build docker images:
1. Run the following command: `docker build -t <dockerhub_username>/<image_name>:<tag> .` (this will help label images)
2. Push image to registry using the following command: `docker push <dockerhub_username>/<image_name>:<tag> .`
