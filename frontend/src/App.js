import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Chatbot from './components/chat/Chatbot';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import DonateBlood from './pages/user/DonateBlood';
import RequestBlood from './pages/user/RequestBlood';
import Home from './pages/public/Home';
import Activity from './pages/public/Activity';
import AboutTeam from './pages/public/AboutTeam';
import Contact from './pages/public/Contact';
import './App.css';

const getUserRole = () => localStorage.getItem('role');

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }
  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  // Use state so the app re-renders when auth changes (login/logout)
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Listen for storage events (when Navbar clears token on logout)
    const syncAuth = () => setAuth(!!localStorage.getItem('token'));

    window.addEventListener('storage', syncAuth);

    // Also poll every 500ms as a fallback (same-tab logout doesn't fire 'storage')
    const interval = setInterval(syncAuth, 500);

    return () => {
      window.removeEventListener('storage', syncAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar onLogout={() => setAuth(false)} />
        <div className="main-content">
          {auth && <Sidebar />}
          <div className="page-content">
            <Routes>
              <Route path="/login" element={!auth ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!auth ? <Register /> : <Navigate to="/dashboard" />} />
              
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/team" element={<AboutTeam />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/worker" element={
                <ProtectedRoute allowedRoles={['ROLE_WORKER']}>
                  <WorkerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/user" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/donate" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <DonateBlood />
                </ProtectedRoute>
              } />
              
              <Route path="/request" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <RequestBlood />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  {getUserRole() === 'ROLE_ADMIN' ? <Navigate to="/admin" /> :
                   getUserRole() === 'ROLE_WORKER' ? <Navigate to="/worker" /> :
                   <Navigate to="/user" />}
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;