import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import Analytics from './pages/Analytics';
import Broadsheet from './pages/Broadsheet';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/classes/:classId/spreadsheet" element={<Spreadsheet />} />
                      <Route path="/classes/:classId/analytics" element={<Analytics />} />
                      <Route path="/classes/:classId/broadsheet" element={<Broadsheet />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
