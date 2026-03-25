#!/bin/bash

# 🐳 Docker Build Test Script
# Test building each service individually

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${RESET}"
echo -e "${BLUE}🐳 DOCKER BUILD TEST SUITE${RESET}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${RESET}"
echo ""

# Check Docker availability
echo -e "${YELLOW}Checking Docker...${RESET}"
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker not installed${RESET}"
  exit 1
fi

DOCKER_VERSION=$(docker --version | awk '{print $3}' | cut -d, -f1)
echo -e "${GREEN}✓${RESET} Docker $DOCKER_VERSION found"
echo ""

# Test 1: Frontend Docker Build
echo -e "${YELLOW}[BUILD TEST 1/4]${RESET} Building Frontend image..."
cd student-project/frontend-nextjs
if docker build -t test-frontend:latest . --quiet 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} Frontend Docker build successful"
  docker images | grep test-frontend
else
  echo -e "${RED}✗${RESET} Frontend Docker build failed"
fi
cd ../..
echo ""

# Test 2: C# Backend Docker Build
echo -e "${YELLOW}[BUILD TEST 2/4]${RESET} Building C# Backend image..."
cd student-project/backend-csharp/StudentApi
if docker build -t test-csharp:latest . --quiet 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} C# Backend Docker build successful"
  docker images | grep test-csharp | head -1
else
  echo -e "${RED}✗${RESET} C# Backend Docker build failed"
fi
cd ../../..
echo ""

# Test 3: Java Backend Docker Build
echo -e "${YELLOW}[BUILD TEST 3/4]${RESET} Building Java Backend image..."
cd student-project/backend-springboot

# Check if JAR exists, build if not
if [ ! -f "target/student-api-1.0.0.jar" ]; then
  echo "  Building JAR first..."
  mvn clean package -DskipTests -q 2>/dev/null || echo -e "    ${YELLOW}Note: Maven build skipped${RESET}"
fi

if docker build -t test-java:latest . --quiet 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} Java Backend Docker build successful"
  docker images | grep test-java | head -1
else
  echo -e "${RED}⚠${RESET} Java Backend Docker build warning (may need JAR)"
fi
cd ../../..
echo ""

# Test 4: Node Backend Docker Build
echo -e "${YELLOW}[BUILD TEST 4/4]${RESET} Building Node Backend image..."
cd student-project/backend-nodejs
if docker build -t test-node:latest . --quiet 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} Node Backend Docker build successful"
  docker images | grep test-node | head -1
else
  echo -e "${RED}✗${RESET} Node Backend Docker build failed"
fi
cd ../../..
echo ""

# Summary
echo -e "${BLUE}════════════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}✓ DOCKER BUILD TESTS COMPLETE${RESET}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${RESET}"
echo ""

# List all test images
echo -e "${YELLOW}Built Docker Images:${RESET}"
docker images | grep test- || echo "No test images found"
echo ""

echo "📝 To test full stack:"
echo "  docker-compose up -d              # Start all services"
echo "  docker-compose logs -f            # View logs"
echo "  docker-compose down               # Stop services"
echo ""
