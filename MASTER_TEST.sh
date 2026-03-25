#!/bin/bash

# MASTER_TEST.sh
# Master test script - runs all critical tests in sequence

cd /home/imhotep/efrei/step_by_step/projet_devops

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Array to track success/failure
declare -a RESULTS
declare -a TESTS=("Frontend" "C# Backend" "Java Backend" "Node.js Backend")

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STUDENT MANAGEMENT PROJECT - MASTER TEST SUITE   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

# Make all scripts executable
chmod +x BUILD_FRONTEND.sh BUILD_BACKEND_CSHARP.sh BUILD_BACKEND_JAVA.sh BUILD_BACKEND_NODE.sh 2>/dev/null || true

# Test 1: Frontend
echo -e "\n${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  TEST 1: FRONTEND (Next.js)                        ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
if bash BUILD_FRONTEND.sh 2>&1; then
    RESULTS+=("${GREEN}✅ FRONTEND${NC}")
    echo -e "${GREEN}✅ FRONTEND BUILD: PASSED${NC}"
else
    RESULTS+=("${RED}❌ FRONTEND${NC}")
    echo -e "${RED}❌ FRONTEND BUILD: FAILED${NC}"
fi

# Test 2: C# Backend
echo -e "\n${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  TEST 2: C# BACKEND (ASP.NET Core 7)              ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
if bash BUILD_BACKEND_CSHARP.sh 2>&1; then
    RESULTS+=("${GREEN}✅ C# BACKEND${NC}")
    echo -e "${GREEN}✅ C# BACKEND BUILD: PASSED${NC}"
else
    RESULTS+=("${RED}❌ C# BACKEND${NC}")
    echo -e "${RED}❌ C# BACKEND BUILD: FAILED${NC}"
fi

# Test 3: Java Backend
echo -e "\n${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  TEST 3: JAVA BACKEND (Spring Boot 3.1)           ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
if bash BUILD_BACKEND_JAVA.sh 2>&1; then
    RESULTS+=("${GREEN}✅ JAVA BACKEND${NC}")
    echo -e "${GREEN}✅ JAVA BACKEND BUILD: PASSED${NC}"
else
    RESULTS+=("${RED}❌ JAVA BACKEND${NC}")
    echo -e "${RED}❌ JAVA BACKEND BUILD: FAILED${NC}"
fi

# Test 4: Node.js Backend
echo -e "\n${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  TEST 4: NODE.JS BACKEND (Express)                ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
if bash BUILD_BACKEND_NODE.sh 2>&1; then
    RESULTS+=("${GREEN}✅ NODE.JS BACKEND${NC}")
    echo -e "${GREEN}✅ NODE.JS BACKEND BUILD: PASSED${NC}"
else
    RESULTS+=("${RED}❌ NODE.JS BACKEND${NC}")
    echo -e "${RED}❌ NODE.JS BACKEND BUILD: FAILED${NC}"
fi

# Summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST SUITE SUMMARY                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

for result in "${RESULTS[@]}"; do
    echo -e "  $result"
done

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "  1. Review results above"
echo -e "  2. Fix any failed components"
echo -e "  3. Run Docker Compose tests: ${BLUE}bash DOCKER_TEST.sh${NC}"
echo -e "  4. Deploy to Kubernetes"
echo -e "  5. Run CI/CD pipeline"
