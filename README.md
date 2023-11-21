# Capstone
Application for the detection of dementia in Alzheimer's patients

# Prerequisites:
- Make sure that the dependencies in [requirements.txt](./requirements.txt) are installed
- Make sure that minikube is installed
- Make sure that your minikube is started (by running `minikube start`)
- Make sure that 'node' and its module 'pg' are installed

# How to build API and DB locally without containers:

## Steps
1. Navigate the the root folder `/capstone`
2. Run the following command to start up the database: `bash setup-db.sh`
3. Run the following command to start up the API: `uvicorn project.src.main:app`
4. Copy the URL/link from the logs and run in a browser

# How to build containers and Kubernetes deployment

## 1. Build API Container:
1. Navigate to the `/capstone/project` folder
2. Run the following command: `docker build -t <dockerhub_username>/<image_name>:<tag> .` (this will help label the image)
3. Push image to registry using the following command: `minikube image load <dockerhub_username>/<image_name>:<tag> .`

## 2. Build DB Container:
1. Navigate to the `/capstone/db_container` folder
2. Run the following command: `docker build -t <dockerhub_username>/<image_name>:<tag> .` (this will help label the image)
3. Push image to registry using the following command: `minikube image load <dockerhub_username>/<image_name>:<tag> .`

## 3. Launch Kubernetes
1. Navigate to the `/capstone/kubernetes` folder
2. Make sure that the `db` and `myapp` containers have the proper images in their settings
3. Run the following commands to launch the Kubernetes deployment and service:
    - `kubectl apply -f deployment.yaml`
    - `kubectl apply -f service.yaml`
4. Run the following command to get the API URL: `minikube service myapp-service --url`
5. Use the URL to access the API

## 4. How to shut down Kubernetes
1. Run the following commands to remove the deployment and service
    - `kubectl delete deployment myapp`
    - `kubectl delete service myapp-service`