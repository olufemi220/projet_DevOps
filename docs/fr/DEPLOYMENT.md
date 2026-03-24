# 🚀 Deployment Guide

## Student Management Microservices - Kubernetes & Docker Deployment

This guide covers deployment strategies for all environments: **Development**, **Staging (UAT)**, and **Production**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Compose Deployment (DEV)](#docker-compose-deployment-dev)
4. [Kubernetes Deployment (UAT/PRD)](#kubernetes-deployment-uatprd)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
7. [Production Checklist](#production-checklist)

---

## Prerequisites

### Required Tools

- **Docker Desktop** 20.10+ ([Install](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (usually comes with Docker Desktop)
- **kubectl** 1.24+ ([Install](https://kubernetes.io/docs/tasks/tools/))
- **Minikube** (for local K8s) or actual K8s cluster
- **git** 2.30+
- **Node.js** 18+ (for development)
- **.NET SDK** 7.0 (for C# development)
- **Java JDK** 17+ (for Java development)
- **Maven** 3.9+ (for Java builds)

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MYSQL_ROOT_PASSWORD=your_secure_password
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
NODE_ENV=production
K8S_ENVIRONMENT=production
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd projet_DevOps
```

### 2. Install Dependencies

```bash
# Frontend
cd student-project/frontend-nextjs
npm install
cd ../..

# Node.js Backend
cd student-project/backend-nodejs
npm install
cd ../..

# C# Backend (commands for Linux/Mac)
cd student-project/backend-csharp/StudentApi
dotnet restore
cd ../../../

# Java Backend
cd student-project/backend-springboot
mvn clean install
cd ../..
```

### 3. Verify Tools

```bash
# Check Docker
docker --version
docker-compose --version

# Check Kubernetes (if needed)
kubectl version --client

# Check runtimes
node --version
dotnet --version
java -version
mvn --version
```

---

## Docker Compose Deployment (DEV)

### Quick Start

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Clean up volumes (careful!)
docker-compose down -v
```

### Accessing Services (DEV)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| C# Backend | http://localhost:5000 |
| C# Swagger | http://localhost:5000/swagger |
| Java Backend | http://localhost:8080 |
| Node.js Backend | http://localhost:4000 |
| MySQL | localhost:3306 |

### Troubleshooting Docker Compose

**Issue: Port already in use**

```bash
# Find processes using ports
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different ports in docker-compose.override.yml
```

**Issue: Database not initializing**

```bash
# Check MySQL logs
docker-compose logs mysql

# Manual database setup
docker exec -it mysql mysql -u root -p < student-project/database/init.sql
```

**Issue: Backends can't connect to database**

```bash
# Check network
docker network inspect project_student-network

# Test connection from container
docker exec backend-csharp mysql -h mysql -u root -p'password' -e "SELECT 1;"
```

---

## Kubernetes Deployment (UAT/PRD)

### 1. Setup Minikube (Local K8s)

```bash
# Start Minikube
minikube start --memory=4096 --cpus=4 --vm-driver=docker

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# Get context
minikube config view
kubectl config current-context
```

### 2. Build Docker Images

```bash
# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Build all images
docker build -t student-api/frontend:latest student-project/frontend-nextjs
docker build -t student-api/backend-csharp:latest student-project/backend-csharp/StudentApi
docker build -t student-api/backend-java:latest student-project/backend-springboot
docker build -t student-api/backend-node:latest student-project/backend-nodejs
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace student-management

# Apply Kubernetes manifests (order matters)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-configmap.yaml
kubectl apply -f k8s/mysql-statefulset.yaml
kubectl apply -f k8s/network-policy.yaml
kubectl apply -f k8s/backend-csharp.yaml
kubectl apply -f k8s/backend-java.yaml
kubectl apply -f k8s/backend-node.yaml
kubectl apply -f k8s/frontend.yaml

# Or apply all at once
kubectl apply -f k8s/
```

### 4. Verify Deployment

```bash
# Check all resources
kubectl get all -n student-management

# Check pod status
kubectl get pods -n student-management -w

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l tier=backend -n student-management --timeout=300s

# Check events
kubectl describe pod <pod-name> -n student-management
```

### 5. Access Application

```bash
# Port forward to frontend
kubectl port-forward svc/frontend 3000:3000 -n student-management

# Port forward to backends
kubectl port-forward svc/backend-csharp 5000:5000 -n student-management
kubectl port-forward svc/backend-java 8080:8080 -n student-management
kubectl port-forward svc/backend-node 4000:4000 -n student-management

# Access via browser
# Frontend: http://localhost:3000
# C# API: http://localhost:5000/swagger
# etc.
```

### 6. View Logs

```bash
# Tail logs from specific pod
kubectl logs -f pod/<pod-name> -n student-management

# Logs from all pods of a deployment
kubectl logs -f -l app=backend-csharp -n student-management

# Previous logs (useful for crashed pods)
kubectl logs pod/<pod-name> --previous -n student-management
```

### 7. Scale Deployments

```bash
# Scale backend
kubectl scale deployment backend-csharp --replicas=3 -n student-management

# Check autoscaling
kubectl get hpa -n student-management
kubectl top pods -n student-management  # requires metrics-server
```

---

## CI/CD Pipeline

### GitLab CI/CD Setup

**1. Register Runner**

```bash
# Install GitLab Runner
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-runner

# Register runner
sudo gitlab-runner register \
  --url https://gitlab.example.com/ \
  --registration-token <TOKEN> \
  --executor docker \
  --docker-image ubuntu:latest \
  --tag-list "linux,docker,efrei_project"
```

**2. Configure Pipeline Stages**

The pipeline runs in this order:

1. **Build** - Compiles all services
2. **Test** - Runs tests and linting
3. **Push** - Builds Docker images and pushes to registry
4. **Deploy** - Deploys to DEV/UAT/PRD (manual trigger)

**3. Trigger Deployment**

Navigate to **CI/CD > Pipelines** in GitLab and click **Play** on the desired deploy job.

### Pipeline Environment Variables

Set in GitLab **Settings > CI/CD > Variables**:

```
CI_REGISTRY_IMAGE = registry.gitlab.com/your-group/projet_devops
DB_PASSWORD = secure_password_here
KUBERNETES_CLUSTER_URL = https://your-k8s-cluster
KUBERNETES_CLUSTER_TOKEN = your_k8s_token
```

---

## Monitoring & Troubleshooting

### Useful kubectl Commands

```bash
# Get resources
kubectl get pods -n student-management
kubectl get services -n student-management
kubectl get deployments -n student-management
kubectl get statefulset -n student-management

# Describe resource (detailed info)
kubectl describe pod <pod-name> -n student-management

# Exec into container
kubectl exec -it <pod-name> -n student-management -- /bin/bash

# Copy file from container
kubectl cp student-management/<pod-name>:/path/to/file ./local-file

# Check resource usage
kubectl top nodes
kubectl top pods -n student-management

# View events
kubectl get events -n student-management --sort-by='.lastTimestamp'
```

### Common Issues & Solutions

**Issue: Pods in CrashLoopBackOff**

```bash
kubectl describe pod <pod-name> -n student-management
kubectl logs <pod-name> -n student-management
kubectl logs <pod-name> --previous -n student-management
```

**Issue: PersistentVolumeClaim pending**

```bash
# Check PVC status
kubectl get pvc -n student-management
kubectl describe pvc mysql-pv -n student-management

# On Minikube, ensure driver supports PVs
minikube mount /path/to/data:/mnt/data
```

**Issue: Service unreachable**

```bash
# Check DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
nslookup mysql.student-management.svc.cluster.local

# Check NetworkPolicy
kubectl get networkpolicy -n student-management
```

**Issue: Secrets not found**

```bash
# Verify secrets exist
kubectl get secrets -n student-management

# Re-apply secrets
kubectl apply -f k8s/secrets.yaml

# Check secret values (careful!)
kubectl get secret mysql-credentials -n student-management -o jsonpath='{.data.password}' | base64 -d
```

---

## Production Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`, `mvn test`)
- [ ] Code reviewed and merged to `main`
- [ ] Docker images built and tested locally
- [ ] Database migrations tested
- [ ] Environment variables configured securely
- [ ] Secrets not in git (use .gitignore)
- [ ] Rate limiting and CORS properly configured
- [ ] Health checks configured

### Kubernetes Production Setup

- [ ] Use dedicated namespaces and RBAC
- [ ] Enable NetworkPolicy for security
- [ ] Use Kubernetes Secrets (not ConfigMap)
- [ ] Set resource requests/limits
- [ ] Configure HPA (autoscaling)
- [ ] Setup PodDisruptionBudget
- [ ] Enable Pod Security Policy
- [ ] Implement liveness/readiness probes
- [ ] Configure ingress with TLS
- [ ] Setup monitoring (Prometheus, Grafana)
- [ ] Setup logging (ELK, Loki)
- [ ] Setup alerting (AlertManager)

### Post-Deployment

- [ ] Verify all pods are running
- [ ] Test critical user workflows
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Verify database connectivity
- [ ] Test scaling behavior
- [ ] Document any issues
- [ ] Plan rollback strategy

### Backup & Disaster Recovery

```bash
# Backup Kubernetes resources
kubectl get all -n student-management -o yaml > backup.yaml

# Backup database
kubectl exec -it mysql-0 -n student-management -- \
  mysqldump -u root -p$MYSQL_ROOT_PASSWORD --all-databases > db-backup.sql

# Restore from backup
kubectl apply -f backup.yaml
```

---

## Rollback Strategy

If something goes wrong:

```bash
# Check rollout history
kubectl rollout history deployment/backend-csharp -n student-management

# Rollback to previous version
kubectl rollout undo deployment/backend-csharp -n student-management

# Rollback to specific revision
kubectl rollout undo deployment/backend-csharp --to-revision=2 -n student-management
```

---

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [ASP.NET Core Deployment](https://docs.microsoft.com/dotnet/core/deploying/)
- [Spring Boot Deployment](https://spring.io/guides/gs/deploying/)

---

## Support

For issues:

1. Check logs: `kubectl logs -f <pod-name> -n student-management`
2. Describe pod: `kubectl describe pod <pod-name> -n student-management`
3. Check events: `kubectl get events -n student-management`
4. Review CI/CD pipeline in GitLab
5. Check database connectivity

---

**Last Updated:** 2025-03-24
**Maintained by:** EFREI DevOps Team
