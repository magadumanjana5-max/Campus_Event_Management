import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function EventStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await API.get('/events/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const totalRegistrations = stats?.reduce((sum, s) => sum + s.registrations, 0) || 0;
  const avgRegistrations = stats?.length > 0 ? Math.round(totalRegistrations / stats.length) : 0;
  const topEvent = stats?.length > 0 ? stats.reduce((max, s) => s.registrations > max.registrations ? s : max) : null;

  return (
    <div className="row g-3 mb-4">
      {/* Total Registrations */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <div className="mb-3">
              <i className="bi bi-check-circle-fill" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
            </div>
            <h6 className="text-muted mb-1">Total Registrations</h6>
            <h3 className="mb-0 text-success">{totalRegistrations}</h3>
            <small className="text-muted">Approved registrations</small>
          </div>
        </div>
      </div>

      {/* Average Registrations */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <div className="mb-3">
              <i className="bi bi-graph-up" style={{ fontSize: '2.5rem', color: '#3b82f6' }}></i>
            </div>
            <h6 className="text-muted mb-1">Average per Event</h6>
            <h3 className="mb-0 text-info">{avgRegistrations}</h3>
            <small className="text-muted">Registrations/event</small>
          </div>
        </div>
      </div>

      {/* Most Popular Event */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <div className="mb-3">
              <i className="bi bi-star-fill" style={{ fontSize: '2.5rem', color: '#f59e0b' }}></i>
            </div>
            <h6 className="text-muted mb-1">Most Popular</h6>
            <h3 className="mb-0 text-warning">{topEvent?.registrations || 0}</h3>
            <small className="text-muted">{topEvent?.title || 'N/A'}</small>
          </div>
        </div>
      </div>

      {/* Events Count */}
      <div className="col-lg-3 col-md-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <div className="mb-3">
              <i className="bi bi-calendar-event" style={{ fontSize: '2.5rem', color: '#ec4899' }}></i>
            </div>
            <h6 className="text-muted mb-1">Total Events</h6>
            <h3 className="mb-0 text-secondary">{stats?.length || 0}</h3>
            <small className="text-muted">Events created</small>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      {stats && stats.length > 0 && (
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="mb-0">
                <i className="bi bi-table me-2"></i>Event Registration Breakdown
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th><i className="bi bi-hash me-2"></i>#</th>
                      <th><i className="bi bi-calendar-event me-2"></i>Event</th>
                      <th><i className="bi bi-people me-2"></i>Registrations</th>
                      <th><i className="bi bi-percent me-2"></i>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat, index) => (
                      <tr key={stat.eventId}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{stat.title}</strong>
                        </td>
                        <td>
                          <span className="badge bg-success">{stat.registrations}</span>
                        </td>
                        <td>
                          <div className="progress" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar"
                              style={{ width: `${(stat.registrations / totalRegistrations) * 100}%` }}
                            >
                              {Math.round((stat.registrations / totalRegistrations) * 100)}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
