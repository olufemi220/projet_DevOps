# 🎓 Student Management Micro-services — Documentation Française

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Lancement avec Docker Compose](#lancement-avec-docker-compose)
5. [Déploiement Kubernetes](#déploiement-kubernetes)
6. [API Documentation](#api-documentation)
7. [Variables d'environnement](#variables-denvironnement)
8. [Dépannage](#dépannage)

---

## Vue d'ensemble

Plateforme de gestion d'étudiants basée sur une architecture microservices avec :
- **Frontend** : Next.js 14 + Tailwind CSS
- **3 backends** : ASP.NET Core 7, Spring Boot 3.1, Node.js 18
- **Base de données** : MySQL 8.0 avec 3 environnements (DEV / UAT / PRD)
- **Conteneurisation** : Docker + Docker Compose
- **Orchestration** : Kubernetes / Minikube

---

## Prérequis

| Outil | Version minimum |
|---|---|
| Docker Desktop | Latest |
| Node.js | 18+ |
| .NET SDK | 7.0 |
| Java JDK | 17 |
| Maven | 3.9+ |
| Minikube | Latest |
| kubectl | Latest |

### Installation des prérequis sur Linux/WSL

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
# 1. Cloner le dépôt
git clone https://github.com/votre-repo/projet_DevOps.git
cd projet_DevOps

# 2. Vérifier la structure
ls student-project/
# backend-csharp  backend-nodejs  backend-springboot  frontend-nextjs  database
```

---

## Lancement avec Docker Compose

### Environnement DEV uniquement (recommandé pour les tests)

```bash
# Lancer les services DEV
docker compose up -d mysql backend-csharp-dev backend-java-dev backend-node-dev frontend-dev

# Vérifier que tout est démarré
docker compose ps

# Voir les logs
docker compose logs -f
```

### Tous les environnements

```bash
docker compose up -d
```

### URLs d'accès

| Service | DEV | UAT | PRD |
|---|---|---|---|
| Frontend | http://localhost:3020 | http://localhost:3010 | http://localhost:3000 |
| API C# (Swagger) | http://localhost:5020/swagger | http://localhost:5010/swagger | http://localhost:5000/swagger |
| API Java (Swagger) | http://localhost:8100/swagger-ui.html | http://localhost:8090/swagger-ui.html | http://localhost:8080/swagger-ui.html |
| API Node (Swagger) | http://localhost:4020/api-docs | http://localhost:4010/api-docs | http://localhost:4000/api-docs |

### Arrêt des services

```bash
docker compose down
# Pour supprimer aussi les volumes
docker compose down -v
```

---

## Déploiement Kubernetes

### 1. Démarrer Minikube

```bash
minikube start --memory=4096 --cpus=4 --driver=docker
```

### 2. Charger les images Docker

```bash
# Construire les images localement
docker build -t student-management/backend-csharp:latest ./student-project/backend-csharp/StudentApi/
docker build -t student-management/backend-java:latest ./student-project/backend-springboot/
docker build -t student-management/backend-node:latest ./student-project/backend-nodejs/
docker build -t student-management/frontend:latest ./student-project/frontend-nextjs/

# Charger dans Minikube
minikube image load student-management/backend-csharp:latest
minikube image load student-management/backend-java:latest
minikube image load student-management/backend-node:latest
minikube image load student-management/frontend:latest
```

### 3. Déployer

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-configmap.yaml
kubectl apply -f k8s/mysql-statefulset.yaml

# Attendre que MySQL soit prêt
kubectl wait --for=condition=ready pod/mysql-0 -n student-management --timeout=120s

# Déployer les applications
kubectl apply -f k8s/backend-csharp.yaml
kubectl apply -f k8s/backend-java.yaml
kubectl apply -f k8s/backend-node.yaml
kubectl apply -f k8s/frontend.yaml
```

### 4. Vérifier le déploiement

```bash
kubectl get pods -n student-management
kubectl get services -n student-management
kubectl get hpa -n student-management
```

### 5. Accéder à l'application

```bash
# Option 1 : Service Minikube
minikube service frontend -n student-management

# Option 2 : Port-forward
kubectl port-forward svc/frontend 3000:3000 -n student-management
# Puis ouvrir http://localhost:3000
```

### 6. Nettoyer

```bash
kubectl delete namespace student-management
```

---

## API Documentation

### Endpoints disponibles (identiques pour les 3 backends)

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Liste tous les étudiants |
| GET | `/api/students/{id}` | Récupère un étudiant |
| POST | `/api/students` | Crée un étudiant |
| PUT | `/api/students/{id}` | Modifie un étudiant |
| DELETE | `/api/students/{id}` | Supprime un étudiant |
| GET | `/health` | Health check |

### Modèle de données

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

### Exemple d'utilisation avec curl

```bash
# Lister les étudiants
curl http://localhost:5020/api/students

# Créer un étudiant
curl -X POST http://localhost:5020/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@efrei.fr",
    "phone": "0611223344",
    "enrollmentDate": "2025-09-01"
  }'

# Modifier un étudiant
curl -X PUT http://localhost:5020/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jean-Pierre", "phone": "0699887766"}'

# Supprimer un étudiant
curl -X DELETE http://localhost:5020/api/students/1
```

---

## Variables d'environnement

### Backend C#

| Variable | Description | Valeur DEV |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | Environnement | Development |
| `ConnectionStrings__DefaultConnection` | Connexion MySQL | Server=localhost;... |

### Backend Java

| Variable | Description | Valeur DEV |
|---|---|---|
| `SPRING_DATASOURCE_URL` | URL MySQL | jdbc:mysql://localhost:3306/... |
| `SPRING_DATASOURCE_USERNAME` | Utilisateur | root |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe | root |

### Backend Node.js

| Variable | Description | Valeur DEV |
|---|---|---|
| `PORT` | Port du serveur | 4000 |
| `DB_HOST` | Hôte MySQL | localhost |
| `DB_NAME` | Base de données | StudentManagement_Dev |
| `CORS_ORIGIN` | URL frontend autorisée | http://localhost:3020 |

---

## Dépannage

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :PORT_NUMBER
# Tuer le processus
kill -9 $(lsof -ti :PORT_NUMBER)
```

### MySQL ne démarre pas dans Kubernetes
```bash
# Supprimer le PVC corrompu
kubectl delete pvc mysql-data-mysql-0 -n student-management --force --grace-period=0
# Redéployer
kubectl apply -f k8s/mysql-statefulset.yaml
```

### Variable ASPNETCORE_ENVIRONMENT manquante
```bash
export ASPNETCORE_ENVIRONMENT=Development
```

### Prisma / Node.js binary target
```bash
# Régénérer le client Prisma
npx prisma generate
```
