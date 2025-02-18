#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up 360° Employee Evaluation System...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

# Create .env files if they don't exist
cd ..
if [ ! -f backend/.env ]; then
    echo -e "\n${BLUE}Creating backend .env file...${NC}"
    cat > backend/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/evaluation360
JWT_SECRET=your-secret-key-here
EOL
    echo -e "${GREEN}Backend .env file created${NC}"
fi

if [ ! -f frontend/.env ]; then
    echo -e "\n${BLUE}Creating frontend .env file...${NC}"
    cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
EOL
    echo -e "${GREEN}Frontend .env file created${NC}"
fi

# Create start script
echo -e "\n${BLUE}Creating start script...${NC}"
cat > start.sh << EOL
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Start backend
echo -e "\${BLUE}Starting backend server...${NC}"
cd backend
npm start &
BACKEND_PID=\$!

# Start frontend
echo -e "\${BLUE}Starting frontend development server...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=\$!

# Wait for both processes
wait \$BACKEND_PID \$FRONTEND_PID
EOL

chmod +x start.sh
echo -e "${GREEN}Start script created${NC}"

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "\nTo start the application:"
echo -e "1. Make sure MongoDB is running"
echo -e "2. Run ${BLUE}./start.sh${NC}"
echo -e "\nThe application will be available at:"
echo -e "- Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "- Backend API: ${BLUE}http://localhost:5000${NC}"
