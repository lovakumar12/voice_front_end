#!/bin/bash

# Voice Agent System Startup Script

echo "🚀 Starting Voice Agent Management System..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Function to install Python dependencies
install_python_deps() {
    echo "📦 Installing Python dependencies..."
    if [ -f "requirements_frontend.txt" ]; then
        pip install -r requirements_frontend.txt
    else
        echo "❌ requirements_frontend.txt not found!"
        exit 1
    fi
}

# Function to install Node.js dependencies
install_node_deps() {
    echo "📦 Installing Node.js dependencies..."
    if [ -d "frontend" ]; then
        cd frontend
        npm install
        cd ..
    else
        echo "❌ Frontend directory not found!"
        exit 1
    fi
}

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    python backend_api.py &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend development server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    echo "Frontend started with PID: $FRONTEND_PID"
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        echo "Frontend stopped"
    fi
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT

# Check if dependencies should be installed
if [ "$1" = "--install" ]; then
    install_python_deps
    install_node_deps
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
# API Keys
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here

# Model Settings
DEFAULT_STT_MODEL=whisper-large-v3
DEFAULT_TTS_MODEL=simba-multilingual
DEFAULT_LLM_MODEL=llama3-70b-8192

# Server Settings
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:3000
EOL
    echo "📝 Please edit .env file with your API keys before running the system."
    exit 1
fi

# Start services
start_backend
sleep 3  # Give backend time to start

start_frontend
sleep 3  # Give frontend time to start

echo "✅ Voice Agent Management System is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop all services"

# Wait for services
wait