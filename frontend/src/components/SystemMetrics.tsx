import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  component: string;
}

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock system metrics
    const mockMetrics: SystemMetric[] = [
      {
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'good',
        trend: 'stable',
      },
      {
        name: 'Memory Usage',
        value: 72,
        unit: '%',
        status: 'warning',
        trend: 'up',
      },
      {
        name: 'Disk Usage',
        value: 38,
        unit: '%',
        status: 'good',
        trend: 'stable',
      },
      {
        name: 'Network I/O',
        value: 156,
        unit: 'MB/s',
        status: 'good',
        trend: 'down',
      },
      {
        name: 'Active Connections',
        value: 23,
        unit: 'connections',
        status: 'good',
        trend: 'stable',
      },
      {
        name: 'Response Time',
        value: 1.8,
        unit: 'seconds',
        status: 'good',
        trend: 'down',
      },
    ];

    // Mock performance data
    const mockPerformanceData = [
      { time: '00:00', cpu: 30, memory: 60, requests: 45 },
      { time: '04:00', cpu: 25, memory: 58, requests: 32 },
      { time: '08:00', cpu: 45, memory: 65, requests: 78 },
      { time: '12:00', cpu: 55, memory: 72, requests: 95 },
      { time: '16:00', cpu: 48, memory: 70, requests: 82 },
      { time: '20:00', cpu: 35, memory: 62, requests: 58 },
    ];

    // Mock log entries
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date('2024-01-15T14:30:00'),
        level: 'info',
        message: 'Voice agent session started successfully',
        component: 'VoiceAgent',
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T14:28:00'),
        level: 'warning',
        message: 'High memory usage detected: 85%',
        component: 'SystemMonitor',
      },
      {
        id: '3',
        timestamp: new Date('2024-01-15T14:25:00'),
        level: 'error',
        message: 'Failed to connect to STT service',
        component: 'STTService',
      },
      {
        id: '4',
        timestamp: new Date('2024-01-15T14:20:00'),
        level: 'info',
        message: 'Model configuration updated: llama3-70b-8192',
        component: 'ModelManager',
      },
      {
        id: '5',
        timestamp: new Date('2024-01-15T14:15:00'),
        level: 'info',
        message: 'Call recording saved successfully',
        component: 'RecordingService',
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setPerformanceData(mockPerformanceData);
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const refreshMetrics = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          System Metrics
        </Typography>
        <IconButton onClick={refreshMetrics} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* System Health Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.name}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {metric.name}
                </Typography>
                <Typography variant="h4" component="div">
                  {metric.value}
                  <Typography variant="h6" component="span" color="textSecondary">
                    {metric.unit}
                  </Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Chip
                    label={metric.status}
                    color={getStatusColor(metric.status) as any}
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary">
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </Typography>
                </Box>
                {metric.name.includes('Usage') && (
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    color={getStatusColor(metric.status) as any}
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              System Performance (24h)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="CPU %"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Memory %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Request Volume
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#ff7300"
                  strokeWidth={2}
                  name="Requests/hour"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* System Logs */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent System Logs
        </Typography>
        <List>
          {logs.map((log) => (
            <Accordion key={log.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getLogIcon(log.level)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          {log.message}
                        </Typography>
                        <Chip
                          label={log.level}
                          color={getLogColor(log.level) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {log.component}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {log.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity={log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'info'}>
                  <Typography variant="body2">
                    <strong>Component:</strong> {log.component}<br />
                    <strong>Timestamp:</strong> {log.timestamp.toISOString()}<br />
                    <strong>Message:</strong> {log.message}
                  </Typography>
                </Alert>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SystemMetrics;