#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a process is running on a port
check_port() {
    lsof -i:$1 > /dev/null
    return $?
}

# Check if MongoDB is running
if ! mongod --version &> /dev/null; then
    echo -e "${RED}MongoDB is not installed. Please install MongoDB first.${NC}"
    exit 1
fi

# Start backend server
echo -e "${BLUE}Starting backend server...${NC}"
cd backend

if check_port 5000; then
    echo -e "${RED}Port 5000 is already in use. Please free up the port and try again.${NC}"
    exit 1
fi

npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo -e "Waiting for backend server to start..."
sleep 5

# Check if backend started successfully
if ! check_port 5000; then
    echo -e "${RED}Failed to start backend server${NC}"
    kill $BACKEND_PID
    exit 1
fi

echo -e "${GREEN}Backend server started successfully!${NC}"

# Start frontend development server
echo -e "\n${BLUE}Starting frontend development server...${NC}"
cd ../frontend

if check_port 3000; then
    echo -e "${RED}Port 3000 is already in use. Please free up the port and try again.${NC}"
    kill $BACKEND_PID
    exit 1
fi

npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "Waiting for frontend server to start..."
sleep 5

# Check if frontend started successfully
if ! check_port 3000; then
    echo -e "${RED}Failed to start frontend server${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 1
fi

echo -e "${GREEN}Frontend server started successfully!${NC}"
echo -e "\n${GREEN}Application is now running!${NC}"
echo -e "Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "Backend API: ${BLUE}http://localhost:5000/api${NC}"
echo -e "\nPress Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
