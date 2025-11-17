# TMS Kubernetes Deployment - Quick Start Guide

## 📋 Project Summary

This repository contains the complete Kubernetes deployment configuration for the Travel Management System (TMS) fullstack application, including:
- ✅ Frontend (React + Vite) with Dockerfile
- ✅ Backend (Spring Boot) with Dockerfile
- ✅ Kubernetes Deployment YAMLs for Frontend and Backend
- ✅ Kubernetes Service YAMLs for Frontend and Backend
- ✅ MySQL Database deployment configuration
- ✅ Complete deployment documentation

## 🔗 GitHub Repository

**Updated Repository URL**: https://github.com/Shanawaz992/FPA-AI

## 📦 What's Included

```
tms/
├── README.md                    # Complete deployment guide
├── k8s-deployment.yaml         # Combined Kubernetes deployment file
├── frontend/
│   ├── Dockerfile              # Multi-stage build with Nginx
│   ├── k8s/
│   │   ├── frontend-deployment.yaml
│   │   └── frontend-service.yaml
│   └── src/                    # React application source
├── backend/
│   ├── Dockerfile              # Multi-stage build with Maven
│   ├── k8s/
│   │   ├── backend-deployment.yaml
│   │   └── backend-service.yaml
│   └── src/                    # Spring Boot application source
```

## 🚀 Quick Deployment Steps

### Step 1: Build and Push Docker Images

You need to build Docker images and push them to Docker Hub (or any container registry):

```bash
# Login to Docker Hub
docker login

# Build and push backend image
cd backend
docker build -t <your-dockerhub-username>/tms-backend:latest .
docker push <your-dockerhub-username>/tms-backend:latest

# Build and push frontend image
cd ../frontend
docker build -t <your-dockerhub-username>/tms-frontend:latest .
docker push <your-dockerhub-username>/tms-frontend:latest
```

### Step 2: Update Image Names in Deployment Files

Update `<your-dockerhub-username>` in the following files:
- `k8s-deployment.yaml` (lines with image specifications)
- `backend/k8s/backend-deployment.yaml`
- `frontend/k8s/frontend-deployment.yaml`

### Step 3: Deploy to Kubernetes

```bash
# Deploy everything at once
kubectl apply -f k8s-deployment.yaml

# Or deploy individually
kubectl apply -f backend/k8s/
kubectl apply -f frontend/k8s/
```

### Step 4: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments
```

### Step 5: Access the Application

- **Frontend**: http://localhost:30080 or http://<node-ip>:30080
- **Backend API**: http://localhost:30081 or http://<node-ip>:30081

For Minikube users:
```bash
minikube service tms-frontend
minikube service tms-backend
```

## 📊 Kubernetes Resources Created

| Resource Type | Name | Replicas | Port | NodePort |
|--------------|------|----------|------|----------|
| Deployment | tms-frontend | 2 | 80 | - |
| Service | tms-frontend | - | 80 | 30080 |
| Deployment | tms-backend | 2 | 8081 | - |
| Service | tms-backend | - | 8081 | 30081 |
| Deployment | mysql | 1 | 3306 | - |
| Service | mysql | - | 3306 | - |
| PVC | mysql-pvc | - | - | - |

## 🔧 Configuration Details

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: jdbc:mysql://mysql:3306/traveldb
- `SPRING_DATASOURCE_USERNAME`: root
- `SPRING_DATASOURCE_PASSWORD`: root
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: update

### Frontend Environment Variables
- `REACT_APP_BACKEND_URL`: http://tms-backend:8081

### Database Configuration
- Database: MySQL 8.0
- Database Name: traveldb
- Storage: 5Gi (PersistentVolumeClaim)

## 📝 Submission Information

**Updated GitHub Repository URL**: https://github.com/Shanawaz992/FPA-AI

**Submission Form**: https://tinyurl.com/endsemsubmission

## 🛠️ Troubleshooting

### View Logs
```bash
kubectl logs -l app=tms-frontend
kubectl logs -l app=tms-backend
kubectl logs -l app=mysql
```

### Restart Deployments
```bash
kubectl rollout restart deployment/tms-frontend
kubectl rollout restart deployment/tms-backend
```

### Scale Deployments
```bash
kubectl scale deployment tms-frontend --replicas=3
kubectl scale deployment tms-backend --replicas=3
```

### Delete All Resources
```bash
kubectl delete -f k8s-deployment.yaml
```

## 📚 Additional Resources

- Full documentation: See `README.md` in the repository root
- Original Frontend Repo: https://github.com/suneethabulla/travel-frontend
- Original Backend Repo: https://github.com/suneethabulla/travel-backend
- Template Files: https://github.com/srithars/Sample-Docker-files-

## ✅ Checklist Before Submission

- [ ] All source code pushed to GitHub
- [ ] Dockerfiles created for both frontend and backend
- [ ] Kubernetes deployment YAMLs created
- [ ] Kubernetes service YAMLs created
- [ ] README with deployment instructions included
- [ ] Tested deployments locally (if possible)
- [ ] Updated image names in deployment files
- [ ] Submitted GitHub URL to the form

---

**Repository**: https://github.com/Shanawaz992/FPA-AI  
**Submission**: https://tinyurl.com/endsemsubmission
