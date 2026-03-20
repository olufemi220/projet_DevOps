# 🎓 Student Management Micro-services — English Documentation

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running with Docker Compose](#running-with-docker-compose)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [API Documentation](#api-documentation)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

---

## Overview

A student management platform built on a modern microservices architecture featuring:
- **Frontend**: Next.js 14 + Tailwind CSS
- **3 Backends**: ASP.NET Core 7, Spring Boot 3.1, Node.js 18
- **Database**: MySQL 8.0 with 3 environments (DEV / UAT / PRD)
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes / Minikube

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Docker Desktop | Latest |
| Node.js | 18+ |
| .NET SDK | 7.0 |
| Java JDK | 17 |
| Maven | 3.9+ |
| Minikube | Latest |
| kubectl | Latest |

### Installing prerequisites on Linux/WSL

```bash
# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# .NET 7
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 7.0
export PATH=$PATH:$HOME/.dotnet

# Java 17 + Maven
sudo apt-get install -y openjdk-17-jdk maven

# Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/projet_DevOps.git
cd projet_DevOps

# 2. Verify structure
ls student-project/
# backend-csharp  backend-nodejs  backend-springboot  frontend-nextjs  database
```

---

## Running with Docker Compose

### DEV environment only (recommended for testing)

```bash
# Start DEV services
docker compose up -d mysql backend-csharp-dev backend-java-dev backend-node-dev frontend-dev

# Check all services are running
docker compose ps

# View logs
docker compose logs -f
```

### All environments

```bash
docker compose up -d
```

### Access URLs

| Service | DEV | UAT | PRD |
|---|---|---|---|
| Frontend | http://localhost:3020 | http://localhost:3010 | http://localhost:3000 |
| C# API (Swagger) | http://localhost:5020/swagger | http://localhost:5010/swagger | http://localhost:5000/swagger |
| Java API (Swagger) | http://localhost:8100/swagger-ui.html | http://localhost:8090/swagger-ui.html | http://localhost:8080/swagger-ui.html |
| Node API (Swagger) | http://localhost:4020/api-docs | http://localhost:4010/api-docs | http://localhost:4000/api-docs |

### Stopping services

```bash
docker compose down
# To also remove volumes
docker compose down -v
```

---

## Kubernetes Deployment

### 1. Start Minikube

```bash
minikube start --memory=4096 --cpus=4 --driver=docker
```

### 2. Load Docker images

```bash
# Build images locally
docker build -t student-management/backend-csharp:latest ./student-project/backend-csharp/StudentApi/
docker build -t student-management/backend-java:latest ./student-project/backend-springboot/
docker build -t student-management/backend-node:latest ./student-project/backend-nodejs/
docker build -t student-management/frontend:latest ./student-project/frontend-nextjs/

# Load into Minikube
minikube image load student-management/backend-csharp:latest
minikube image load student-management/backend-java:latest
minikube image load student-management/backend-node:latest
minikube image load student-management/frontend:latest
```

### 3. Deploy

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-configmap.yaml
kubectl apply -f k8s/mysql-statefulset.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod/mysql-0 -n student-management --timeout=120s

# Deploy applications
kubectl apply -f k8s/backend-csharp.yaml
kubectl apply -f k8s/backend-java.yaml
kubectl apply -f k8s/backend-node.yaml
kubectl apply -f k8s/frontend.yaml
```

### 4. Verify deployment

```bash
kubectl get pods -n student-management
kubectl get services -n student-management
kubectl get hpa -n student-management
```

### 5. Access the application

```bash
# Option 1: Minikube service
minikube service frontend -n student-management

# Option 2: Port-forward
kubectl port-forward svc/frontend 3000:3000 -n student-management
# Then open http://localhost:3000
```

### 6. Clean up

```bash
kubectl delete namespace student-management
```

---

## API Documentation

### Available endpoints (identical for all 3 backends)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students |
| GET | `/api/students/{id}` | Get a student by ID |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |
| GET | `/health` | Health check |

### Data model

```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Dupont",
  "email": "alice.dupont@efrei.fr",
  "phone": "0611223344",
  "enrollmentDate": "2025-09-01T00:00:00",
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-01-01T10:00:00"
}
```

### Example usage with curl

```bash
# List students
curl http://localhost:5020/api/students

# Create a student
curl -X POST http://localhost:5020/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@efrei.fr",
    "phone": "0611223344",
    "enrollmentDate": "2025-09-01"
  }'

# Update a student
curl -X PUT http://localhost:5020/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John Paul", "phone": "0699887766"}'

# Delete a student
curl -X DELETE http://localhost:5020/api/students/1
```

---

## Environment Variables

### C# Backend

| Variable | Description | DEV Value |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | Environment | Development |
| `ConnectionStrings__DefaultConnection` | MySQL connection string | Server=localhost;... |

### Java Backend

| Variable | Description | DEV Value |
|---|---|---|
| `SPRING_DATASOURCE_URL` | MySQL URL | jdbc:mysql://localhost:3306/... |
| `SPRING_DATASOURCE_USERNAME` | Username | root |
| `SPRING_DATASOURCE_PASSWORD` | Password | root |

### Node.js Backend

| Variable | Description | DEV Value |
|---|---|---|
| `PORT` | Server port | 4000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_NAME` | Database name | StudentManagement_Dev |
| `CORS_ORIGIN` | Allowed frontend URL | http://localhost:3020 |

---

## Troubleshooting

### Port already in use
```bash
# Find the process
lsof -i :PORT_NUMBER
# Kill the process
kill -9 $(lsof -ti :PORT_NUMBER)
```

### MySQL crash in Kubernetes
```bash
# Delete corrupted PVC
kubectl delete pvc mysql-data-mysql-0 -n student-management --force --grace-period=0
# Redeploy
kubectl apply -f k8s/mysql-statefulset.yaml
```

### Missing ASPNETCORE_ENVIRONMENT variable
```bash
export ASPNETCORE_ENVIRONMENT=Development
```

### Docker has no internet access
```bash
# Pre-build locally then load into Minikube
minikube image load image-name:latest
```
