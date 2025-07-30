import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Tab,
  Tabs,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ModelManagement from '../components/ModelManagement';
import CallRecordings from '../components/CallRecordings';
import SystemMetrics from '../components/SystemMetrics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalCalls: 0,
    activeSessions: 0,
    avgResponseTime: 0,
    successRate: 0,
  });

  // Mock data for charts
  const callVolumeData = [
    { name: 'Mon', calls: 45, duration: 120 },
    { name: 'Tue', calls: 52, duration: 135 },
    { name: 'Wed', calls: 38, duration: 98 },
    { name: 'Thu', calls: 61, duration: 156 },
    { name: 'Fri', calls: 55, duration: 142 },
    { name: 'Sat', calls: 28, duration: 78 },
    { name: 'Sun', calls: 33, duration: 89 },
  ];

  const responseTimeData = [
    { name: '00:00', time: 1.2 },
    { name: '04:00', time: 0.8 },
    { name: '08:00', time: 2.1 },
    { name: '12:00', time: 3.2 },
    { name: '16:00', time: 2.8 },
    { name: '20:00', time: 1.9 },
  ];

  const languageDistribution = [
    { name: 'English', value: 65, color: '#8884d8' },
    { name: 'Hindi', value: 20, color: '#82ca9d' },
    { name: 'Bengali', value: 10, color: '#ffc658' },
    { name: 'Others', value: 5, color: '#ff7300' },
  ];

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      // This would be replaced with actual API calls
      setDashboardData({
        totalCalls: 1247,
        activeSessions: 12,
        avgResponseTime: 1.8,
        successRate: 94.2,
      });
    };

    fetchDashboardData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Calls
              </Typography>
              <Typography variant="h4" component="div">
                {dashboardData.totalCalls.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Sessions
              </Typography>
              <Typography variant="h4" component="div">
                {dashboardData.activeSessions}
              </Typography>
              <Chip label="Live" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Response Time
              </Typography>
              <Typography variant="h4" component="div">
                {dashboardData.avgResponseTime}s
              </Typography>
              <Typography variant="body2" color="success.main">
                -0.3s from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" component="div">
                {dashboardData.successRate}%
              </Typography>
              <Typography variant="body2" color="success.main">
                +2.1% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Analytics" />
            <Tab label="Call Recordings" />
            <Tab label="Model Management" />
            <Tab label="System Metrics" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Analytics Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Call Volume & Duration
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" fill="#8884d8" name="Number of Calls" />
                    <Bar dataKey="duration" fill="#82ca9d" name="Total Duration (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Language Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={languageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Response Time Trends
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Response Time (seconds)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CallRecordings />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ModelManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SystemMetrics />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;