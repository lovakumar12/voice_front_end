import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API interfaces
export interface QueryRequest {
  query: string;
  language?: string;
}

export interface QueryResponse {
  response: string;
  confidence: number;
  processing_time: number;
  language: string;
}

export interface CallRecording {
  id: string;
  timestamp: string;
  duration: number;
  language: string;
  status: 'completed' | 'failed' | 'processing';
  participant_id: string;
  transcription?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  audio_url?: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'stt' | 'tts' | 'llm' | 'embedding';
  provider: string;
  model: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  last_updated: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  component: string;
}

export interface DashboardMetrics {
  total_calls: number;
  active_sessions: number;
  avg_response_time: number;
  success_rate: number;
  call_volume_data: Array<{
    name: string;
    calls: number;
    duration: number;
  }>;
  language_distribution: Array<{
    name: string;
    value: number;
  }>;
}

// API functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Query processing
  async processQuery(request: QueryRequest): Promise<QueryResponse> {
    const response = await api.post('/query', request);
    return response.data;
  },

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  // Call recordings
  async getCallRecordings(): Promise<CallRecording[]> {
    const response = await api.get('/recordings');
    return response.data;
  },

  async downloadRecording(recordingId: string): Promise<Blob> {
    const response = await api.get(`/recordings/${recordingId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteRecording(recordingId: string): Promise<void> {
    await api.delete(`/recordings/${recordingId}`);
  },

  // Model management
  async getModelConfigurations(): Promise<ModelConfig[]> {
    const response = await api.get('/models');
    return response.data;
  },

  async updateModelConfiguration(modelId: string, config: Record<string, any>): Promise<void> {
    await api.put(`/models/${modelId}`, config);
  },

  async testModel(modelId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/models/${modelId}/test`);
    return response.data;
  },

  // System metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    const response = await api.get('/system/metrics');
    return response.data;
  },

  async getSystemLogs(): Promise<LogEntry[]> {
    const response = await api.get('/logs');
    return response.data;
  },

  // WebSocket connection for real-time communication
  createWebSocketConnection(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const wsUrl = API_BASE_URL.replace('http', 'ws').replace('/api', '/ws/voice');
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) {
        onError(error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return {
      send: (data: any) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      },
      close: () => socket.close(),
    };
  },
};

export default apiService;