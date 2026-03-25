#!/bin/bash

# BUILD_BACKEND_JAVA.sh
# Java Backend (Spring Boot 3.1) build test

set -e  # Exit on error

cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-springboot

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  JAVA BACKEND BUILD TEST (Spring Boot)    ${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}[1] Checking Java and Maven...${NC}"
java -version 2>&1 | head -2 || (echo -e "${RED}❌ Java not installed${NC}" && exit 1)
mvn --version | head -2 || (echo -e "${RED}❌ Maven not installed${NC}" && exit 1)

echo -e "\n${YELLOW}[2] Checking pom.xml...${NC}"
if [ -f "pom.xml" ]; then
    echo -e "${GREEN}✅ pom.xml found${NC}"
else
    echo -e "${RED}❌ pom.xml not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[3] Downloading Maven dependencies...${NC}"
if mvn dependency:resolve -q; then
    echo -e "${GREEN}✅ Dependencies resolved${NC}"
else
    echo -e "${RED}❌ Dependency resolution failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[4] Building Spring Boot application...${NC}"
if mvn clean package -DskipTests -q; then
    echo -e "${GREEN}✅ Maven build successful${NC}"
else
    echo -e "${RED}❌ Maven build failed${NC}"
    mvn clean package -DskipTests  # Re-run with output for debugging
    exit 1
fi

echo -e "\n${YELLOW}[5] Checking for JAR file...${NC}"
JAR_FILE=$(find target -name "*.jar" -type f 2>/dev/null | head -1)
if [ -n "$JAR_FILE" ]; then
    echo -e "${GREEN}✅ JAR file found: $JAR_FILE${NC}"
    echo -e "   Size: $(ls -lh $JAR_FILE | awk '{print $5}')"
else
    echo -e "${RED}❌ No JAR file found in target/${NC}"
    ls -la target/
    exit 1
fi

echo -e "\n${YELLOW}[6] Verifying manifest...${NC}"
if jar tf "$JAR_FILE" | grep -q "BOOT-INF/classes/"; then
    echo -e "${GREEN}✅ Spring Boot JAR structure valid${NC}"
else
    echo -e "${RED}❌ Invalid JAR structure${NC}"
    exit 1
fi

echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ JAVA BACKEND BUILD TEST PASSED${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
