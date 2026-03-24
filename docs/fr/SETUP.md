# 📋 Installation & Setup Guide

## Student Management Microservices - Complete Setup Instructions

---

## Prerequisites

### System Requirements

- **OS**: Linux, macOS, or Windows (with WSL2)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 20GB minimum
- **Internet**: Stable connection required

### Required Software

Install the following tools in order:

#### 1. Git

```bash
# macOS
brew install git

# Ubuntu/Debian Linux
sudo apt-get install git

# Windows (via Git Bash)
# Download from https://git-scm.com/download/win
```

#### 2. Docker & Docker Compose

```bash
# Install Docker Desktop (includes Docker Compose)
# https://www.docker.com/products/docker-desktop

# Verify installation
docker --version       # Docker version X.X.X
docker-compose --version  # Docker Compose version X.X.X
```

#### 3. Node.js & npm (v18+)

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from https://nodejs.org/

# Verify
node --version    # v18.x.x
npm --version     # 9.x.x
```

#### 4. .NET SDK 7.0

```bash
# Ubuntu/Debian Linux
wget https://dot.net/dotnet-install.sh -O dotnet-install.sh
chmod +x ./dotnet-install.sh
./dotnet-install.sh --version 7.0 --install-dir /usr/local/bin

# macOS (using brew)
brew install dotnet-sdk

# Windows or visit https://dotnet.microsoft.com/download/dotnet/7.0

# Verify
dotnet --version  # SDK 7.x.x
```

#### 5. Java 17 JDK

```bash
# Ubuntu/Debian Linux
sudo apt-get install openjdk-17-jdk

# macOS
brew install java@17

# Windows or visit https://www.oracle.com/java/technologies/downloads/

# Verify
java -version  # openjdk version 17.x.x
```

#### 6. Maven 3.9+

```bash
# Ubuntu/Debian Linux
sudo apt-get install maven

# macOS
brew install maven

# Or download from https://maven.apache.org/download.cgi

# Verify
mvn --version  # Apache Maven 3.9.x
```

#### 7. Kubernetes Tools (for production only)

```bash
# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Minikube (for local Kubernetes)
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify
kubectl version --client  # Client Version: v1.28.x
minikube version        # minikube version: v1.32.x
```

---

## Project Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd projet_DevOps
```

### 2. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Example `.env` file:

```env
# Database
MYSQL_ROOT_PASSWORD=root_password_2025
MYSQL_USER=student_user
MYSQL_PASSWORD=student_password

# Security
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3010,http://localhost:3020

# Kubernetes
K8S_NAMESPACE=student-management
K8S_ENVIRONMENT=development

# Local ports
FRONTEND_PORT=3000
CSHARP_PORT=5000
JAVA_PORT=8080
NODE_PORT=4000
MYSQL_PORT=3306
```

### 3. Install Dependencies

#### Frontend (Next.js)

```bash
cd student-project/frontend-nextjs
npm install
# Optional: npm run lint
cd ../..
```

#### C# Backend

```bash
cd student-project/backend-csharp/StudentApi
dotnet restore
cd ../../../
```

#### Java Backend

```bash
cd student-project/backend-springboot
mvn clean install
cd ../..
```

#### Node.js Backend

```bash
cd student-project/backend-nodejs
npm install
cd ../..
```

### 4. Verify Installation

```bash
# Check all tools are installed
echo "Checking installations..."
docker --version
docker-compose --version
node --version
npm --version
dotnet --version
java -version
mvn --version
```

---

## Quick Start

### Option 1: Docker Compose (Recommended for DEV)

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access services
# Frontend: http://localhost:3000
# C# API: http://localhost:5000/swagger
# Java API: http://localhost:8080
# Node API: http://localhost:4000

# Stop services
docker-compose down
```

### Option 2: Local Development (Manual)

#### Terminal 1 - Frontend

```bash
cd student-project/frontend-nextjs
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 2 - C# Backend

```bash
cd student-project/backend-csharp/StudentApi
dotnet run
# Runs on http://localhost:5000
```

#### Terminal 3 - Java Backend

```bash
cd student-project/backend-springboot
mvn spring-boot:run
# Runs on http://localhost:8080
```

#### Terminal 4 - Node Backend

```bash
cd student-project/backend-nodejs
npm run dev
# Runs on http://localhost:4000
```

#### Terminal 5 - MySQL Database

```bash
# Start MySQL in Docker
docker run -d \
  --name mysql-student \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=StudentManagement_Dev \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

# Initialize database
docker exec mysql-student mysql -u root -proot < student-project/database/init.sql
```

---

## Development Workflow

### Running Tests

```bash
# Frontend linting
cd student-project/frontend-nextjs
npm run lint

# Java tests
cd student-project/backend-springboot
mvn test

# C# tests (if available)
cd student-project/backend-csharp
dotnet test
```

### Building for Production

```bash
# Frontend
cd student-project/frontend-nextjs
npm run build

# Java
cd student-project/backend-springboot
mvn clean package

# C#
cd student-project/backend-csharp/StudentApi
dotnet publish -c Release
```

### Database Management

```bash
# Connect to MySQL
mysql -u root -proot -h 127.0.0.1

# Backup database
mysqldump -u root -proot StudentManagement_Dev > backup.sql

# Restore database
mysql -u root -proot StudentManagement_Dev < backup.sql
```

---

## Kubernetes Setup (For Production)

### Start Minikube

```bash
minikube start --memory=4096 --cpus=4

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server
```

### Deploy to Kubernetes

See [DEPLOYMENT.md](./DEPLOYMENT.md#kubernetes-deployment-uatprd) for detailed instructions.

---

## Troubleshooting

### Docker Issues

**Issue**: Docker daemon not running
```bash
# Start Docker
systemctl start docker
# or use Docker Desktop GUI
```

**Issue**: Permission denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Node/npm Issues

**Issue**: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Issue**: MySQL connection refused
```bash
# Check if MySQL is running
docker ps | grep mysql

# Restart MySQL
docker restart mysql-student
```

**Issue**: Database already exists
```bash
# Drop and recreate
mysql -u root -proot -e "DROP DATABASE StudentManagement_Dev; CREATE DATABASE StudentManagement_Dev;"
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or :5000, :8080, etc.

# Kill process
kill -9 <PID>

# Or use different ports in docker-compose.override.yml
```

---

## IDE Setup Recommendations

### VS Code

**Recommended Extensions**:
- ES7+ React/Redux/React-Native snippets
- C# extension
- Extension Pack for Java
- Docker
- Kubernetes
- Prettier
- ESLint

### JetBrains IDEs

- **WebStorm** for Frontend
- **ReSharper** for C#
- **IntelliJ IDEA** for Java

---

## Next Steps

1. ✅ Follow this setup guide
2. 📖 Read [README.md](../README.md) for project overview
3. 🏗️ Check [Architecture.md](./Architecture.md) for system design
4. 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
5. 🐛 Check troubleshooting section above for common issues

---

## Support & Help

For issues:

1. Check this guide again
2. Read the error message carefully
3. Check tool documentation:
   - [Docker Docs](https://docs.docker.com/)
   - [npm Docs](https://docs.npmjs.com/)
   - [.NET Docs](https://docs.microsoft.com/dotnet/)
   - [Maven Docs](https://maven.apache.org/)

---

**Last Updated**: 2025-03-24
**Maintainer**: EFREI DevOps Team
