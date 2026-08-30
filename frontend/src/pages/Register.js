import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('student');
  const [error,setError]=useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const submit = async (e)=>{ e.preventDefault(); setError(''); try{ const user = await signUp({ name,email,password, role }); navigate(user.role === 'admin' ? '/admin/events' : '/events'); }catch(err){ setError(err.response?.data?.message || 'Register failed'); } };
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3"><label>Name</label><input className="form-control" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="mb-3"><label>Email</label><input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="mb-3"><label>Password</label><input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <div className="mb-3">
            <label>Role</label>
            <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin (requires admin token)</option>
            </select>
            <small className="form-text text-muted">Admin accounts can only be created by an authenticated admin. Otherwise, this signup creates a student account.</small>
          </div>
          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}
