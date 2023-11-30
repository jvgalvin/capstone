# Remove existing minikube images
minikube image rm landmund/fastapi:20231120
minikube image rm landmund/postgres:20231120
minikube image rm landmund/nodejs:20231120

# Remove local images
docker rmi landmund/fastapi:20231120
docker rmi landmund/postgres:20231120
docker rmi landmund/nodejs:20231120
