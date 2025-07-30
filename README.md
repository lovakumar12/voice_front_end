# Voice Agent Management System

A comprehensive frontend and backend system for managing voice agents with real-time communication, analytics, and model configuration capabilities.

## Features

### 🎛️ Admin Dashboard
- **Real-time Analytics**: Call volume, response times, language distribution
- **Call Recordings Management**: View, play, download, and analyze call recordings
- **Model Configuration**: Manage STT, TTS, LLM, and embedding models
- **System Monitoring**: CPU, memory, disk usage, and system logs
- **Interactive Charts**: Built with Recharts for beautiful data visualization

### 🎤 Voice Agent Interface
- **Real-time Voice Communication**: WebSocket-based voice interaction
- **Live Transcription**: Real-time speech-to-text with confidence scores
- **Multi-language Support**: English, Hindi, Bengali, Tamil, and more
- **Text Chat**: Alternative text-based communication
- **Conversation History**: Complete chat history with timestamps
- **Model Selection**: Switch between different AI models on-the-fly

### 🔧 Technical Features
- **Modern React Frontend**: Built with TypeScript and Material-UI
- **FastAPI Backend**: High-performance Python backend
- **WebSocket Support**: Real-time bidirectional communication
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI design
- **Error Handling**: Comprehensive error handling and user feedback

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  FastAPI Backend│    │ Voice Agent Core│
│                 │    │                 │    │                 │
│ • Admin Dashboard│◄──►│ • REST APIs     │◄──►│ • AgenticRAG    │
│ • Voice Interface│    │ • WebSocket     │    │ • STT/TTS       │
│ • Model Config  │    │ • Model Mgmt    │    │ • LLM Processing│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone and navigate to the project**:
```bash
cd /workspace
```

2. **Install Python dependencies**:
```bash
pip install -r requirements_frontend.txt
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your API keys (GROQ_API_KEY, etc.)
```

4. **Start the backend server**:
```bash
python backend_api.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

### Admin Dashboard

1. **Navigate to Admin Dashboard**: Go to `http://localhost:3000/admin`

2. **View Analytics**: 
   - Monitor call volume and duration trends
   - Analyze language distribution
   - Track response time performance

3. **Manage Call Recordings**:
   - View all call recordings in a data grid
   - Play audio recordings directly in the browser
   - Download recordings for offline analysis
   - Filter by language and search transcriptions

4. **Configure Models**:
   - Switch between different STT models (Whisper variants)
   - Adjust TTS settings (speed, pitch, voice)
   - Tune LLM parameters (temperature, max tokens)
   - Test model configurations

5. **Monitor System Health**:
   - View real-time system metrics
   - Check CPU, memory, and disk usage
   - Review system logs and errors

### Voice Agent Interface

1. **Navigate to Voice Agent**: Go to `http://localhost:3000/voice-agent`

2. **Connect to Agent**:
   - Click "Connect to Voice Agent"
   - Wait for connection confirmation

3. **Voice Interaction**:
   - Click "Start Recording" to begin voice input
   - Speak your query
   - Click "Stop Recording" to process
   - Receive audio and text responses

4. **Text Interaction**:
   - Type messages in the text input
   - Press Enter or click Send
   - View conversation history

5. **Configure Settings**:
   - Click the settings icon
   - Select language and models
   - Save configuration

## API Documentation

### REST Endpoints

- `GET /api/health` - Health check
- `POST /api/query` - Process text queries
- `GET /api/dashboard/metrics` - Dashboard analytics
- `GET /api/recordings` - Call recordings list
- `GET /api/models` - Model configurations
- `PUT /api/models/{id}` - Update model config
- `GET /api/system/metrics` - System metrics
- `GET /api/logs` - System logs

### WebSocket Endpoints

- `WS /ws/voice` - Real-time voice communication

## Configuration

### Environment Variables

```bash
# API Keys
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key

# Model Settings
DEFAULT_STT_MODEL=whisper-large-v3
DEFAULT_TTS_MODEL=simba-multilingual
DEFAULT_LLM_MODEL=llama3-70b-8192

# Server Settings
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Model Configuration

Models can be configured through the admin interface or API:

```json
{
  "stt": {
    "model": "whisper-large-v3",
    "language": "en",
    "temperature": 0.0
  },
  "tts": {
    "model": "simba-multilingual",
    "speed": 1.0,
    "pitch": 1.0
  },
  "llm": {
    "model": "llama3-70b-8192",
    "temperature": 0.7,
    "max_tokens": 4096
  }
}
```

## Development

### Frontend Development

```bash
cd frontend
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

### Backend Development

```bash
python backend_api.py              # Start server
uvicorn backend_api:app --reload   # Development with auto-reload
```

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Endpoints**: Add to `backend_api.py`
3. **Models**: Add to appropriate model configuration sections

## Deployment

### Production Build

1. **Build frontend**:
```bash
cd frontend
npm run build
```

2. **Start production server**:
```bash
python backend_api.py
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.9
WORKDIR /app
COPY requirements_frontend.txt ./
RUN pip install -r requirements_frontend.txt
COPY . ./
COPY --from=frontend /app/frontend/build ./frontend/build
EXPOSE 8000
CMD ["python", "backend_api.py"]
```

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**:
   - Check if backend is running on port 8000
   - Verify CORS settings in `backend_api.py`

2. **Voice Agent Not Responding**:
   - Check API keys in environment variables
   - Verify model configurations
   - Check system logs in admin dashboard

3. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

### Logs and Debugging

- Backend logs: Check console output where `backend_api.py` is running
- Frontend logs: Check browser developer console
- System logs: Available in admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review system logs in the admin dashboard
- Open an issue in the repository