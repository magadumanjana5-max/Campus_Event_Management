import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function MyRegistrations(){
  const [regs, setRegs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await API.get('/registrations/my');
      setRegs(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load registrations');
    }
  };

  const cancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setLoading(true);
    try {
      await API.delete(`/registrations/${id}`);
      alert('Registration cancelled');
      load();
    } catch (err) {
      alert('Failed to cancel registration');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRegs = () => {
    if (filter === 'all') return regs;
    return regs.filter(r => r.status === filter);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger',
      'cancelled': 'secondary'
    };
    return colors[status] || 'primary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': 'clock',
      'approved': 'check-circle',
      'rejected': 'x-circle',
      'cancelled': 'dash-circle'
    };
    return icons[status] || 'info-circle';
  };

  const stats = {
    total: regs.length,
    pending: regs.filter(r => r.status === 'pending').length,
    approved: regs.filter(r => r.status === 'approved').length,
    rejected: regs.filter(r => r.status === 'rejected').length
  };

  const filteredRegs = getFilteredRegs();

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-5">
        <h1 className="section-title mb-3">
          <i className="bi bi-bookmark-check me-2"></i>My Registrations
        </h1>
        <p className="text-muted lead">Track your event registrations and their status</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div 
            className={`card border-0 shadow-sm cursor-pointer ${filter === 'all' ? 'border-primary border-2' : ''}`}
            onClick={() => setFilter('all')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body text-center">
              <h6 className="text-muted mb-1">Total</h6>
              <h3 className="mb-0">{stats.total}</h3>
              <small className="text-muted">Registrations</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div 
            className={`card border-0 shadow-sm cursor-pointer ${filter === 'pending' ? 'border-warning border-2' : ''}`}
            onClick={() => setFilter('pending')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body text-center">
              <h6 className="text-warning mb-1">Pending</h6>
              <h3 className="mb-0 text-warning">{stats.pending}</h3>
              <small className="text-muted">Awaiting Approval</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div 
            className={`card border-0 shadow-sm cursor-pointer ${filter === 'approved' ? 'border-success border-2' : ''}`}
            onClick={() => setFilter('approved')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body text-center">
              <h6 className="text-success mb-1">Approved</h6>
              <h3 className="mb-0 text-success">{stats.approved}</h3>
              <small className="text-muted">Confirmed</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div 
            className={`card border-0 shadow-sm cursor-pointer ${filter === 'rejected' ? 'border-danger border-2' : ''}`}
            onClick={() => setFilter('rejected')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body text-center">
              <h6 className="text-danger mb-1">Rejected</h6>
              <h3 className="mb-0 text-danger">{stats.rejected}</h3>
              <small className="text-muted">Not Approved</small>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="card border-0 shadow-lg">
        <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
          <h5 className="text-white mb-0">
            <i className="bi bi-list-check me-2"></i>
            Event Registrations {filter !== 'all' && `- ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            <span className="ms-2 badge bg-light text-dark">{filteredRegs.length}</span>
          </h5>
        </div>

        <div className="card-body p-0">
          {filteredRegs.length === 0 ? (
            <div className="p-5 text-center">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5, color: '#d1d5db' }}></i>
              <p className="mb-2 text-muted">No registrations found</p>
              <Link to="/events" className="btn btn-primary">
                <i className="bi bi-search me-2"></i>Browse Events
              </Link>
            </div>
          ) : (
            <div className="row g-3 p-4">
              {filteredRegs.map(reg => (
                <div className="col-lg-6" key={reg._id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      {/* Status Badge */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{reg.event?.title || 'Event'}</h5>
                        <span className={`badge bg-${getStatusBadgeColor(reg.status)}`}>
                          <i className={`bi bi-${getStatusIcon(reg.status)} me-1`}></i>
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </span>
                      </div>

                      {/* Event Details */}
                      {reg.event && (
                        <div className="mb-3">
                          <div className="detail-info mb-2">
                            <small className="text-muted">
                              <i className="bi bi-calendar3 me-2"></i>{formatDate(reg.event.date)}
                            </small>
                          </div>
                          <div className="detail-info mb-2">
                            <small className="text-muted">
                              <i className="bi bi-clock me-2"></i>{reg.event.startTime} - {reg.event.endTime}
                            </small>
                          </div>
                          {reg.event.location && (
                            <div className="detail-info">
                              <small className="text-muted">
                                <i className="bi bi-geo-alt me-2"></i>{reg.event.location}
                              </small>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Registration Info */}
                      <div className="border-top pt-3 mb-3">
                        <small className="text-muted d-block">
                          Registered: {formatDateTime(reg.createdAt)}
                        </small>
                        {reg.rejectionReason && (
                          <div className="alert alert-warning alert-sm mt-2 mb-0" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            <strong>Reason:</strong> {reg.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Status Message */}
                      {reg.status === 'pending' && (
                        <div className="alert alert-warning alert-sm mb-3">
                          <i className="bi bi-info-circle me-1"></i>
                          Waiting for admin approval...
                        </div>
                      )}
                      {reg.status === 'approved' && (
                        <div className="alert alert-success alert-sm mb-3">
                          <i className="bi bi-check-circle me-1"></i>
                          You're confirmed! See you at the event.
                        </div>
                      )}

                      {/* Actions */}
                      {reg.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-danger w-100"
                          onClick={() => cancel(reg._id)}
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-2"></i>Cancel Registration
                        </button>
                      )}
                      {reg.status === 'cancelled' && (
                        <button className="btn btn-sm btn-secondary w-100" disabled>
                          <i className="bi bi-dash-circle me-2"></i>Cancelled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
