import React, { useState } from 'react';
import API from '../services/api';

export default function BulkActions({ events, onComplete }) {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSelect = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(e => e._id));
    }
  };

  const handleBulkAction = async () => {
    if (!action || selectedEvents.length === 0) {
      alert('Please select action and events');
      return;
    }

    if (!window.confirm(`Are you sure? This will ${action} ${selectedEvents.length} event(s)`)) {
      return;
    }

    setLoading(true);
    try {
      if (action === 'delete') {
        for (const eventId of selectedEvents) {
          await API.delete(`/events/${eventId}`);
        }
        alert(`Successfully deleted ${selectedEvents.length} event(s)`);
      }
      setSelectedEvents([]);
      setAction('');
      onComplete();
    } catch (err) {
      alert('Error performing bulk action: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
        <h5 className="text-white mb-0">
          <i className="bi bi-lightning-charge me-2"></i>Bulk Actions
        </h5>
      </div>

      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* Select All */}
          <div className="col-auto">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox"
                id="selectAll"
                checked={selectedEvents.length === events.length && events.length > 0}
                onChange={selectAll}
                style={{ cursor: 'pointer', width: '1.5rem', height: '1.5rem' }}
              />
              <label className="form-check-label" htmlFor="selectAll" style={{ cursor: 'pointer' }}>
                <strong>Select All ({selectedEvents.length}/{events.length})</strong>
              </label>
            </div>
          </div>

          {/* Action Selection */}
          <div className="col-md-3">
            <label className="form-label">
              <i className="bi bi-gear me-1"></i>Action
            </label>
            <select 
              className="form-select"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={selectedEvents.length === 0}
            >
              <option value="">Select Action</option>
              <option value="delete">Delete Events</option>
            </select>
          </div>

          {/* Execute Button */}
          <div className="col-auto">
            <button 
              className="btn btn-danger btn-lg"
              onClick={handleBulkAction}
              disabled={selectedEvents.length === 0 || !action || loading}
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {loading ? 'Processing...' : 'Execute'}
            </button>
          </div>

          {/* Status */}
          {selectedEvents.length > 0 && (
            <div className="col-12">
              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <strong>{selectedEvents.length}</strong> event(s) selected
              </div>
            </div>
          )}
        </div>

        {/* Selected Events List */}
        {selectedEvents.length > 0 && (
          <div className="mt-4 p-3 bg-light rounded-3">
            <h6 className="mb-3">
              <i className="bi bi-check-circle-fill me-2" style={{ color: '#10b981' }}></i>
              Selected Events
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {events
                .filter(e => selectedEvents.includes(e._id))
                .map(event => (
                  <div key={event._id} className="badge bg-primary p-2">
                    <i className="bi bi-calendar-event me-1"></i>
                    {event.title}
                    <button 
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => toggleSelect(event._id)}
                    ></button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
