# Architecture — Student Management Micro-services

## Software Architecture

```
                         ┌─────────────────────────────┐
                         │      Frontend (Next.js 14)   │
                         │          Port 3000           │
                         │   Tailwind CSS + TypeScript  │
                         └──────────────┬──────────────┘
                                        │ HTTP (proxy /api/*)
                         ┌──────────────▼──────────────┐
                         │       Next.js API Routes     │
                         │    (Server-side proxy)       │
                         └──────┬──────────────────────┘
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
┌──────────▼──────┐  ┌──────────▼──────┐  ┌─────────▼───────┐
│  C# API         │  │  Java API       │  │  Node.js API    │
│  ASP.NET Core 7 │  │  Spring Boot    │  │  Express 4.x    │
│  Port 5000      │  │  Port 8080      │  │  Port 4000      │
│  EF Core 7      │  │  Spring JPA     │  │  mysql2         │
│  Swagger UI     │  │  Swagger UI     │  │  Swagger UI     │
└──────────┬──────┘  └──────────┬──────┘  └─────────┬───────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      MySQL 8.0        │
                    │      Port 3306        │
                    │                       │
                    │  StudentManagement_Dev│
                    │  StudentManagement_UAT│
                    │  StudentManagement_PRD│
                    └───────────────────────┘
```

## Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Host Machine                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Docker / Minikube                    │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │   DEV    │  │   UAT    │  │       PRD         │  │  │
│  │  │ :3020    │  │ :3010    │  │      :3000        │  │  │
│  │  │ :5020    │  │ :5010    │  │      :5000        │  │  │
│  │  │ :8100    │  │ :8090    │  │      :8080        │  │  │
│  │  │ :4020    │  │ :4010    │  │      :4000        │  │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │              MySQL :3306 (shared)              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Kubernetes Architecture

```
Namespace: student-management
│
├── StatefulSet: mysql (1 replica)
│   ├── PersistentVolumeClaim: mysql-data (2Gi)
│   └── ConfigMap: mysql-init-config
│
├── Deployment: backend-csharp (2 replicas)
│   ├── Service: ClusterIP :5000
│   └── HPA: min=2 max=5 cpu=70%
│
├── Deployment: backend-java (2 replicas)
│   ├── Service: ClusterIP :8080
│   └── HPA: min=2 max=5 cpu=70%
│
├── Deployment: backend-node (2 replicas)
│   ├── Service: ClusterIP :4000
│   └── HPA: min=2 max=5 cpu=70%
│
└── Deployment: frontend (2 replicas)
    └── Service: NodePort :3000 → :30000
```

## Port Convention

| Service | PRD | UAT | DEV |
|---|---|---|---|
| Frontend | 3000 | 3010 | 3020 |
| Backend C# | 5000 | 5010 | 5020 |
| Backend Java | 8080 | 8090 | 8100 |
| Backend Node | 4000 | 4010 | 4020 |
| MySQL | 3306 | 3306 | 3306 |

## Data Flow

```
Browser
  │
  │ GET /api/students
  ▼
Next.js Frontend (port 3020)
  │
  │ Server-side proxy via API Route
  │ GET http://backend-csharp-dev:5000/api/students
  ▼
ASP.NET Core API (port 5000)
  │
  │ Entity Framework Core
  │ SELECT * FROM students
  ▼
MySQL 8.0 (port 3306)
  │
  │ JSON response
  ▼
Browser renders student list
```

## Security

- Non-root users in all Docker containers
- CORS configured for frontend only
- Health checks on all services
- Resource limits on all Kubernetes pods
- Separate databases per environment
