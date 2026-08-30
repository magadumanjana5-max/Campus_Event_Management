import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickActions({ stats }) {
  return (
    <div className="row g-3 mb-4">
      {/* Create Event Card */}
      <div className="col-md-6 col-lg-3">
        <div className="card border-0 shadow-lg h-100 bg-gradient-primary" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}>
          <div className="card-body text-center text-white">
            <i className="bi bi-plus-circle" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
            <h6 className="mb-2">Create Event</h6>
            <p className="small mb-3">Add new event to calendar</p>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-right me-1"></i>Create
            </button>
          </div>
        </div>
      </div>

      {/* View Registrations Card */}
      <div className="col-md-6 col-lg-3">
        <div className="card border-0 shadow-lg h-100 bg-gradient-secondary" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' }}>
          <div className="card-body text-center text-white">
            <i className="bi bi-people-fill" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
            <h6 className="mb-2">Registrations</h6>
            <p className="small mb-3">{stats?.totalPending || 0} pending approvals</p>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-right me-1"></i>Review
            </button>
          </div>
        </div>
      </div>

      {/* Event Stats Card */}
      <div className="col-md-6 col-lg-3">
        <div className="card border-0 shadow-lg h-100 bg-gradient-accent" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' }}>
          <div className="card-body text-center text-white">
            <i className="bi bi-graph-up-arrow" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
            <h6 className="mb-2">Statistics</h6>
            <p className="small mb-3">{stats?.totalEvents || 0} total events</p>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-right me-1"></i>View
            </button>
          </div>
        </div>
      </div>

      {/* Export Data Card */}
      <div className="col-md-6 col-lg-3">
        <div className="card border-0 shadow-lg h-100 bg-gradient-success" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
          <div className="card-body text-center text-white">
            <i className="bi bi-download" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
            <h6 className="mb-2">Export</h6>
            <p className="small mb-3">Download event data</p>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-right me-1"></i>Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
