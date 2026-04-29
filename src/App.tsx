import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopBar } from './components/Navigation/TopBar';
import { BottomNav } from './components/Navigation/BottomNav';
import { useState, useEffect } from 'react';

// Lazy load pages for performance
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Chat from './pages/Chat/Chat';
import ApiDocs from './pages/Docs/ApiDocs';
import ApiTester from './pages/Tester/ApiTester';
import Profile from './pages/Profile/Profile';
import Devices from './pages/Devices/Devices';
import BulkMessaging from './pages/Bulk/BulkMessaging';
import History from './pages/Profile/History';
import Webhooks from './pages/Webhooks/Webhooks';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('apiKey'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('apiKey'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <div className="min-h-screen pb-20">
        <TopBar />
        <main className="p-4 max-w-7xl mx-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <div className="bg-[#030712] min-h-screen text-slate-100 bg-grid">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/docs" element={<ProtectedRoute><ApiDocs /></ProtectedRoute>} />
          <Route path="/tester" element={<ProtectedRoute><ApiTester /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
          <Route path="/bulk" element={<ProtectedRoute><BulkMessaging /></ProtectedRoute>} />
          <Route path="/webhooks" element={<ProtectedRoute><Webhooks /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
