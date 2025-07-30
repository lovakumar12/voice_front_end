import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface ConversationMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  language?: string;
  confidence?: number;
}

interface VoiceSettings {
  language: string;
  sttModel: string;
  ttsModel: string;
  llmModel: string;
}

const VoiceAgent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en',
    sttModel: 'whisper-large-v3',
    ttsModel: 'simba-multilingual',
    llmModel: 'llama3-70b-8192',
  });

  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleConnect = async () => {
    try {
      setIsConnected(true);
      toast.success('Connected to voice agent');
      
      // Add welcome message
      const welcomeMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'agent',
        content: 'Hello! I\'m your voice assistant. How can I help you today?',
        timestamp: new Date(),
      };
      setConversation([welcomeMessage]);
    } catch (error) {
      toast.error('Failed to connect to voice agent');
      setIsConnected(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsRecording(false);
    setIsProcessing(false);
    toast.success('Disconnected from voice agent');
  };

  const handleStartRecording = async () => {
    if (!isConnected) {
      toast.error('Please connect to the voice agent first');
      return;
    }

    try {
      setIsRecording(true);
      setCurrentTranscription('');
      toast.success('Recording started');
      
      // Simulate real-time transcription
      setTimeout(() => {
        setCurrentTranscription('Hello, I need help with...');
      }, 1000);
      
      setTimeout(() => {
        setCurrentTranscription('Hello, I need help with my account settings');
      }, 2000);
    } catch (error) {
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (!isRecording) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: currentTranscription || 'Hello, I need help with my account settings',
        timestamp: new Date(),
        language: voiceSettings.language,
        confidence: 0.95,
      };
      
      setConversation(prev => [...prev, userMessage]);
      setCurrentTranscription('');
      
      // Simulate agent processing and response
      setTimeout(() => {
        const agentMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: 'I\'d be happy to help you with your account settings. Could you please specify what particular setting you\'d like to modify or learn about?',
          timestamp: new Date(),
        };
        
        setConversation(prev => [...prev, agentMessage]);
        setIsProcessing(false);
        toast.success('Response generated');
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to process recording');
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim() || !isConnected) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setTextInput('');
    setIsProcessing(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `I understand you said: "${userMessage.content}". Let me help you with that.`,
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleClearConversation = () => {
    setConversation([]);
    toast.success('Conversation cleared');
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali',
      'ta': 'Tamil',
    };
    return languages[code] || code;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Voice Agent Interface
      </Typography>

      {/* Connection Status and Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={isConnected ? 'success' : 'default'}
              icon={isConnected ? <CallIcon /> : <CallEndIcon />}
            />
            {isRecording && (
              <Chip
                label="Recording"
                color="error"
                icon={<MicIcon />}
              />
            )}
            {isProcessing && (
              <Chip
                label="Processing"
                color="warning"
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setSettingsOpen(true)} disabled={!isConnected}>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={handleClearConversation} disabled={!isConnected}>
              <HistoryIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!isConnected ? (
            <Button
              variant="contained"
              startIcon={<CallIcon />}
              onClick={handleConnect}
              size="large"
            >
              Connect to Voice Agent
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="error"
                startIcon={<CallEndIcon />}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
              
              <Button
                variant={isRecording ? "outlined" : "contained"}
                color={isRecording ? "error" : "primary"}
                startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isProcessing}
                size="large"
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <IconButton
                onClick={() => setIsMuted(!isMuted)}
                color={isMuted ? 'error' : 'default'}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </>
          )}
        </Box>

        {/* Real-time Transcription */}
        {currentTranscription && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Transcribing:</strong> {currentTranscription}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Processing your request...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </Paper>

      {/* Conversation History */}
      <Paper sx={{ flex: 1, p: 2, mb: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Conversation
        </Typography>
        
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          {conversation.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                No conversation yet. Connect and start talking to your voice agent!
              </Typography>
            </Box>
          ) : (
            <List>
              {conversation.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                      px: 0,
                    }}
                  >
                    <Card
                      sx={{
                        maxWidth: '70%',
                        bgcolor: message.type === 'user' ? 'primary.main' : 'background.paper',
                        color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
                        mb: 1,
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                          {message.confidence && (
                            <Chip
                              label={`${Math.round(message.confidence * 100)}%`}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                  {index < conversation.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          <div ref={conversationEndRef} />
        </Box>

        {/* Text Input */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            disabled={!isConnected || isProcessing}
            size="small"
          />
          <IconButton
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || !isConnected || isProcessing}
            color="primary"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Voice Agent Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={voiceSettings.language}
                label="Language"
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="bn">Bengali</MenuItem>
                <MenuItem value="ta">Tamil</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>STT Model</InputLabel>
              <Select
                value={voiceSettings.sttModel}
                label="STT Model"
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, sttModel: e.target.value }))}
              >
                <MenuItem value="whisper-large-v3">Whisper Large V3</MenuItem>
                <MenuItem value="whisper-medium">Whisper Medium</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>TTS Model</InputLabel>
              <Select
                value={voiceSettings.ttsModel}
                label="TTS Model"
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, ttsModel: e.target.value }))}
              >
                <MenuItem value="simba-multilingual">Simba Multilingual</MenuItem>
                <MenuItem value="elevenlabs">ElevenLabs</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>LLM Model</InputLabel>
              <Select
                value={voiceSettings.llmModel}
                label="LLM Model"
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, llmModel: e.target.value }))}
              >
                <MenuItem value="llama3-70b-8192">Llama 3 70B</MenuItem>
                <MenuItem value="llama3-8b-8192">Llama 3 8B</MenuItem>
                <MenuItem value="mixtral-8x7b-32768">Mixtral 8x7B</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setSettingsOpen(false);
              toast.success('Settings updated');
            }}
            variant="contained"
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoiceAgent;