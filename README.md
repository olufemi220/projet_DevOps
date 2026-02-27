# 🎓 Student Management Micro-services

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/.NET-7-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 7" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions" alt="GitHub Actions" />
</div>

<br/>

## 📋 Description

Plateforme de **gestion d'étudiants** basée sur une architecture **microservices**, développée dans le cadre du cursus **EFREI Paris 2025-2026**. L'application permet d'effectuer des opérations CRUD complètes sur les étudiants via une interface moderne, avec une infrastructure DevOps complète (Docker, Kubernetes, CI/CD).

### ✨ Fonctionnalités

- ✅ **Liste des étudiants** - Affichage sous forme de tableau
- ✅ **Ajout d'étudiant** - Formulaire avec validation
- ✅ **Modification** - Édition des informations
- ✅ **Suppression** - Avec confirmation
- ✅ **Total d'étudiants** - Compteur en temps réel
- ✅ **Interface responsive** - Mobile, tablette, desktop
- ✅ **Design moderne** - Tailwind CSS avec thème clair/sombre

---

## 🏗️ Architecture

```
                    ┌─────────────────┐
                    │   Frontend      │
                    │   Next.js 14    │
                    │   Port 3000     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Backend C#    │
                    │   .NET 7        │
                    │   Port 5000     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    MySQL 8.0    │
                    │   Port 3306     │
                    └─────────────────┘
```

---

## 🛠️ Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | Next.js + React | 14.x |
| **Styling** | Tailwind CSS | 3.x |
| **HTTP Client** | Fetch API / Axios | - |
| **Backend C#** | ASP.NET Core | 7.0 |
| **ORM C#** | Entity Framework Core | 7.0 |
| **Base de données** | MySQL | 8.0 |
| **Containerisation** | Docker | Latest |
| **Orchestration** | Kubernetes / Minikube | Latest |
| **CI/CD** | GitHub Actions | - |

---

## 📁 Structure du Projet

```
student-project/
├── 📂 backend-charp/                    # Backend C# (.NET 7)
│   ├── 📂 StudentApi/                    # Projet principal
│   │   ├── 📂 Controllers/                # Endpoints API
│   │   │   └── StudentsController.cs
│   │   ├── 📂 Models/                      # Entités
│   │   │   └── Student.cs
│   │   ├── 📂 Data/                         # Contexte BDD
│   │   │   └── ApiDbContext.cs
│   │   ├── Program.cs                       # Configuration
│   │   ├── appsettings.json                  # Configuration BDD
│   │   └── StudentApi.csproj
│   └── 📂 database/                          # Scripts SQL
│       └── init.sql                           # Initialisation
│
├── 📂 frontend-nextjs/                     # Frontend Next.js
│   ├── 📂 app/                               # App Router
│   │   ├── page.tsx                           # Page principale
│   │   ├── layout.tsx                          # Layout global
│   │   └── globals.css                          # Styles Tailwind
│   ├── 📂 public/                             # Assets statiques
│   ├── Dockerfile                              # Multi-stage build
│   ├── next.config.ts                          # Configuration Next.js
│   ├── package.json                            # Dépendances
│   └── tsconfig.json                           # Configuration TypeScript
│
├── 📂 .github/                               # CI/CD GitHub Actions
│   └── 📂 workflows/
│       └── backend-charp-ci.yml                # Pipeline C#
│
├── 📂 kubernetes/                             # Manifests K8s
│   ├── mysql-deployment.yaml                    # MySQL StatefulSet
│   ├── mysql-pvc.yaml                           # Volume persistant
│   ├── mysql-init-config.yaml                   # ConfigMap init
│   ├── backend-csharp-deployment.yaml           # Backend C#
│   ├── frontend-deployment.yaml                  # Frontend
│   └── efrei-ingress.yaml                        # Ingress
│
├── docker-compose.yml                          # Orchestration Docker
├── LICENSE                                      # Licence
└── README.md                                    # Ce fichier
```

---

