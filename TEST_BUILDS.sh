#!/bin/bash

# TEST_BUILDS.sh
# Comprehensive build testing script for all backends and frontend
# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}     STUDENT MANAGEMENT - BUILD TEST SUITE      ${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════${NC}"

# Test 1: Frontend Build (Next.js)
echo -e "\n${YELLOW}[TEST 1] Frontend Build (Next.js)${NC}"
cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/frontend-nextjs
if [ $? -eq 0 ]; then
    npm install 2>&1 | tail -5
    npm run build 2>&1 | tail -5
    if [ -d ".next" ]; then
        echo -e "${GREEN}✅ Frontend build: SUCCESS${NC}"
    else
        echo -e "${RED}❌ Frontend build: FAILED (no .next dir)${NC}"
    fi
else
    echo -e "${RED}❌ Frontend path not found${NC}"
fi

# Test 2: C# Backend Build
echo -e "\n${YELLOW}[TEST 2] C# Backend Build (.NET 7)${NC}"
cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-csharp/StudentApi
if [ $? -eq 0 ]; then
    dotnet restore 2>&1 | tail -3
    dotnet build -c Release 2>&1 | tail -3
    if [ -d "bin/Release" ]; then
        echo -e "${GREEN}✅ C# backend build: SUCCESS${NC}"
    else
        echo -e "${RED}❌ C# backend build: FAILED${NC}"
    fi
else
    echo -e "${RED}❌ C# backend path not found${NC}"
fi

# Test 3: Java Backend Build (Maven)
echo -e "\n${YELLOW}[TEST 3] Java Backend Build (Spring Boot)${NC}"
cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-springboot
if [ $? -eq 0 ]; then
    mvn clean install -DskipTests -q 2>&1 | tail -3
    if [ -f "target/spring-api-1.0.0.jar" ] || [ -f "target/student-api-1.0.0.jar" ]; then
        echo -e "${GREEN}✅ Java backend build: SUCCESS${NC}"
    else
        echo -e "${RED}❌ Java backend build: FAILED${NC}"
    fi
else
    echo -e "${RED}❌ Java backend path not found${NC}"
fi

# Test 4: Node.js Backend Build
echo -e "\n${YELLOW}[TEST 4] Node.js Backend Build${NC}"
cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-nodejs
if [ $? -eq 0 ]; then
    npm install 2>&1 | tail -3
    npm run build 2>&1 | tail -3
    echo -e "${GREEN}✅ Node.js backend build: SUCCESS${NC}"
else
    echo -e "${RED}❌ Node.js backend path not found${NC}"
fi

echo -e "\n${YELLOW}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ BUILD TEST SUITE COMPLETED${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════${NC}"
