import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import EventFilter from '../components/EventFilter';
import EventStats from '../components/EventStats';
import BulkActions from '../components/BulkActions';

export default function AdminDashboard(){
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    startTime: '09:00',
    endTime: '17:00',
    location: '', 
    capacity: 100,
    category: 'Academic'
  });

  useEffect(() => {
    load();
    loadStats();
  }, []);

  const load = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load events');
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await API.get('/events/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (filters) => {
    let filtered = events;

    if (filters.searchTerm) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(e => new Date(e.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(e => new Date(e.date) <= new Date(filters.dateTo));
    }

    if (filters.capacity) {
      filtered = filtered.filter(e => e.capacity >= parseInt(filters.capacity));
    }

    setFilteredEvents(filtered);
  };

  const handleReset = () => {
    setFilteredEvents(events);
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await API.post('/events', form);
      setForm({ 
        title: '', 
        description: '', 
        date: '', 
        startTime: '09:00',
        endTime: '17:00',
        location: '', 
        capacity: 100,
        category: 'Academic'
      });
      setShowForm(false);
      alert('Event created successfully!');
      load();
      loadStats();
    } catch (err) {
      alert('Failed to create event: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      alert('Event deleted successfully');
      load();
      loadStats();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const duplicateEvent = async (event) => {
    try {
      const newEvent = { ...event };
      delete newEvent._id;
      delete newEvent.createdAt;
      delete newEvent.updatedAt;
      newEvent.title = `${newEvent.title} (Copy)`;
      await API.post('/events', newEvent);
      alert('Event duplicated successfully!');
      load();
      loadStats();
    } catch (err) {
      alert('Failed to duplicate event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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

  const pendingRegistrations = stats.reduce((sum, s) => sum + s.registrations, 0);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-5">
        <h1 className="section-title mb-3">
          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
        </h1>
        <p className="text-muted lead">Complete event and registration management</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="stat-box">
            <h5><i className="bi bi-calendar-event me-2"></i>Total Events</h5>
            <div className="number">{events.length}</div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-box" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' }}>
            <h5><i className="bi bi-check-circle me-2"></i>Approved Registrations</h5>
            <div className="number">{pendingRegistrations}</div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-box" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' }}>
            <h5><i className="bi bi-arrow-up me-2"></i>Upcoming Events</h5>
            <div className="number">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-box" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
            <h5><i className="bi bi-people me-2"></i>Total Capacity</h5>
            <div className="number">{events.reduce((sum, e) => sum + e.capacity, 0)}</div>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <h3 className="subsection-title mb-4">
        <i className="bi bi-graph-up me-2"></i>Event Statistics
      </h3>
      <EventStats />

      {/* Advanced Filters */}
      <h3 className="subsection-title mb-4 mt-5">
        <i className="bi bi-funnel me-2"></i>Event Management
      </h3>
      <EventFilter onFilter={handleFilter} onReset={handleReset} />

      {/* Bulk Actions */}
      {events.length > 0 && (
        <BulkActions events={events} onComplete={() => { load(); loadStats(); }} />
      )}

      <div className="row g-4">
        {/* Create Event Section */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
              <h5 className="text-white mb-0">
                <i className="bi bi-plus-circle me-2"></i>Create New Event
              </h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary btn-lg w-100 mb-3"
                onClick={() => setShowForm(!showForm)}
              >
                <i className={`bi bi-${showForm ? 'x' : 'plus'} me-2`}></i>
                {showForm ? 'Cancel' : 'New Event'}
              </button>

              {showForm && (
                <form onSubmit={create}>
                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-type me-1"></i>Event Title *
                    </label>
                    <input 
                      className="form-control" 
                      placeholder="e.g., Tech Conference 2024"
                      value={form.title} 
                      onChange={e => setForm({...form, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-calendar me-1"></i>Date *
                    </label>
                    <input 
                      type="date"
                      className="form-control" 
                      value={form.date} 
                      onChange={e => setForm({...form, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label">
                        <i className="bi bi-play-circle me-1"></i>Start
                      </label>
                      <input 
                        type="time"
                        className="form-control" 
                        value={form.startTime} 
                        onChange={e => setForm({...form, startTime: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">
                        <i className="bi bi-stop-circle me-1"></i>End
                      </label>
                      <input 
                        type="time"
                        className="form-control" 
                        value={form.endTime} 
                        onChange={e => setForm({...form, endTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-tag me-1"></i>Category
                    </label>
                    <select 
                      className="form-select" 
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option value="Tech">Tech</option>
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Academic">Academic</option>
                      <option value="Social">Social</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-geo-alt me-1"></i>Location
                    </label>
                    <input 
                      className="form-control" 
                      placeholder="Event venue"
                      value={form.location} 
                      onChange={e => setForm({...form, location: e.target.value})}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-people me-1"></i>Capacity
                    </label>
                    <input 
                      type="number"
                      className="form-control" 
                      placeholder="Number of students"
                      value={form.capacity} 
                      onChange={e => setForm({...form, capacity: parseInt(e.target.value)})}
                      min="1"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-chat-left-text me-1"></i>Description
                    </label>
                    <textarea 
                      className="form-control" 
                      placeholder="Event description"
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})}
                      rows="3"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {loading ? 'Creating...' : 'Create Event'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
              <h5 className="text-white mb-0">
                <i className="bi bi-list-ul me-2"></i>All Events ({filteredEvents.length})
              </h5>
            </div>
            <div className="card-body p-0">
              {filteredEvents.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2">No events found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredEvents.map(ev => {
                    const registrationCount = stats.find(s => s.eventId === ev._id)?.registrations || 0;
                    const isUpcoming = new Date(ev.date) > new Date();
                    
                    return (
                      <div key={ev._id} className="list-group-item p-4 border-bottom">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <div className="d-flex align-items-start gap-3">
                              <div 
                                className="p-3 rounded-3 text-white"
                                style={{ background: getCategoryColor(ev.category), width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                              >
                                <i className="bi bi-calendar"></i>
                              </div>
                              <div>
                                <h6 className="mb-1">{ev.title}</h6>
                                <small className="text-muted">
                                  <i className="bi bi-calendar3 me-1"></i>{formatDate(ev.date)}
                                  <br/>
                                  <i className="bi bi-clock me-1"></i>{ev.startTime} - {ev.endTime}
                                  <br/>
                                  {ev.location && (
                                    <>
                                      <i className="bi bi-geo-alt me-1"></i>{ev.location}
                                    </>
                                  )}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 text-center">
                            <div className="bg-light p-2 rounded-2 mb-2">
                              <div className="h6 mb-0">{registrationCount}</div>
                              <small className="text-muted">Registrations</small>
                            </div>
                            <span className={`badge ${isUpcoming ? 'bg-success' : 'bg-secondary'}`}>
                              <i className={`bi bi-${isUpcoming ? 'arrow-up' : 'check'} me-1`}></i>
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </div>
                          <div className="col-md-4">
                            <div className="btn-group btn-group-sm w-100">
                              <Link 
                                to={`/admin/events/${ev._id}/registrations`} 
                                className="btn btn-info"
                                title="View registrations"
                              >
                                <i className="bi bi-people"></i>
                              </Link>
                              <Link 
                                to={`/admin/events/${ev._id}/edit`} 
                                className="btn btn-warning"
                                title="Edit event"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => duplicateEvent(ev)}
                                title="Duplicate event"
                              >
                                <i className="bi bi-files"></i>
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => remove(ev._id)}
                                title="Delete event"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
