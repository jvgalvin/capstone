# Remove existing minikube images
minikube image rm docker.io/landmund/fastapi:20231120
minikube image rm docker.io/landmund/postgres:20231120
minikube image rm docker.io/landmund/nodejs:20231120

sleep 5

# Remove local images
docker rmi landmund/fastapi:20231120
docker rmi landmund/postgres:20231120
docker rmi landmund/nodejs:20231120
