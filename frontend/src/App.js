import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrations from './pages/AdminRegistrations';
import EditEvent from './pages/EditEvent';
import AdminEvents from './pages/AdminEvents';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <div style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '3rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/events" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/my-registrations" element={<ProtectedRoute roles={['student']}><MyRegistrations /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/events/:id/registrations" element={<ProtectedRoute roles={['admin']}><AdminRegistrations /></ProtectedRoute>} />
            <Route path="/admin/events/:id/edit" element={<ProtectedRoute roles={['admin']}><EditEvent /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute roles={['admin']}><AdminEvents /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
