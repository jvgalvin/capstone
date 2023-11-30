# Capstone
Application for the detection of dementia in Alzheimer's patients

# Prerequisites:
- Make sure that the dependencies in [requirements.txt](./requirements.txt) are installed (a VS Code Devcontainer is recommended)
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

## 0. Prerequisites
- Make sure that `minikube` is active (run `minikube start`)
- Delete the `node_modules` folder in the `ui\alzheimer-predict-ui`

## 1. Build images and load them to Minikube:
- Run [kube-setup.sh](kube-setup.sh) to build the images and start up Kubernetes.
- If the images have already been built and loaded to Minikube, run [kube-launch.sh](kube-launch.sh) instead.
- Use the URL provided at the end to access the UI App

## 2. Stoping the setup:
Run [kube-stop.sh](kube-stop.sh) to delete the Kubernetes service and deployments

## 3. Delete the setup:
Run [kube-delete.sh](kube-delete.sh) to unload images from Minikube and delete docker images.
