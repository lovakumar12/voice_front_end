import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AdminDashboard from './pages/AdminDashboard';
import VoiceAgent from './pages/VoiceAgent';
import Layout from './components/Layout';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/voice-agent" element={<VoiceAgent />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;