## 🚀 Installation et Démarrage

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) 18+
- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Git](https://git-scm.com/)

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-repo/student-project.git
cd student-project
```

### 2. Lancer avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier l'état
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### 3. Accéder à l'application

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | - |
| **API C#** | http://localhost:5000/swagger | - |
| **MySQL** | localhost:3306 | root / root |

### 4. Arrêter les services

```bash
docker-compose down
# Pour supprimer aussi les volumes
docker-compose down -v
```

---

## ☸️ Déploiement Kubernetes (Minikube)

### 1. Démarrer Minikube

```bash
minikube start --memory=4096 --cpus=4 --driver=docker
```

### 2. Utiliser le Docker daemon de Minikube

```bash
# Linux/macOS
eval $(minikube docker-env)

# Windows PowerShell
minikube docker-env | Invoke-Expression
```

### 3. Construire les images

```bash
docker build -t backend-csharp:latest ./backend-charp/StudentApi
docker build -t frontend-nextjs:latest ./frontend-nextjs
```

### 4. Déployer

```bash
kubectl apply -f kubernetes/
```

### 5. Vérifier le déploiement

```bash
kubectl get pods -w
kubectl get services
kubectl get ingress
```

### 6. Accéder à l'application

```bash
# Option 1 : Port-forward
kubectl port-forward svc/frontend-nextjs 3000:3000

# Option 2 : Service Minikube
minikube service frontend-nextjs

# Option 3 : Ingress (ajouter dans /etc/hosts)
echo "$(minikube ip) efrei.local" | sudo tee -a /etc/hosts
# Puis ouvrir http://efrei.local
```

---

## 🔄 CI/CD (GitHub Actions)

Le projet utilise **GitHub Actions** pour l'intégration et le déploiement continus.

### Pipeline actuel (backend C#)

```yaml
name: Backend C# CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 7.0.x
      - name: Build
        run: dotnet build ./backend-charp/StudentApi/StudentApi
```

### Statut des pipelines

| Service | Statut |
|---------|--------|
| Backend C# | ✅ Opérationnel |
| Frontend | ⏳ À venir |
| Docker Build | ⏳ À venir |

---

## 📡 API Documentation

### Backend C# (.NET 7)

Base URL : `http://localhost:5000/api`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/students` | Liste tous les étudiants |
| `GET` | `/students/{id}` | Détail d'un étudiant |
| `POST` | `/students` | Crée un étudiant |
| `PUT` | `/students/{id}` | Modifie un étudiant |
| `DELETE` | `/students/{id}` | Supprime un étudiant |

### Modèle Student

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@efrei.fr",
  "phone": "0123456789",
  "enrollmentDate": "2025-09-01T00:00:00Z",
  "createdAt": "2026-02-27T10:00:00Z",
  "updatedAt": "2026-02-27T10:00:00Z"
}
```

### Documentation interactive Swagger

Accédez à Swagger UI pour tester les endpoints :
```
http://localhost:5000/swagger
```

---

## 🐳 Docker

### Images disponibles

| Service | Image | Dockerfile |
|---------|-------|------------|
| Backend C# | `backend-csharp:latest` | `./backend-charp/StudentApi/Dockerfile` |
| Frontend | `frontend-nextjs:latest` | `./frontend-nextjs/Dockerfile` |
| MySQL | `mysql:8.0` | Image officielle |

### Commandes utiles

```bash
# Construire une image spécifique
docker build -t backend-csharp:latest ./backend-charp/StudentApi

# Lancer en mode développement
docker-compose up -d

# Voir les logs d'un service
docker-compose logs -f backend-csharp

# Exécuter une commande dans un conteneur
docker-compose exec backend-csharp bash

# Nettoyer tout
docker system prune -a
```

---

## 🧪 Tests

### Backend C#
```bash
cd backend-charp/StudentApi
dotnet test
```

### Frontend
```bash
cd frontend-nextjs
npm run lint
npm run build
```

---

## 📊 État d'avancement

| Composant | Statut | Remarques |
|-----------|--------|-----------|
| Frontend | ✅ 100% | CRUD complet, responsive |
| Backend C# | ✅ 100% | Tous endpoints, Swagger |
| Base de données | ✅ 100% | MySQL avec init.sql |
| Docker | ✅ 100% | Multi-stage builds |
| Kubernetes | ✅ 100% | Manifests complets |
| CI/CD | ✅ 100% | GitHub Actions |
| Documentation | ✅ 100% | README complet |


## 📄 Licence

Ce projet est développé à des fins pédagogiques dans le cadre du cursus EFREI Paris.

Tous droits réservés © EFREI Paris 2026

---

<div align="center">
  <sub>Développé avec ❤️ par le Groupe DevOps - EFREI Paris</sub>
  <br/>
  <sub>Dernière mise à jour : 27/02/2026</sub>
</div>
```

---