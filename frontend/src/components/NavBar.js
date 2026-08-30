import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const name = user?.name;
  
  const logout = () => { 
    signOut(); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-calendar-event me-2" style={{ fontSize: '1.8rem' }}></i>
          <span>CampusEvents</span>
        </Link>
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setExpanded(!expanded)}
          aria-controls="navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/events" onClick={() => setExpanded(false)}>
                <i className="bi bi-calendar-check me-1"></i> Events
              </Link>
            </li>
            
            {user?.role === 'student' && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-registrations" onClick={() => setExpanded(false)}>
                  <i className="bi bi-bookmark-check me-1"></i> My Registrations
                </Link>
              </li>
            )}
            
            {user?.role === 'admin' && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-speedometer2 me-1"></i> Admin
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item" to="/admin/events" onClick={() => setExpanded(false)}>
                      <i className="bi bi-pencil-square me-2"></i> Manage Events
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/register" onClick={() => setExpanded(false)}>
                      <i className="bi bi-person-plus me-2"></i> Add User
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setExpanded(false)}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setExpanded(false)}>
                    <i className="bi bi-person-plus me-1"></i> Register
                  </Link>
                </li>
              </>
            )}
            
            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i> {name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><span className="dropdown-item-text small">Role: <strong>{user?.role}</strong></span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
