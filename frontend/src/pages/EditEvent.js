import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function EditEvent(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    startTime: '09:00',
    endTime: '17:00',
    location: '', 
    capacity: 0,
    category: 'Academic'
  });

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setForm({ 
        title: data.title || '', 
        description: data.description || '', 
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '', 
        startTime: data.startTime || '09:00',
        endTime: data.endTime || '17:00',
        location: data.location || '', 
        capacity: data.capacity || 0,
        category: data.category || 'Academic'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load event');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await API.put(`/events/${id}`, form);
      alert('Event updated successfully!');
      navigate('/admin/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-gradient-primary" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
              <h5 className="text-white mb-0">
                <i className="bi bi-pencil me-2"></i>Edit Event
              </h5>
            </div>

            <form onSubmit={submit} className="card-body p-4">
              <div className="form-group mb-3">
                <label className="form-label">Event Title *</label>
                <input 
                  className="form-control" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Date *</label>
                <input 
                  className="form-control" 
                  type="date"
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Start Time</label>
                  <input 
                    className="form-control" 
                    type="time"
                    value={form.startTime} 
                    onChange={e => setForm({...form, startTime: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Time</label>
                  <input 
                    className="form-control" 
                    type="time"
                    value={form.endTime} 
                    onChange={e => setForm({...form, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Category</label>
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
                <label className="form-label">Location</label>
                <input 
                  className="form-control" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Capacity</label>
                <input 
                  className="form-control" 
                  type="number"
                  value={form.capacity} 
                  onChange={e => setForm({...form, capacity: parseInt(e.target.value)})}
                  min="1"
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate('/admin/events')}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
