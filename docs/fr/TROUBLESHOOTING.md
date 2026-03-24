# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## 🐋 Docker & Docker Compose

### Container Fails to Start

**Symptom**: `docker-compose up` shows error immediately

**Solution**:
```bash
# Check logs
docker-compose logs -f <service-name>

# Rebuild images
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker-compose up
```

### Port Already in Use

**Symptom**: `Error: address already in use :::3000`

**Solutions**:

```bash
# Find process using port
lsof -i :3000  # Replace with your port

# Kill the process
kill -9 <PID>

# Or use different port in docker-compose.override.yml
cp docker-compose.yml docker-compose.override.yml
# Edit and change ports
```

### Out of Disk Space

**Symptom**: `no space left on device`

**Solutions**:
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Docker Daemon Won't Start

**Solutions**:
```bash
# Linux
sudo systemctl restart docker
sudo systemctl status docker

# macOS
# Restart Docker Desktop via System Preferences

# Windows (WSL2)
wsl --shutdown
wsl
```

---

## 📦 npm & Node.js

### npm Install Fails

**Symptom**: `npm ERR! code ERESOLVE`

**Solutions**:
```bash
# Clear cache
npm cache clean --force

# Delete lock file
rm package-lock.json

# Reinstall
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

### Node Version Conflicts

**Symptom**: `This version of npm only works with node vX.X.X`

**Solutions**:
```bash
# List installed versions
nvm list

# Use correct version
nvm use 18

# Or set default
nvm alias default 18
```

### Module Not Found

**Symptom**: `Cannot find module 'express'`

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check package.json
cat package.json | grep "express"
```

---

## 🗄️ MySQL Database

### Connection Refused

**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions**:
```bash
# Check if MySQL is running
docker ps | grep mysql

# Start MySQL
docker-compose up -d mysql

# Or restart
docker restart mysql-student

# Check connection
mysql -u root -p -h 127.0.0.1
```

### Authentication Failed

**Symptom**: `Error: Access denied for user 'root'@'localhost'`

**Solutions**:
```bash
# Check credentials in .env
cat .env | grep MYSQL

# Try with correct password
mysql -u root -p<PASSWORD> -h 127.0.0.1

# Reset password
docker exec mysql-student mysql -u root -proot -e "ALTER USER 'root'@'%' IDENTIFIED BY 'new_password';"
```

### Database Doesn't Exist

**Symptom**: `Unknown database 'StudentManagement_Dev'`

**Solutions**:
```bash
# Check existing databases
mysql -u root -proot -e "SHOW DATABASES;"

# Create database
mysql -u root -proot -e "CREATE DATABASE StudentManagement_Dev;"

# Initialize from script
mysql -u root -proot StudentManagement_Dev < student-project/database/init.sql
```

### Connection Timeout

**Symptom**: `Error: Connection timeout after 30000ms`

**Solutions**:
```bash
# Check MySQL resource usage
docker stats mysql-student

# Increase memory limit
docker update --memory 2g mysql-student

# Or restart
docker-compose down -v
docker-compose up -d mysql
```

---

## 🔵 C# Backend (.NET)

### Build Fails

**Symptom**: `error CS1234: ...`

**Solutions**:
```bash
# Clean and rebuild
cd student-project/backend-csharp/StudentApi
dotnet clean
dotnet build

# Restore packages
dotnet restore

# Check .csproj
cat StudentApi.csproj
```

### Port Already in Use

**Symptom**: `fail: Microsoft.Hosting.Lifetime: Unable to bind to http://0.0.0.0:5000`

**Solutions**:
```bash
# Use different port
dotnet run --urls "http://0.0.0.0:5001"

# Or kill existing process
lsof -i :5000
kill -9 <PID>
```

### Database Connection Failed

**Symptom**: `SqlException: A network-related or instance-specific error occurred`

**Solutions**:
```bash
# Check connection string in appsettings.json
cat StudentApi/appsettings.json | grep ConnectionString

# Verify MySQL is running
docker logs mysql-student

# Test connection
mysql -u student_user -p<PASSWORD> -h 127.0.0.1
```

