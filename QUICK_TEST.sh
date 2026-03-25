#!/bin/bash

# 🚀 Quick Test Script - Verify all services start correctly

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 PROJECT QUICK TEST${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[STEP 1/5]${NC} Checking prerequisites..."
echo ""

if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗${NC} Docker is required. Install from https://docker.com/"
  exit 1
else
  echo -e "${GREEN}✓${NC} Docker is installed"
fi

if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}✗${NC} Docker Compose is required"
  exit 1
else
  echo -e "${GREEN}✓${NC} Docker Compose is installed"
fi

echo ""

# Validation
echo -e "${YELLOW}[STEP 2/5]${NC} Validating project structure..."
echo ""

test -f docker-compose.yml && echo -e "${GREEN}✓${NC} docker-compose.yml found" || {
  echo -e "${RED}✗${NC} docker-compose.yml not found"
  exit 1
}

test -f .env.example && echo -e "${GREEN}✓${NC} .env.example found" || {
  echo -e "${RED}✗${NC} .env.example not found"
  exit 1
}

test -d k8s && echo -e "${GREEN}✓${NC} Kubernetes manifests found" || {
  echo -e "${RED}✗${NC} k8s/ directory not found"
  exit 1
}

echo ""

# Configuration
echo -e "${YELLOW}[STEP 3/5]${NC} Setting up environment..."
echo ""

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo -e "${GREEN}✓${NC} .env created"
else
  echo -e "${YELLOW}ℹ${NC} Using existing .env"
fi

echo ""

# Start services
echo -e "${YELLOW}[STEP 4/5]${NC} Starting services with docker-compose..."
echo ""

echo "This will download ~2GB of Docker images on first run."
echo "Press Ctrl+C to cancel."
echo ""

if docker-compose up -d 2>&1 | tail -20; then
  echo -e "${GREEN}✓${NC} Services started"
else
  echo -e "${RED}✗${NC} Failed to start services"
  exit 1
fi

echo ""

# Wait for services
echo -e "${YELLOW}[STEP 5/5]${NC} Waiting for services to be ready..."
echo ""

echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
  if docker-compose exec -T mysql mysql -u root -proot -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} MySQL is ready"
    break
  fi
  echo -n "."
  sleep 1
done

echo ""
echo -e "${GREEN}✓${NC} Waiting 5 more seconds for all services..."
sleep 5

echo ""

# Show status
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ALL SERVICES RUNNING${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Service EndPoints:${NC}"
echo ""
echo -e "  Frontend:        ${GREEN}http://localhost:3000${NC}"
echo -e "  C# API:          ${GREEN}http://localhost:5000${NC}"
echo -e "  C# Swagger:      ${GREEN}http://localhost:5000/swagger${NC}"
echo -e "  Java API:        ${GREEN}http://localhost:8080${NC}"
echo -e "  Java Swagger:    ${GREEN}http://localhost:8080/swagger-ui.html${NC}"
echo -e "  Node API:        ${GREEN}http://localhost:4000${NC}"
echo -e "  Node Swagger:    ${GREEN}http://localhost:4000/api-docs${NC}"
echo -e "  MySQL:           ${GREEN}localhost:3306${NC}"
echo ""

echo -e "${YELLOW}Useful Commands:${NC}"
echo ""
echo -e "  View logs:       ${GREEN}docker-compose logs -f${NC}"
echo -e "  Stop services:   ${GREEN}docker-compose down${NC}"
echo -e "  Check status:    ${GREEN}docker-compose ps${NC}"
echo -e "  View DB:         ${GREEN}mysql -u root -proot -h 127.0.0.1 < student-project/database/init.sql${NC}"
echo ""

echo -e "${YELLOW}🧪 Test the Application:${NC}"
echo ""
echo "1. Open your browser and go to ${GREEN}http://localhost:3000${NC}"
echo "2. Fill in the Student form with test data"
echo "3. Click Submit to create a student"
echo "4. Verify the student appears in the list"
echo "5. Test edit and delete functionality"
echo ""

echo -e "${YELLOW}API Testing with curl:${NC}"
echo ""
echo "  # Get all students"
echo "  curl http://localhost:4000/api/students"
echo ""
echo "  # Create a student"
echo "  curl -X POST http://localhost:5000/api/students \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"phone\":\"+33123456789\"}'"
echo ""

echo -e "${YELLOW}Cleanup:${NC}"
echo ""
echo "  To stop all services: ${GREEN}docker-compose down${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
