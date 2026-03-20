# 🎓 Student Management Micro-services

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![.NET](https://img.shields.io/badge/.NET-7-512BD4?logo=dotnet)](https://dotnet.microsoft.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1-6DB33F?logo=springboot)](https://spring.io)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?logo=docker)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Latest-326CE5?logo=kubernetes)](https://kubernetes.io)

Plateforme de gestion d'étudiants basée sur une architecture microservices moderne.
Projet EFREI Paris — 2025/2026

[🇫🇷 Documentation Française](docs/fr/README.md) | [🇬🇧 English Documentation](docs/en/README.md)

---

## 🏗️ Architecture

```
                    ┌─────────────────────┐
                    │   Frontend (Next.js) │
                    │      Port 3000       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
   ┌──────────▼───┐  ┌────────▼──────┐  ┌──────▼────────┐
   │  C# API      │  │  Java API     │  │  Node.js API  │
   │  Port 5000   │  │  Port 8080    │  │  Port 4000    │
   └──────────────┘  └───────────────┘  └───────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     MySQL 8.0       │
                    │     Port 3306       │
                    └─────────────────────┘
```

## 🛠️ Stack Technique

| Composant | Technologie | Version |
|---|---|---|
| Frontend | Next.js + React | 14.x |
| Styling | Tailwind CSS | 4.x |
| Backend 1 | ASP.NET Core | 7.0 |
| ORM 1 | Entity Framework Core | 7.0 |
| Backend 2 | Spring Boot | 3.1 |
| ORM 2 | Spring Data JPA | 3.1 |
| Backend 3 | Node.js (Express) | 18+ |
| ORM 3 | mysql2 | 3.x |
| Base de données | MySQL | 8.0 |
| Conteneurisation | Docker | Latest |
| Orchestration | Kubernetes/Minikube | Latest |

## 📁 Structure du Projet

```
projet_DevOps/
├── student-project/
│   ├── backend-csharp/          # Backend ASP.NET Core 7
│   │   ├── StudentApi/
│   │   └── database/
│   ├── backend-springboot/      # Backend Spring Boot 3.1
│   ├── backend-nodejs/          # Backend Node.js Express
│   └── frontend-nextjs/         # Frontend Next.js 14
├── k8s/                         # Manifests Kubernetes
├── docs/                        # Documentation FR + EN
├── docker-compose.yml           # Orchestration Docker
└── README.md
```

## 🚀 Démarrage Rapide

```bash
# Docker Compose (env DEV)
docker compose up -d mysql backend-csharp-dev backend-java-dev backend-node-dev frontend-dev

# Kubernetes
kubectl apply -f k8s/
```

## 🌐 URLs

| Service | DEV | UAT | PRD |
|---|---|---|---|
| Frontend | localhost:3020 | localhost:3010 | localhost:3000 |
| API C# | localhost:5020 | localhost:5010 | localhost:5000 |
| API Java | localhost:8100 | localhost:8090 | localhost:8080 |
| API Node | localhost:4020 | localhost:4010 | localhost:4000 |

---
Développé par le Groupe DevOps — EFREI Paris 2026