### Entity Framework Migrations Failed

**Symptom**: `The CREATE TABLE permission is denied`

**Solutions**:
```bash
# Check database permissions
mysql -u root -proot -e "GRANT ALL ON StudentManagement_Dev.* TO 'student_user'@'%';"

# Create migrations
cd student-project/backend-csharp/StudentApi
dotnet ef migrations add Initial

# Update database
dotnet ef database update
```

---

## ☕ Java Backend (Spring Boot)

### Build Fails

**Symptom**: `BUILD FAILURE`

**Solutions**:
```bash
# Clean build
cd student-project/backend-springboot
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Check Java version
java -version
mvn --version
```

### Port Conflict

**Symptom**: `Port 8080 is already in use`

**Solutions**:
```bash
# Use different port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"

# Or in application.properties
echo "server.port=8081" >> src/main/resources/application.properties
```

### Database Connection Issue

**Symptom**: `Cannot get a connection, pool error Timeout waiting for idle object`

**Solutions**:
```bash
# Check datasource config
cat src/main/resources/application.properties | grep spring.datasource

# Verify MySQL is running
docker logs mysql-student

# Check credentials
mysql -u root -proot -h 127.0.0.1 StudentManagement_Dev
```

### Maven Dependency Issues

**Symptom**: `Could not find artifact com.example:...`

**Solutions**:
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Rebuild
mvn clean install -U

# Check internet connection
ping maven.org
```

---

## 💻 Frontend (Next.js)

### Build Fails

**Symptom**: `error: Failed to compile`

**Solutions**:
```bash
cd student-project/frontend-nextjs

# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run type-check
```

### Port 3000 Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Use different port
npm run dev -- -p 3001

# Or kill existing process
lsof -i :3000
kill -9 <PID>
```

### API Connection Failed

**Symptom**: `Error: fetch failed` or `CORS error`

**Solutions**:
```bash
# Check API_URL
cat .env.local | grep NEXT_PUBLIC_API_URL

# Verify backends are running
# C#: http://localhost:5000
# Java: http://localhost:8080
# Node: http://localhost:4000

# Check CORS configuration
# See backend logs for errors
docker-compose logs backend-csharp
```

### Hydration Mismatch Error

**Symptom**: `Warning: Hydration mismatch between...`

**Solutions**:
```bash
# Clear .next and rebuild
rm -rf .next
npm run build

# Check for client-side code in server components
grep -r "useClient" app/

# Ensure events are handled correctly
# Check StudentForm.tsx and StudentList.tsx
```

---

## 🚀 Kubernetes Issues

### Minikube Won't Start

**Symptom**: `Error starting cluster`

**Solutions**:
```bash
# Check system resources
free -h    # At least 4GB RAM
df -h      # At least 10GB disk

# Reset Minikube
minikube delete
minikube start --memory=4096 --cpus=4

# Check logs
minikube logs
```

### Pod Stuck in Pending

**Symptom**: `kubectl get pods` shows `Pending` status

**Solutions**:
```bash
# Check events
kubectl describe pod <pod-name> -n student-management

# Check node resources
kubectl describe nodes

# Check PVC
kubectl get pvc -n student-management

# Restart deployment
kubectl rollout restart deployment/<name> -n student-management
```

### Pod CrashLoopBackOff

**Symptom**: `STATUS: CrashLoopBackOff`

**Solutions**:
```bash
# Check logs
kubectl logs <pod-name> -n student-management

# See previous logs
kubectl logs <pod-name> -n student-management --previous

# Describe pod for events
kubectl describe pod <pod-name> -n student-management
```

### Service Can't Connect to Backend

**Symptom**: `Connection refused` or `timeout`

**Solutions**:
```bash
# Check service
kubectl get svc -n student-management

# Test service connectivity
kubectl run -it --rm debug --image=busybox:1.28 --restart=Never -- sh
# Inside pod:
wget http://backend-csharp:5000

# Check endpoints
kubectl get endpoints -n student-management

# Check network policy
kubectl get networkpolicy -n student-management
```

### Secrets Not Mounted

**Symptom**: `Error: Unable to find secret 'mysql-credentials'`

