from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
import logging
from datetime import datetime, timedelta
import os
import glob
from pathlib import Path

# Import your existing voice agent components
from dev-calling-agent.src.agent.agent import AgenticRAG
from dev-calling-agent.voice_agent import VoiceAssistant

app = FastAPI(title="Voice Agent API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the voice agent
try:
    rag_agent = AgenticRAG()
    logging.info("Voice agent initialized successfully")
except Exception as e:
    logging.error(f"Failed to initialize voice agent: {e}")
    rag_agent = None

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class QueryResponse(BaseModel):
    response: str
    confidence: float
    processing_time: float
    language: str

class CallRecording(BaseModel):
    id: str
    timestamp: datetime
    duration: int
    language: str
    status: str
    participant_id: str
    transcription: Optional[str] = None
    sentiment: Optional[str] = None
    audio_url: Optional[str] = None

class ModelConfig(BaseModel):
    id: str
    name: str
    type: str
    provider: str
    model: str
    status: str
    config: Dict[str, Any]
    last_updated: datetime

class SystemMetric(BaseModel):
    name: str
    value: float
    unit: str
    status: str
    trend: str

class LogEntry(BaseModel):
    id: str
    timestamp: datetime
    level: str
    message: str
    component: str

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# API Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a text query using the RAG agent"""
    if not rag_agent:
        raise HTTPException(status_code=503, detail="Voice agent not available")
    
    try:
        start_time = datetime.now()
        result = rag_agent.run(request.query)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return QueryResponse(
            response=result.get('generation', 'No response generated'),
            confidence=0.95,  # Mock confidence score
            processing_time=processing_time,
            language=request.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/api/dashboard/metrics")
async def get_dashboard_metrics():
    """Get dashboard metrics"""
    # Mock data - replace with actual metrics collection
    return {
        "total_calls": 1247,
        "active_sessions": 12,
        "avg_response_time": 1.8,
        "success_rate": 94.2,
        "call_volume_data": [
            {"name": "Mon", "calls": 45, "duration": 120},
            {"name": "Tue", "calls": 52, "duration": 135},
            {"name": "Wed", "calls": 38, "duration": 98},
            {"name": "Thu", "calls": 61, "duration": 156},
            {"name": "Fri", "calls": 55, "duration": 142},
            {"name": "Sat", "calls": 28, "duration": 78},
            {"name": "Sun", "calls": 33, "duration": 89},
        ],
        "language_distribution": [
            {"name": "English", "value": 65},
            {"name": "Hindi", "value": 20},
            {"name": "Bengali", "value": 10},
            {"name": "Others", "value": 5},
        ]
    }

@app.get("/api/recordings", response_model=List[CallRecording])
async def get_call_recordings():
    """Get call recordings"""
    # Mock data - replace with actual database query
    recordings = [
        CallRecording(
            id="1",
            timestamp=datetime.now() - timedelta(hours=2),
            duration=245,
            language="English",
            status="completed",
            participant_id="user_123",
            transcription="Hello, I need help with my account...",
            sentiment="neutral"
        ),
        CallRecording(
            id="2",
            timestamp=datetime.now() - timedelta(hours=3),
            duration=180,
            language="Hindi",
            status="completed",
            participant_id="user_456",
            transcription="मुझे अपने बिल के बारे में जानकारी चाहिए...",
            sentiment="positive"
        ),
    ]
    return recordings

@app.get("/api/models", response_model=List[ModelConfig])
async def get_model_configurations():
    """Get model configurations"""
    models = [
        ModelConfig(
            id="stt-1",
            name="Whisper Large V3",
            type="stt",
            provider="Groq",
            model="whisper-large-v3",
            status="active",
            config={
                "language": "en",
                "temperature": 0.0,
                "response_format": "text"
            },
            last_updated=datetime.now()
        ),
        ModelConfig(
            id="tts-1",
            name="Simba Multilingual",
            type="tts",
            provider="Speechify",
            model="simba-multilingual",
            status="active",
            config={
                "voice_id": "default",
                "speed": 1.0,
                "pitch": 1.0
            },
            last_updated=datetime.now()
        ),
        ModelConfig(
            id="llm-1",
            name="Llama 3 70B",
            type="llm",
            provider="Groq",
            model="llama3-70b-8192",
            status="active",
            config={
                "temperature": 0.7,
                "max_tokens": 4096,
                "top_p": 0.9
            },
            last_updated=datetime.now()
        ),
    ]
    return models

@app.put("/api/models/{model_id}")
async def update_model_configuration(model_id: str, config: Dict[str, Any]):
    """Update model configuration"""
    # Mock update - replace with actual model configuration update
    return {"message": f"Model {model_id} configuration updated successfully"}

@app.get("/api/system/metrics", response_model=List[SystemMetric])
async def get_system_metrics():
    """Get system performance metrics"""
    import psutil
    
    try:
        # Get actual system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        metrics = [
            SystemMetric(
                name="CPU Usage",
                value=cpu_percent,
                unit="%",
                status="good" if cpu_percent < 70 else "warning" if cpu_percent < 90 else "critical",
                trend="stable"
            ),
            SystemMetric(
                name="Memory Usage",
                value=memory.percent,
                unit="%",
                status="good" if memory.percent < 70 else "warning" if memory.percent < 90 else "critical",
                trend="stable"
            ),
            SystemMetric(
                name="Disk Usage",
                value=disk.percent,
                unit="%",
                status="good" if disk.percent < 70 else "warning" if disk.percent < 90 else "critical",
                trend="stable"
            ),
        ]
        return metrics
    except Exception as e:
        # Fallback to mock data
        return [
            SystemMetric(name="CPU Usage", value=45, unit="%", status="good", trend="stable"),
            SystemMetric(name="Memory Usage", value=72, unit="%", status="warning", trend="up"),
            SystemMetric(name="Disk Usage", value=38, unit="%", status="good", trend="stable"),
        ]

@app.get("/api/logs", response_model=List[LogEntry])
async def get_system_logs():
    """Get system logs"""
    logs = []
    log_dir = Path("dev-calling-agent/logs")
    
    try:
        # Get recent log files
        log_files = sorted(log_dir.glob("*.log"), key=os.path.getmtime, reverse=True)[:5]
        
        for i, log_file in enumerate(log_files):
            # Mock log entries - replace with actual log parsing
            logs.append(LogEntry(
                id=str(i),
                timestamp=datetime.fromtimestamp(os.path.getmtime(log_file)),
                level="info",
                message=f"Log from {log_file.name}",
                component="System"
            ))
    except Exception as e:
        # Fallback to mock data
        logs = [
            LogEntry(
                id="1",
                timestamp=datetime.now() - timedelta(minutes=5),
                level="info",
                message="Voice agent session started successfully",
                component="VoiceAgent"
            ),
            LogEntry(
                id="2",
                timestamp=datetime.now() - timedelta(minutes=10),
                level="warning",
                message="High memory usage detected: 85%",
                component="SystemMonitor"
            ),
        ]
    
    return logs

@app.websocket("/ws/voice")
async def websocket_voice_agent(websocket: WebSocket):
    """WebSocket endpoint for real-time voice communication"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data["type"] == "audio_data":
                # Process audio data here
                # This would integrate with your voice agent
                response = {
                    "type": "transcription",
                    "text": "Transcribed text would appear here",
                    "confidence": 0.95
                }
                await manager.send_personal_message(json.dumps(response), websocket)
            
            elif message_data["type"] == "text_query":
                # Process text query
                if rag_agent:
                    try:
                        result = rag_agent.run(message_data["query"])
                        response = {
                            "type": "agent_response",
                            "text": result.get('generation', 'No response generated'),
                            "confidence": 0.95
                        }
                        await manager.send_personal_message(json.dumps(response), websocket)
                    except Exception as e:
                        error_response = {
                            "type": "error",
                            "message": f"Processing failed: {str(e)}"
                        }
                        await manager.send_personal_message(json.dumps(error_response), websocket)
                        
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Serve static files (React build)
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)