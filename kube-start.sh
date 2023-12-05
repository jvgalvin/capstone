# Start Kubernetes Deployment and Service
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
sleep 10
kubectl port-forward service/myapp-service 8000:8000 & kubectl port-forward service/myapp-ui-service 3000:3000 & 