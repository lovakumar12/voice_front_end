import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Slider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface ModelConfig {
  id: string;
  name: string;
  type: 'stt' | 'tts' | 'llm' | 'embedding';
  provider: string;
  model: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastUpdated: Date;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ModelManagement: React.FC = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [testingModel, setTestingModel] = useState<string | null>(null);

  // Mock model configurations
  useEffect(() => {
    const mockModels: ModelConfig[] = [
      {
        id: 'stt-1',
        name: 'Whisper Large V3',
        type: 'stt',
        provider: 'Groq',
        model: 'whisper-large-v3',
        status: 'active',
        config: {
          language: 'en',
          temperature: 0.0,
          response_format: 'text',
        },
        lastUpdated: new Date(),
      },
      {
        id: 'tts-1',
        name: 'Simba Multilingual',
        type: 'tts',
        provider: 'Speechify',
        model: 'simba-multilingual',
        status: 'active',
        config: {
          voice_id: 'default',
          speed: 1.0,
          pitch: 1.0,
        },
        lastUpdated: new Date(),
      },
      {
        id: 'llm-1',
        name: 'Llama 3 70B',
        type: 'llm',
        provider: 'Groq',
        model: 'llama3-70b-8192',
        status: 'active',
        config: {
          temperature: 0.7,
          max_tokens: 4096,
          top_p: 0.9,
        },
        lastUpdated: new Date(),
      },
      {
        id: 'emb-1',
        name: 'MiniLM L6 V2',
        type: 'embedding',
        provider: 'HuggingFace',
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        status: 'active',
        config: {
          normalize_embeddings: true,
          batch_size: 32,
        },
        lastUpdated: new Date(),
      },
    ];
    setModels(mockModels);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditModel = (model: ModelConfig) => {
    setEditingModel({ ...model });
    setDialogOpen(true);
  };

  const handleSaveModel = () => {
    if (!editingModel) return;

    setModels(models.map(m => 
      m.id === editingModel.id 
        ? { ...editingModel, lastUpdated: new Date() }
        : m
    ));
    setDialogOpen(false);
    setEditingModel(null);
    toast.success('Model configuration updated successfully');
  };

  const handleTestModel = async (modelId: string) => {
    setTestingModel(modelId);
    // Simulate model testing
    setTimeout(() => {
      setTestingModel(null);
      toast.success('Model test completed successfully');
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return null;
    }
  };

  const filterModelsByType = (type: string) => {
    return models.filter(model => model.type === type);
  };

  const renderModelCard = (model: ModelConfig) => (
    <Card key={model.id} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {model.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(model.status)}
            <Chip
              label={model.status}
              color={getStatusColor(model.status) as any}
              size="small"
            />
          </Box>
        </Box>
        
        <Typography color="text.secondary" gutterBottom>
          Provider: {model.provider}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Model: {model.model}
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 2 }}>
          Last Updated: {model.lastUpdated.toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<SettingsIcon />}
          onClick={() => handleEditModel(model)}
        >
          Configure
        </Button>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => handleTestModel(model.id)}
          disabled={testingModel === model.id}
        >
          {testingModel === model.id ? 'Testing...' : 'Test'}
        </Button>
      </CardActions>
    </Card>
  );

  const renderConfigFields = () => {
    if (!editingModel) return null;

    switch (editingModel.type) {
      case 'stt':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={editingModel.config.language || 'en'}
                label="Language"
                onChange={(e) => setEditingModel({
                  ...editingModel,
                  config: { ...editingModel.config, language: e.target.value }
                })}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="bn">Bengali</MenuItem>
                <MenuItem value="auto">Auto-detect</MenuItem>
              </Select>
            </FormControl>
            <Typography gutterBottom>Temperature: {editingModel.config.temperature}</Typography>
            <Slider
              value={editingModel.config.temperature || 0}
              onChange={(_, value) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, temperature: value }
              })}
              min={0}
              max={1}
              step={0.1}
              sx={{ mb: 2 }}
            />
          </>
        );
      
      case 'tts':
        return (
          <>
            <TextField
              fullWidth
              label="Voice ID"
              value={editingModel.config.voice_id || ''}
              onChange={(e) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, voice_id: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <Typography gutterBottom>Speed: {editingModel.config.speed}</Typography>
            <Slider
              value={editingModel.config.speed || 1}
              onChange={(_, value) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, speed: value }
              })}
              min={0.5}
              max={2}
              step={0.1}
              sx={{ mb: 2 }}
            />
            <Typography gutterBottom>Pitch: {editingModel.config.pitch}</Typography>
            <Slider
              value={editingModel.config.pitch || 1}
              onChange={(_, value) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, pitch: value }
              })}
              min={0.5}
              max={2}
              step={0.1}
              sx={{ mb: 2 }}
            />
          </>
        );
      
      case 'llm':
        return (
          <>
            <Typography gutterBottom>Temperature: {editingModel.config.temperature}</Typography>
            <Slider
              value={editingModel.config.temperature || 0.7}
              onChange={(_, value) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, temperature: value }
              })}
              min={0}
              max={2}
              step={0.1}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Max Tokens"
              type="number"
              value={editingModel.config.max_tokens || 4096}
              onChange={(e) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, max_tokens: parseInt(e.target.value) }
              })}
              sx={{ mb: 2 }}
            />
            <Typography gutterBottom>Top P: {editingModel.config.top_p}</Typography>
            <Slider
              value={editingModel.config.top_p || 0.9}
              onChange={(_, value) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, top_p: value }
              })}
              min={0}
              max={1}
              step={0.1}
              sx={{ mb: 2 }}
            />
          </>
        );
      
      case 'embedding':
        return (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={editingModel.config.normalize_embeddings || false}
                  onChange={(e) => setEditingModel({
                    ...editingModel,
                    config: { ...editingModel.config, normalize_embeddings: e.target.checked }
                  })}
                />
              }
              label="Normalize Embeddings"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Batch Size"
              type="number"
              value={editingModel.config.batch_size || 32}
              onChange={(e) => setEditingModel({
                ...editingModel,
                config: { ...editingModel.config, batch_size: parseInt(e.target.value) }
              })}
              sx={{ mb: 2 }}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Model Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure and manage different AI models used by your voice agent system.
      </Alert>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`STT Models (${filterModelsByType('stt').length})`} />
            <Tab label={`TTS Models (${filterModelsByType('tts').length})`} />
            <Tab label={`LLM Models (${filterModelsByType('llm').length})`} />
            <Tab label={`Embedding Models (${filterModelsByType('embedding').length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {filterModelsByType('stt').map(model => (
              <Grid item xs={12} md={6} lg={4} key={model.id}>
                {renderModelCard(model)}
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {filterModelsByType('tts').map(model => (
              <Grid item xs={12} md={6} lg={4} key={model.id}>
                {renderModelCard(model)}
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {filterModelsByType('llm').map(model => (
              <Grid item xs={12} md={6} lg={4} key={model.id}>
                {renderModelCard(model)}
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {filterModelsByType('embedding').map(model => (
              <Grid item xs={12} md={6} lg={4} key={model.id}>
                {renderModelCard(model)}
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Model Configuration Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Configure {editingModel?.name}
        </DialogTitle>
        <DialogContent>
          {editingModel && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Provider: {editingModel.provider} | Model: {editingModel.model}
              </Typography>
              {renderConfigFields()}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveModel}
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelManagement;