#!/bin/bash

# BUILD_BACKEND_CSHARP.sh
# C# Backend (ASP.NET Core 7) build test

set -e  # Exit on error

cd /home/imhotep/efrei/step_by_step/projet_devops/student-project/backend-csharp/StudentApi

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  C# BACKEND BUILD TEST (ASP.NET Core 7)   ${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}[1] Checking .NET installation...${NC}"
dotnet --version || (echo -e "${RED}❌ .NET not installed${NC}" && exit 1)

echo -e "\n${YELLOW}[2] Restoring NuGet packages...${NC}"
if dotnet restore; then
    echo -e "${GREEN}✅ Packages restored${NC}"
else
    echo -e "${RED}❌ Package restore failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[3] Building solution (Debug)...${NC}"
if dotnet build --configuration Debug; then
    echo -e "${GREEN}✅ Debug build successful${NC}"
else
    echo -e "${RED}❌ Debug build failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[4] Building solution (Release)...${NC}"
if dotnet build --configuration Release; then
    echo -e "${GREEN}✅ Release build successful${NC}"
else
    echo -e "${RED}❌ Release build failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[5] Publishing application...${NC}"
if dotnet publish -c Release -o ./publish_test; then
    echo -e "${GREEN}✅ Publish successful${NC}"
else
    echo -e "${RED}❌ Publish failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[6] Verifying published files...${NC}"
if [ -f "publish_test/StudentApi.dll" ]; then
    echo -e "${GREEN}✅ StudentApi.dll found${NC}"
    echo -e "   Size: $(ls -lh publish_test/StudentApi.dll | awk '{print $5}')"
else
    echo -e "${RED}❌ StudentApi.dll not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[7] Cleaning test directory...${NC}"
rm -rf ./publish_test

echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ C# BACKEND BUILD TEST PASSED${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
