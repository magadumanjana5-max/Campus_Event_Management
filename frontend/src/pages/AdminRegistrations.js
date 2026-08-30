import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AdminRegistrations(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectForm, setShowRejectForm] = useState({});

  useEffect(() => {
    if (id) {
      load();
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const load = async () => {
    try {
      const { data } = await API.get(`/registrations/events/${id}`);
      setRegs(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load registrations');
    }
  };

  const approve = async (regId) => {
    if (!window.confirm('Approve this registration?')) return;
    setLoading(true);
    try {
      await API.patch(`/registrations/${regId}/approve`);
      alert('Registration approved!');
      load();
    } catch (err) {
      alert('Failed to approve registration');
    } finally {
      setLoading(false);
    }
  };

  const reject = async (regId) => {
    const reason = rejectReason[regId] || 'No reason provided';
    if (!window.confirm('Reject this registration?')) return;
    setLoading(true);
    try {
      await API.patch(`/registrations/${regId}/reject`, { reason });
      alert('Registration rejected!');
      setShowRejectForm({ ...showRejectForm, [regId]: false });
      setRejectReason({ ...rejectReason, [regId]: '' });
      load();
    } catch (err) {
      alert('Failed to reject registration');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRegs = () => {
    if (filter === 'all') return regs;
    return regs.filter(r => r.status === filter);
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
      <div className="mb-4">
        <Link to="/admin/events" className="btn btn-outline-primary mb-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Events
        </Link>
        
        {event && (
          <div>
            <h1 className="section-title mb-2">
              <i className="bi bi-people me-2"></i>{event.title}
            </h1>
            <p className="text-muted">Manage registrations for this event</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className={`card border-0 shadow-sm cursor-pointer ${filter === 'all' ? 'border-primary border-2' : ''}`}
            onClick={() => setFilter('all')}
            style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h6 className="text-muted mb-1">Total</h6>
              <h3 className="mb-0">{stats.total}</h3>
              <small className="text-muted">Registrations</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className={`card border-0 shadow-sm cursor-pointer ${filter === 'pending' ? 'border-warning border-2' : ''}`}
            onClick={() => setFilter('pending')}
            style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h6 className="text-warning mb-1">Pending</h6>
              <h3 className="mb-0 text-warning">{stats.pending}</h3>
              <small className="text-muted">Awaiting Review</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className={`card border-0 shadow-sm cursor-pointer ${filter === 'approved' ? 'border-success border-2' : ''}`}
            onClick={() => setFilter('approved')}
            style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <h6 className="text-success mb-1">Approved</h6>
              <h3 className="mb-0 text-success">{stats.approved}</h3>
              <small className="text-muted">Confirmed</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className={`card border-0 shadow-sm cursor-pointer ${filter === 'rejected' ? 'border-danger border-2' : ''}`}
            onClick={() => setFilter('rejected')}
            style={{ cursor: 'pointer' }}>
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
            Registrations {filter !== 'all' && `- ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            <span className="ms-2 badge bg-light text-dark">{filteredRegs.length}</span>
          </h5>
        </div>

        <div className="card-body p-0">
          {filteredRegs.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p className="mb-0">No registrations found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Registered At</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.map((reg, index) => (
                    <React.Fragment key={reg._id}>
                      <tr>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">
                          <strong>{reg.user?.name || 'Unknown'}</strong>
                        </td>
                        <td className="align-middle text-muted">{reg.user?.email}</td>
                        <td className="align-middle">
                          <span className={`badge bg-${getStatusBadgeColor(reg.status)}`}>
                            <i className={`bi bi-${getStatusIcon(reg.status)} me-1`}></i>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                        <td className="align-middle text-muted small">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="align-middle text-end">
                          {reg.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-sm btn-success me-2"
                                onClick={() => approve(reg._id)}
                                disabled={loading}
                              >
                                <i className="bi bi-check-circle me-1"></i>Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => setShowRejectForm({ ...showRejectForm, [reg._id]: !showRejectForm[reg._id] })}
                              >
                                <i className="bi bi-x-circle me-1"></i>Reject
                              </button>
                            </>
                          )}
                          {reg.status === 'approved' && (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>Confirmed
                            </span>
                          )}
                          {reg.status === 'rejected' && (
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setShowRejectForm({ ...showRejectForm, [reg._id]: !showRejectForm[reg._id] })}
                            >
                              <i className="bi bi-info-circle me-1"></i>Details
                            </button>
                          )}
                        </td>
                      </tr>
                      
                      {/* Rejection Form */}
                      {showRejectForm[reg._id] && (
                        <tr className="table-light">
                          <td colSpan="6" className="p-4">
                            <div className="card border-warning">
                              <div className="card-body">
                                <h6 className="card-title mb-3">
                                  <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                                  {reg.status === 'rejected' ? 'Rejection Details' : 'Provide Rejection Reason'}
                                </h6>
                                
                                {reg.status === 'rejected' && reg.rejectionReason ? (
                                  <div className="alert alert-warning mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Reason:</strong> {reg.rejectionReason}
                                  </div>
                                ) : (
                                  <>
                                    <textarea 
                                      className="form-control mb-3"
                                      placeholder="Why is this registration being rejected?"
                                      value={rejectReason[reg._id] || ''}
                                      onChange={(e) => setRejectReason({ ...rejectReason, [reg._id]: e.target.value })}
                                      rows="3"
                                    />
                                    <button 
                                      className="btn btn-danger"
                                      onClick={() => reject(reg._id)}
                                      disabled={loading}
                                    >
                                      <i className="bi bi-check-circle me-1"></i>
                                      {loading ? 'Processing...' : 'Confirm Rejection'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
