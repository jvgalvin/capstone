# Start Kuberneted Deployment and Service
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
sleep 10
minikube service myapp-service --url