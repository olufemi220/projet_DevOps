# 📚 Documentation Index

## Student Management Microservices - Complete Documentation

Welcome to the comprehensive documentation for the Student Management microservices project.

---

## 📖 Getting Started

### New to the project?

Start here with these guides in order:

1. **[👉 README.md](./README.md)** - Project overview, features, and architecture
2. **[🏗️ Architecture.md](./Architecture.md)** - System design, services, and data flow
3. **[⚙️ SETUP.md](./SETUP.md)** - Installation and environment setup
4. **[🚀 DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy to DEV/UAT/PRD

---

## 📋 Detailed Guides

### Development

- **[SETUP.md](./SETUP.md)** - Complete installation guide including:
  - Prerequisites and system requirements
  - Step-by-step tool installation
  - Environment configuration
  - Quick start options (Docker Compose or local development)
  - Development workflow

### Deployment

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide covering:
  - Docker Compose for DEV
  - Kubernetes for UAT/PRD (with Minikube setup)
  - CI/CD Pipeline integration
  - Health checks and monitoring
  - Production checklist (30+ items)
  - Rollback procedures

### Troubleshooting

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions for common issues:
  - Docker & Docker Compose problems
  - Database (MySQL) issues
  - Backend services (C#, Java, Node.js)
  - Frontend (Next.js) troubleshooting
  - Kubernetes issues
  - GitLab CI/CD failures
  - Security and performance issues

### Architecture

- **[Architecture.md](./Architecture.md)** - System design documentation:
  - Microservices architecture
  - Service descriptions
  - Technology stack
  - Port mapping
  - Data storage strategy

---

## 🔗 Quick Links

### Running Locally

```bash
# Clone and setup
git clone <repo-url>
cd projet_DevOps
cp .env.example .env

# Docker Compose (easiest)
docker-compose up -d

# Or manual setup (see SETUP.md)
npm install && npm run dev  # Frontend
dotnet run                   # C# Backend
mvn spring-boot:run         # Java Backend
npm run dev                  # Node Backend
```

### Key Endpoints

- **Frontend**: http://localhost:3000
- **C# API**: http://localhost:5000 (Swagger: http://localhost:5000/swagger)
- **Java API**: http://localhost:8080 (Swagger: http://localhost:8080/swagger-ui.html)
- **Node API**: http://localhost:4000 (Swagger: http://localhost:4000/api-docs)
- **Database**: mysql://127.0.0.1:3306/StudentManagement_Dev

### Deployment

- **Local**: `docker-compose up -d` → [See SETUP.md](./SETUP.md#quick-start)
- **Kubernetes Dev**: `kubectl apply -f k8s/` → [See DEPLOYMENT.md](./DEPLOYMENT.md#kubernetes-deployment-uatprd)
- **GitLab CI/CD**: Push to `main` branch → Pipeline auto-runs

---

## 🛠️ Common Tasks

### I want to...

- **Set up my development environment** → [SETUP.md](./SETUP.md)
- **Deploy to production** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Fix an error I'm seeing** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Understand the system design** → [Architecture.md](./Architecture.md)
- **See what's new** → Check [CHANGELOG.md](./CHANGELOG.md) if available
- **Contribute to the project** → Check main [README.md](../README.md)

---

## 📚 Documentation Structure

```
docs/
├── README.md                 ← You are here
├── en/                       English documentation
│   └── README.md
├── fr/                       French documentation
│   ├── README.md
│   ├── Architecture.md       System design
│   ├── DEPLOYMENT.md         Deployment guide (400+ lines)
│   ├── SETUP.md              Installation guide (250+ lines)
│   └── TROUBLESHOOTING.md    Common issues & solutions (300+ lines)
```

---

## 🎓 Learning Path

### Beginner

1. Read [README.md](./README.md) to understand what the project does
2. Follow [SETUP.md](./SETUP.md) to get it running locally
3. Explore the services with Swagger/Postman/curl
4. Read [Architecture.md](./Architecture.md) to understand how it works

### Intermediate

1. Study [DEPLOYMENT.md](./DEPLOYMENT.md) to understand deployment options
2. Review `.gitlab-ci.yml` for CI/CD pipeline
3. Explore Kubernetes manifests in `k8s/`
4. Try deploying to Kubernetes with Minikube

### Advanced

1. Implement additional features (see [roadmap](README.md#roadmap))
2. Optimize Docker images (see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#performance-issues))
3. Set up monitoring and logging
4. Implement backup and disaster recovery

---

## 🔍 Quick Reference

### Services

| Service | Tech | Port | Environment |
|---------|------|------|-------------|
| Frontend | Next.js | 3000 | Node.js 18+ |
| API (C#) | ASP.NET Core 7 | 5000 | .NET SDK 7 |
| API (Java) | Spring Boot 3.1 | 8080 | Java 17 |
| API (Node) | Express 4 | 4000 | Node.js 18+ |
| Database | MySQL 8 | 3306 | Docker |

### Tools Required

- Docker 24.0.5 & Docker Compose 3.9
- Node.js 18+ & npm 9+
- .NET SDK 7.0
- Java 17 JDK
- Maven 3.9+
- kubectl (for Kubernetes)
- Minikube (for local Kubernetes)

### Important Files

- `.gitlab-ci.yml` - CI/CD Pipeline configuration
- `docker-compose.yml` - Local development setup
- `.env.example` - Environment variables template
- `k8s/` - Kubernetes manifests
- `student-project/database/init.sql` - Database schema

---

## 💡 Tips & Best Practices

1. **Always read the error message** - It usually tells you exactly what's wrong
2. **Check logs first** - `docker-compose logs` or `kubectl logs`
3. **Keep `.env` file** - Copy from `.env.example` but keep it private
4. **Use `.dockerignore`** - Speeds up builds
5. **Test locally before pushing** - Use `docker-compose up`
6. **Run migrations** - Ensure database schema is up to date
7. **Check resource usage** - `docker stats` or `free -h`

---

## 🆘 Need Help?

1. **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Most common issues are documented
2. **Search logs** - `docker-compose logs -f` shows real-time output
3. **Read error messages carefully** - They usually tell you the fix
4. **Check internet connection** - Sometimes packages can't download
5. **Restart services** - `docker-compose down && docker-compose up`

---

## 📞 Support

- **Documentation Issues**: Check if [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) covers it
- **Setup Problems**: Follow [SETUP.md](./SETUP.md) step-by-step
- **Deployment Questions**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Code Issues**: Check the relevant backend or frontend folder

---

## 📝 Contributing

When updating documentation:

1. Keep guides updated with tool versions
2. Test commands before documenting
3. Include examples and expected output
4. Link to related guides
5. Update this index if adding new docs

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-03-24 | Initial documentation suite |

---

**Last Updated**: 2025-03-24  
**Maintainer**: EFREI DevOps Team  
**Repository**: [https://github.com/your-org/projet_DevOps](https://github.com/your-org/projet_DevOps)

---

📖 **Start with [SETUP.md](./SETUP.md) if you're new to the project!**