**Solutions**:
```bash
# Check secrets exist
kubectl get secrets -n student-management

# Describe secret
kubectl describe secret mysql-credentials -n student-management

# Apply secrets
kubectl apply -f k8s/secrets.yaml

# Verify environment variables
kubectl exec -it <pod-name> -n student-management -- env | grep MYSQL
```

---

## 🔄 GitLab CI/CD Issues

### Pipeline Fails

**Symptom**: Job fails with error

**Solutions**:
```bash
# Check job logs in GitLab UI
# Settings → CI/CD → Pipelines

# Verify .gitlab-ci.yml syntax
gitlab-runner verify

# Test locally
gitlab-runner exec docker build:node
```

### Docker Registry Authentication Failed

**Symptom**: `Error response from daemon: denied: requested access to the resource is denied`

**Solutions**:
```bash
# Check registry credentials
cat ~/.docker/config.json

# Login to registry
docker login -u <username> -p <token> <registry>

# Update credentials in GitLab
Settings → CI/CD → Variables
```

### Timeout During Build

**Symptom**: `Job exceeded maximum execution time`

**Solutions**:
```bash
# Increase timeout in .gitlab-ci.yml
timeout: 2 hours

# Or optimize build
# Clear cache: rm -rf node_modules .m2
# Use multi-stage builds

# Check runner resources
gitlab-runner verify
```

---

## 🔐 Security Issues

### Rate Limiting Blocks Legitimate Traffic

**Symptom**: `429 Too Many Requests`

**Solutions**:
```bash
# Check rate limit config
grep -r "100" student-project/backend-nodejs/src/middlewares/

# Adjust limits (if needed)
edit student-project/backend-nodejs/src/middlewares/rate-limit.middleware.js
# Change windowMs or max values

# Whitelist IP addresses
# See backend documentation
```

### CORS Errors

**Symptom**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
```bash
# Check CORS config
grep -r "CORS" student-project/backend-*/

# Add origin to whitelist
# Edit .env and add to CORS_ALLOWED_ORIGINS

# Verify headers in response
curl -i http://localhost:5000
# Look for Access-Control-Allow-Origin header
```

---

## 📊 Performance Issues

### High Memory Usage

**Symptom**: Services slow or crashing

**Solutions**:
```bash
# Check container memory
docker stats

# Increase limits in docker-compose.yml
# Add: mem_limit: 2g

# Restart with clean state
docker-compose down -v
docker-compose up
```

### Slow Database Queries

**Symptom**: API responses slow

**Solutions**:
```bash
# Enable query logging in MySQL
mysql -u root -proot -e "SET GLOBAL log_queries_not_using_indexes=ON;"

# Check logs
docker exec mysql-student tail -f /var/log/mysql/query.log

# Add index if needed
mysql -u root -proot StudentManagement_Dev -e "CREATE INDEX idx_email ON Student(Email);"
```

---

## 📝 Debugging Tips

### Enable Debug Logging

```bash
# Node.js
DEBUG=* npm run dev

# C#
--verbosity Debug

# Java
-Ddebug

# MySQL
SET GLOBAL general_log = 'ON';
```

### Check Logs

```bash
# Docker Compose
docker-compose logs -f <service>

# Kubernetes
kubectl logs <pod> -n student-management -f

# System
systemctl status docker
journalctl -u docker -f
```

### Network Debugging

```bash
# Test connectivity
nc -zv localhost 5000
telnet localhost 3000

# Monitor network
tcpdump -i docker0 -n
nethogs

# DNS resolution
nslookup backend-csharp
```

---

## 🆘 Still Stuck?

1. **Check relevant logs** - Always start here
2. **Search GitHub Issues** - Similar problems likely solved
3. **Read error message carefully** - It usually tells you what's wrong
4. **Try Google** - Most common issues have solutions online
5. **Ask for help** - Create an issue with:
   - What you're trying to do
   - What error you see
   - Full log output
   - Your system info (`docker version`, `uname -a`, etc.)

---

**Last Updated**: 2025-03-24
**Maintainer**: EFREI DevOps Team
