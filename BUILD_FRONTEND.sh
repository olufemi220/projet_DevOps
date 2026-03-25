#!/bin/bash

# BUILD_FRONTEND.sh
# Frontend (Next.js) build test

set -e  # Exit on error

cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/frontend-nextjs

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FRONTEND BUILD TEST (Next.js)             ${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}[1] Checking Node.js and npm...${NC}"
node --version || (echo -e "${RED}❌ Node.js not installed${NC}" && exit 1)
npm --version || (echo -e "${RED}❌ npm not installed${NC}" && exit 1)

echo -e "\n${YELLOW}[2] Installing dependencies...${NC}"
npm ci || npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[3] Linting code...${NC}"
npm run lint || true

echo -e "\n${YELLOW}[4] Building Next.js application...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[5] Verifying build output...${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✅ .next directory exists${NC}"
    echo -e "   Size: $(du -sh .next | cut -f1)"
else
    echo -e "${RED}❌ .next directory not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[6] Testing local server startup...${NC}"
timeout 10 npm start &
WAIT_PID=$!
sleep 3
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server started successfully${NC}"
    kill $WAIT_PID 2>/dev/null || true
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $WAIT_PID 2>/dev/null || true
    exit 1
fi

echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ FRONTEND BUILD TEST PASSED${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
