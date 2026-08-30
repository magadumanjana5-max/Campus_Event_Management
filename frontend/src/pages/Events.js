import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Events(){
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/events');
      setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      if (user?.role === 'student') {
        await loadRegistrations();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    try {
      const { data } = await API.get('/registrations/my');
      const ids = new Set(
        data
          .filter(r => ['approved', 'pending'].includes(r.status) && r.event)
          .map(r => r.event._id)
      );
      setRegisteredIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.get('/events', { params: { q, category: category || undefined } });
      setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      console.error(err);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const registerEvent = async (eventId) => {
    if (!user) return alert('Please login as a student to register');
    try {
      await API.post(`/registrations/events/${eventId}/register`);
      alert('Registration submitted! Awaiting admin approval.');
      await loadRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container-fluid">
      <div className="mb-5">
        <h1 className="section-title mb-4">
          <i className="bi bi-calendar-event me-2"></i>Discover Events
        </h1>

        {/* Search Bar */}
        <form onSubmit={search} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group input-group-lg">
                <span className="input-group-text border-0 bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  className="form-control form-control-lg border-0" 
                  placeholder="Search events by name..." 
                  value={q} 
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select form-select-lg border-0"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Tech">Tech</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Academic">Academic</option>
                <option value="Social">Social</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary btn-lg w-100">
                <i className="bi bi-search me-2"></i>Search
              </button>
            </div>
          </div>
        </form>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <i className="bi bi-info-circle me-2"></i>
            <strong>No events found</strong>. Try adjusting your search filters.
          </div>
        ) : (
          <div className="row g-4">
            {events.map(ev => (
              <div className="col-lg-4 col-md-6" key={ev._id}>
                <div className="card event-card h-100 fade-in">
                  {/* Category Badge */}
                  <div className="p-3">
                    <span 
                      className={`event-category category-${ev.category?.toLowerCase()}`}
                    >
                      {ev.category || 'Event'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body pt-0">
                    <h5 className="card-title">{ev.title}</h5>
                    
                    <p className="card-text text-muted line-clamp">{ev.description}</p>

                    {/* Event Details */}
                    <div className="event-details">
                      <div className="event-time">
                        <i className="bi bi-calendar3"></i>
                        <span>{formatDate(ev.date)}</span>
                      </div>
                      
                      <div className="event-time">
                        <i className="bi bi-clock"></i>
                        <span>{ev.startTime} - {ev.endTime}</span>
                      </div>

                      {ev.location && (
                        <div className="event-location">
                          <i className="bi bi-geo-alt"></i>
                          <span>{ev.location}</span>
                        </div>
                      )}

                      <div className="event-capacity">
                        <i className="bi bi-people"></i>
                        <span>Capacity: {ev.capacity} students</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-footer bg-white border-0 p-3">
                    <div className="event-actions">
                      <Link 
                        to={`/events/${ev._id}`} 
                        className="btn btn-sm btn-info flex-grow-1"
                      >
                        <i className="bi bi-eye me-1"></i>Details
                      </Link>
                      
                      {!user && (
                        <Link 
                          to="/login" 
                          className="btn btn-sm btn-primary flex-grow-1"
                        >
                          <i className="bi bi-box-arrow-in-right me-1"></i>Register
                        </Link>
                      )}
                      
                      {user?.role === 'student' && (
                        registeredIds.has(ev._id) ? (
                          <button className="btn btn-sm btn-secondary flex-grow-1" disabled>
                            <i className="bi bi-check-circle me-1"></i>Registered
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-success flex-grow-1" 
                            onClick={() => registerEvent(ev._id)}
                          >
                            <i className="bi bi-plus-circle me-1"></i>Register
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
