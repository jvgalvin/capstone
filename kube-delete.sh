# Remove existing minikube images
minikube image rm docker.io/alzheimer/fastapi:20231120
minikube image rm docker.io/alzheimer/postgres:20231120
minikube image rm docker.io/alzheimer/nodejs:20231120

sleep 5

# Remove local images
docker rmi alzheimer/fastapi:20231120
docker rmi alzheimer/postgres:20231120
docker rmi alzheimer/nodejs:20231120
