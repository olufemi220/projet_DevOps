#!/bin/bash

# DOCKER_TEST.sh
# Comprehensive Docker Compose testing
set -e  # Exit on error

cd /home/imhotep/efrei/step_by_step/projet_devops

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  DOCKER COMPOSE COMPREHENSIVE TEST                 ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"

# Step 1: Clean up old containers
echo -e "\n${BLUE}[STEP 1] Cleaning up old containers...${NC}"
docker-compose down -v 2>/dev/null || true
sleep 2

# Step 2: Start Docker Compose
echo -e "\n${BLUE}[STEP 2] Starting Docker Compose services...${NC}"
docker-compose up -d
sleep 10

# Step 3: Check service status
echo -e "\n${BLUE}[STEP 3] Checking service status...${NC}"
echo "─────────────────────────────────────────"
docker-compose ps
echo "─────────────────────────────────────────"

# Step 4: Test MySQL Connection
echo -e "\n${BLUE}[STEP 4] Testing MySQL Connection...${NC}"
if docker exec student-mysql mysql -uroot -proot -e "SELECT COUNT(*) as count FROM StudentManagement_Dev.students;" 2>/dev/null; then
    echo -e "${GREEN}✅ MySQL Connection: OK${NC}"
else
    echo -e "${RED}❌ MySQL Connection: FAILED${NC}"
fi

# Step 5: Test Frontend
echo -e "\n${BLUE}[STEP 5] Testing Frontend (Next.js)...${NC}"
sleep 5
if curl -s http://localhost:3000 | grep -q "html\|DOCTYPE" 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend: ACCESSIBLE${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: Checking logs...${NC}"
    docker-compose logs frontend | tail -20
fi

# Step 6: Test C# Backend
echo -e "\n${BLUE}[STEP 6] Testing C# API (ASP.NET Core)...${NC}"
API_RESPONSE=$(curl -s http://localhost:5000/api/students 2>/dev/null || echo "FAILED")
if echo "$API_RESPONSE" | grep -q "^\[" || echo "$API_RESPONSE" | grep -q "id\|firstName"; then
    echo -e "${GREEN}✅ C# API: RESPONDING${NC}"
    echo "   Response: $(echo $API_RESPONSE | head -c 100)..."
else
    echo -e "${RED}❌ C# API: NOT RESPONDING${NC}"
    echo "   Checking logs..."
    docker-compose logs backend-csharp-prd | tail -20
fi

# Step 7: Test Java Backend
echo -e "\n${BLUE}[STEP 7] Testing Java API (Spring Boot)...${NC}"
JAVA_RESPONSE=$(curl -s http://localhost:8080/api/students 2>/dev/null || echo "FAILED")
if echo "$JAVA_RESPONSE" | grep -q "^\[" || echo "$JAVA_RESPONSE" | grep -q "id\|firstName"; then
    echo -e "${GREEN}✅ Java API: RESPONDING${NC}"
    echo "   Response: $(echo $JAVA_RESPONSE | head -c 100)..."
else
    echo -e "${RED}❌ Java API: NOT RESPONDING${NC}"
    echo "   Checking logs..."
    docker-compose logs backend-springboot-prd | tail -20
fi

# Step 8: Test Node.js Backend
echo -e "\n${BLUE}[STEP 8] Testing Node.js API (Express)...${NC}"
NODE_RESPONSE=$(curl -s http://localhost:4000/api-docs 2>/dev/null || echo "FAILED")
if echo "$NODE_RESPONSE" | grep -q "swagger\|api\|Student"; then
    echo -e "${GREEN}✅ Node.js API: RESPONDING${NC}"
else
    echo -e "${RED}❌ Node.js API: NOT RESPONDING${NC}"
    echo "   Checking logs..."
    docker-compose logs backend-node-prd | tail -20
fi

# Step 9: Test CRUD Operations on C# Backend
echo -e "\n${BLUE}[STEP 9] Testing CRUD Operations (C# Backend)...${NC}"
echo "   Testing: POST /api/students (CREATE)"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john.doe@example.com",
    "phone":"0123456789",
    "enrollmentDate":"2025-01-01"
  }' 2>/dev/null || echo "FAILED")

if echo "$CREATE_RESPONSE" | grep -q "\"id\""; then
    STUDENT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    echo -e "${GREEN}✅ CREATE: SUCCESS (ID: $STUDENT_ID)${NC}"
    
    # Test GET
    echo "   Testing: GET /api/students/$STUDENT_ID (READ)"
    GET_RESPONSE=$(curl -s http://localhost:5000/api/students/$STUDENT_ID 2>/dev/null || echo "FAILED")
    if echo "$GET_RESPONSE" | grep -q "John"; then
        echo -e "${GREEN}✅ READ: SUCCESS${NC}"
    else
        echo -e "${RED}❌ READ: FAILED${NC}"
    fi
else
    echo -e "${RED}❌ CREATE: FAILED${NC}"
    echo "   Response: $CREATE_RESPONSE"
fi

# Summary
echo -e "\n${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  TEST SUITE COMPLETED                              ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Services Status:${NC}"
docker-compose ps --services --filter "status=running"

echo -e "\n${YELLOW}To view logs: ${NC}docker-compose logs -f [service_name]"
echo -e "${YELLOW}To stop: ${NC}docker-compose down"
