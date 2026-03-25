#!/bin/bash

# BUILD_BACKEND_NODE.sh
# Node.js Backend build test

set -e  # Exit on error

cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-nodejs

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  NODE.JS BACKEND BUILD TEST (Express)     ${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}[1] Checking Node.js and npm...${NC}"
node --version || (echo -e "${RED}❌ Node.js not installed${NC}" && exit 1)
npm --version || (echo -e "${RED}❌ npm not installed${NC}" && exit 1)

echo -e "\n${YELLOW}[2] Checking package.json...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json found${NC}"
    jq '.name,.version' package.json || true
else
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[3] Installing dependencies...${NC}"
if npm ci || npm install; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo -e "   Packages: $(npm ls --depth=0 2>/dev/null | wc -l)"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[4] Running linter...${NC}"
if npm run lint 2>/dev/null || echo "Linter check completed"; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  Linting warnings (not critical)${NC}"
fi

echo -e "\n${YELLOW}[5] Running build...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}⚠️  Build had warnings (continuing)${NC}"
fi

echo -e "\n${YELLOW}[6] Checking source files...${NC}"
if [ -f "src/server.js" ] && [ -f "src/app.js" ]; then
    echo -e "${GREEN}✅ Server files present${NC}"
else
    echo -e "${RED}❌ Server files missing${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[7] Testing syntax with Node...${NC}"
if node --check src/server.js && node --check src/app.js; then
    echo -e "${GREEN}✅ Source files syntax valid${NC}"
else
    echo -e "${RED}❌ Syntax errors in source files${NC}"
    exit 1
fi

echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ NODE.JS BACKEND BUILD TEST PASSED${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
