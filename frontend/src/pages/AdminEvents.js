import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminEvents(){
  const [events,setEvents]=useState([]);
  const [form,setForm]=useState({ title:'', date:'', location:'', capacity:0, description:'' });
  const navigate = useNavigate();

  useEffect(()=>{ load(); },[]);
  const load = async ()=>{ try{ const { data } = await API.get('/events'); setEvents(data); }catch(err){ console.error(err); } };
  const create = async (e)=>{ e.preventDefault(); try{ await API.post('/events', { ...form, date: new Date(form.date).toISOString() }); setForm({ title:'', date:'', location:'', capacity:0, description:'' }); load(); }catch(err){ alert(err.response?.data?.message || 'Error'); } };
  const remove = async (id)=>{ if(!window.confirm('Delete event?')) return; try{ await API.delete(`/events/${id}`); load(); }catch(err){ alert('Error'); } };

  return (
    <div>
      <h3>Manage Events</h3>
      <div className="row">
        <div className="col-md-5">
          <h5>Create Event</h5>
          <form onSubmit={create}>
            <input className="form-control mb-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
            <input className="form-control mb-2" type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
            <input className="form-control mb-2" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
            <input className="form-control mb-2" placeholder="Capacity" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} />
            <textarea className="form-control mb-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <button className="btn btn-primary">Create</button>
          </form>
        </div>
        <div className="col-md-7">
          <h5>Events</h5>
          <table className="table">
            <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map(ev=> (
                <tr key={ev._id}>
                  <td>{ev.title}</td>
                  <td>{new Date(ev.date).toLocaleString()}</td>
                  <td>
                    <Link to={`/admin/events/${ev._id}/registrations`} className="btn btn-sm btn-info me-2">Regs</Link>
                    <Link to={`/admin/events/${ev._id}/edit`} className="btn btn-sm btn-secondary me-2">Edit</Link>
                    <button className="btn btn-sm btn-danger" onClick={()=>remove(ev._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
