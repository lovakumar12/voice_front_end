import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { format } from 'date-fns';

interface CallRecording {
  id: string;
  timestamp: Date;
  duration: number;
  language: string;
  status: 'completed' | 'failed' | 'processing';
  participantId: string;
  audioUrl?: string;
  transcription?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

const CallRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<CallRecording | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for recordings
  useEffect(() => {
    const mockRecordings: CallRecording[] = [
      {
        id: '1',
        timestamp: new Date('2024-01-15T10:30:00'),
        duration: 245,
        language: 'English',
        status: 'completed',
        participantId: 'user_123',
        transcription: 'Hello, I need help with my account...',
        sentiment: 'neutral',
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T11:15:00'),
        duration: 180,
        language: 'Hindi',
        status: 'completed',
        participantId: 'user_456',
        transcription: 'मुझे अपने बिल के बारे में जानकारी चाहिए...',
        sentiment: 'positive',
      },
      {
        id: '3',
        timestamp: new Date('2024-01-15T12:00:00'),
        duration: 320,
        language: 'English',
        status: 'failed',
        participantId: 'user_789',
        sentiment: 'negative',
      },
      {
        id: '4',
        timestamp: new Date('2024-01-15T14:30:00'),
        duration: 156,
        language: 'Bengali',
        status: 'processing',
        participantId: 'user_101',
      },
    ];

    setTimeout(() => {
      setRecordings(mockRecordings);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // In a real app, you would start audio playback here
      setTimeout(() => setPlayingId(null), 3000); // Simulate playback ending
    }
  };

  const handleDownload = (recording: CallRecording) => {
    // In a real app, you would download the audio file
    console.log('Downloading recording:', recording.id);
  };

  const handleDelete = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
  };

  const handleViewDetails = (recording: CallRecording) => {
    setSelectedRecording(recording);
    setDialogOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesLanguage = filterLanguage === 'all' || recording.language === filterLanguage;
    const matchesSearch = recording.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.transcription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Date & Time',
      width: 180,
      renderCell: (params) => format(params.value, 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'participantId',
      headerName: 'Participant',
      width: 130,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 100,
      renderCell: (params) => formatDuration(params.value),
    },
    {
      field: 'language',
      headerName: 'Language',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'sentiment',
      headerName: 'Sentiment',
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            color={getSentimentColor(params.value) as any}
            size="small"
          />
        ) : '-'
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={playingId === params.id ? <PauseIcon /> : <PlayIcon />}
          label="Play"
          onClick={() => handlePlay(params.id as string)}
          disabled={params.row.status !== 'completed'}
        />,
        <GridActionsCellItem
          icon={<DownloadIcon />}
          label="Download"
          onClick={() => handleDownload(params.row)}
          disabled={params.row.status !== 'completed'}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Call Recordings
      </Typography>

      {/* Filters and Search */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search recordings"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={filterLanguage}
            label="Language"
            onChange={(e) => setFilterLanguage(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="Bengali">Bengali</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredRecordings}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          onRowClick={(params) => handleViewDetails(params.row)}
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      {/* Recording Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Recording Details - {selectedRecording?.participantId}
        </DialogTitle>
        <DialogContent>
          {selectedRecording && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {format(selectedRecording.timestamp, 'PPpp')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Duration:</strong> {formatDuration(selectedRecording.duration)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Language:</strong> {selectedRecording.language}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong>{' '}
                <Chip
                  label={selectedRecording.status}
                  color={getStatusColor(selectedRecording.status) as any}
                  size="small"
                />
              </Typography>
              {selectedRecording.sentiment && (
                <Typography variant="body1" gutterBottom>
                  <strong>Sentiment:</strong>{' '}
                  <Chip
                    label={selectedRecording.sentiment}
                    color={getSentimentColor(selectedRecording.sentiment) as any}
                    size="small"
                  />
                </Typography>
              )}
              {selectedRecording.transcription && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Transcription:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2">
                      {selectedRecording.transcription}
                    </Typography>
                  </Paper>
                </Box>
              )}
              {playingId === selectedRecording.id && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Playing audio...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedRecording?.status === 'completed' && (
            <>
              <Button
                startIcon={playingId === selectedRecording.id ? <PauseIcon /> : <PlayIcon />}
                onClick={() => handlePlay(selectedRecording.id)}
              >
                {playingId === selectedRecording.id ? 'Pause' : 'Play'}
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(selectedRecording)}
              >
                Download
              </Button>
            </>
          )}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallRecordings;