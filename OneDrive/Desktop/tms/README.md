# Travel Management System - Kubernetes Deployment

This repository contains the complete Kubernetes deployment configuration for the Travel Management System (TMS) fullstack application.

## Architecture

- **Frontend**: React + Vite application served with Nginx
- **Backend**: Spring Boot application (Java 21)
- **Database**: MySQL 8.0

## Prerequisites

- Docker installed
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured
- Docker Hub account (or other container registry)

## Project Structure

```
tms/
├── frontend/
│   ├── Dockerfile
│   ├── k8s/
│   │   ├── frontend-deployment.yaml
│   │   └── frontend-service.yaml
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── k8s/
│   │   ├── backend-deployment.yaml
│   │   └── backend-service.yaml
│   └── src/
└── k8s-deployment.yaml (Complete deployment file)
```

## Deployment Steps

### Step 1: Build Docker Images

#### Build Backend Image
```bash
cd backend
docker build -t <your-dockerhub-username>/tms-backend:latest .
docker push <your-dockerhub-username>/tms-backend:latest
```

#### Build Frontend Image
```bash
cd frontend
docker build -t <your-dockerhub-username>/tms-frontend:latest .
docker push <your-dockerhub-username>/tms-frontend:latest
```

### Step 2: Update Kubernetes Deployment Files

Update the image names in the deployment files:
- Replace `<your-dockerhub-username>` with your Docker Hub username in:
  - `k8s-deployment.yaml`
  - `backend/k8s/backend-deployment.yaml`
  - `frontend/k8s/frontend-deployment.yaml`

### Step 3: Deploy to Kubernetes

#### Option A: Deploy using combined file
```bash
kubectl apply -f k8s-deployment.yaml
```

#### Option B: Deploy individually
```bash
# Deploy MySQL
kubectl apply -f k8s-deployment.yaml --selector='app=mysql'

# Deploy Backend
kubectl apply -f backend/k8s/backend-deployment.yaml
kubectl apply -f backend/k8s/backend-service.yaml

# Deploy Frontend
kubectl apply -f frontend/k8s/frontend-deployment.yaml
kubectl apply -f frontend/k8s/frontend-service.yaml
```

### Step 4: Verify Deployment

```bash
# Check all pods
kubectl get pods

# Check all services
kubectl get services

# Check deployments
kubectl get deployments
```

### Step 5: Access the Application

- **Frontend**: http://localhost:30080 or http://<node-ip>:30080
- **Backend API**: http://localhost:30081 or http://<node-ip>:30081

If using Minikube:
```bash
minikube service tms-frontend
minikube service tms-backend
```

## Services Exposed

| Service | Type | Port | NodePort | Description |
|---------|------|------|----------|-------------|
| tms-frontend | NodePort | 80 | 30080 | Frontend web application |
| tms-backend | NodePort | 8081 | 30081 | Backend REST API |
| mysql | ClusterIP | 3306 | - | MySQL database (internal) |

## Scaling

To scale the deployments:

```bash
# Scale backend
kubectl scale deployment tms-backend --replicas=3

# Scale frontend
kubectl scale deployment tms-frontend --replicas=3
```

## Troubleshooting

### Check Pod Logs
```bash
# Backend logs
kubectl logs -l app=tms-backend

# Frontend logs
kubectl logs -l app=tms-frontend

# MySQL logs
kubectl logs -l app=mysql
```

### Check Pod Status
```bash
kubectl describe pod <pod-name>
```

### Restart Deployment
```bash
kubectl rollout restart deployment/tms-backend
kubectl rollout restart deployment/tms-frontend
```

## Environment Variables

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: jdbc:mysql://mysql:3306/traveldb
- `SPRING_DATASOURCE_USERNAME`: root
- `SPRING_DATASOURCE_PASSWORD`: root
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: update

### Frontend Environment Variables
- `REACT_APP_BACKEND_URL`: http://tms-backend:8081

## Clean Up

To remove all resources:

```bash
kubectl delete -f k8s-deployment.yaml
```

Or individually:

```bash
kubectl delete deployment tms-frontend tms-backend mysql
kubectl delete service tms-frontend tms-backend mysql
kubectl delete pvc mysql-pvc
```

## GitHub Repositories

- Frontend: https://github.com/suneethabulla/travel-frontend
- Backend: https://github.com/suneethabulla/travel-backend

## License

This project is for educational purposes.
