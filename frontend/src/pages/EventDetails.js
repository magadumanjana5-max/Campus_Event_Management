import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEv(data);
      if (user?.role === 'student') {
        await checkRegistered();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistered = async () => {
    if (user?.role !== 'student') return;
    try {
      const { data } = await API.get('/registrations/my');
      const found = data.find(r => r.event && r.event._id === id);
      if (found) {
        setRegistered(true);
        setRegistrationStatus(found.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const register = async () => {
    if (registered) return;
    try {
      await API.post(`/registrations/events/${id}/register`);
      alert('Registration submitted! Please wait for admin approval.');
      setRegistered(true);
      setRegistrationStatus('pending');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading event details...</p>
      </div>
    );
  }

  if (!ev) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          <strong>Event not found</strong>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/events')}>
          <i className="bi bi-arrow-left me-2"></i>Back to Events
        </button>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tech': '#6366f1',
      'Sports': '#ec4899',
      'Cultural': '#06b6d4',
      'Academic': '#10b981',
      'Social': '#f59e0b',
      'Workshop': '#ef4444'
    };
    return colors[category] || '#6366f1';
  };

  return (
    <div className="container">
      <button className="btn btn-outline-primary mb-4" onClick={() => navigate('/events')}>
        <i className="bi bi-arrow-left me-2"></i>Back to Events
      </button>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header p-4" style={{ 
              background: `linear-gradient(135deg, ${getCategoryColor(ev.category)} 0%, ${getCategoryColor(ev.category)}dd 100%)`
            }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-light text-dark mb-2">
                    {ev.category || 'Event'}
                  </span>
                  <h1 className="text-white mb-0">{ev.title}</h1>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-file-text me-2"></i>About This Event
                </h5>
                <p className="text-muted lead">{ev.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="detail-box p-3 bg-light rounded-3 border-start-primary">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-calendar3 me-2"></i>Date
                    </small>
                    <p className="h6 mb-0">{formatDate(ev.date)}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-box p-3 bg-light rounded-3 border-start-primary">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-clock me-2"></i>Time
                    </small>
                    <p className="h6 mb-0">{ev.startTime} - {ev.endTime}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-box p-3 bg-light rounded-3 border-start-primary">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-geo-alt me-2"></i>Location
                    </small>
                    <p className="h6 mb-0">{ev.location || 'To be announced'}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-box p-3 bg-light rounded-3 border-start-primary">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-people me-2"></i>Capacity
                    </small>
                    <p className="h6 mb-0">{ev.capacity} Students</p>
                  </div>
                </div>
              </div>

              {/* Organized By */}
              {ev.createdBy && (
                <div className="mt-4 pt-4 border-top">
                  <p className="text-muted mb-2">
                    <i className="bi bi-person-check me-2"></i>Organized by
                  </p>
                  <p className="h6">
                    {ev.createdBy.name}
                    <br />
                    <small className="text-muted">{ev.createdBy.email}</small>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Registration */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg position-sticky" style={{ top: '100px' }}>
            <div className="card-body p-4">
              <h5 className="card-title mb-3">
                <i className="bi bi-clipboard-check me-2"></i>Registration
              </h5>

              {/* Registration Status */}
              {registered && (
                <div className={`alert alert-${registrationStatus === 'approved' ? 'success' : registrationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                  <i className={`bi bi-${registrationStatus === 'approved' ? 'check-circle' : registrationStatus === 'rejected' ? 'x-circle' : 'clock'} me-2`}></i>
                  <strong>Status: </strong>
                  <span className="text-capitalize">{registrationStatus}</span>
                </div>
              )}

              {!user ? (
                <p className="text-muted mb-3">Sign in to register for this event</p>
              ) : user?.role === 'student' ? (
                <>
                  {registered ? (
                    <div className="alert alert-info mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      You have already registered for this event.
                    </div>
                  ) : (
                    <p className="text-muted mb-3">Ready to join? Click the button below to register!</p>
                  )}
                </>
              ) : (
                <p className="text-muted mb-3">Only students can register for events</p>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                {!user ? (
                  <a href="/login" className="btn btn-primary btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login to Register
                  </a>
                ) : user?.role === 'student' ? (
                  <button 
                    className={`btn btn-lg ${registered ? 'btn-secondary' : 'btn-success'}`}
                    onClick={register}
                    disabled={registered}
                  >
                    <i className={`bi bi-${registered ? 'check-circle' : 'plus-circle'} me-2`}></i>
                    {registered ? 'Already Registered' : 'Register Now'}
                  </button>
                ) : null}
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-top">
                <p className="small text-muted mb-0">
                  <i className="bi bi-lightbulb me-2"></i>
                  {registrationStatus === 'pending' && 'Your registration is pending admin approval. You will be notified once approved.'}
                  {registrationStatus === 'approved' && 'Your registration is confirmed! See you at the event.'}
                  {registrationStatus === 'rejected' && 'Unfortunately, your registration was not approved.'}
                  {!registered && 'Register now to secure your spot!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
