import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);
      
      // Setup axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      if (response.data.role === 'ROLE_ADMIN') navigate('/admin');
      else if (response.data.role === 'ROLE_WORKER') navigate('/worker');
      else navigate('/user');
      
      // refresh to load components
      window.location.reload();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 70px)', 
      padding: '2rem',
      background: 'var(--bg-color)' 
    }}>
      
      {/* Centered Form Section */}
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '3rem', 
        border: '1px solid var(--pink-light)', 
        boxShadow: '0 15px 35px rgba(248, 200, 220, 0.4)',
        borderRadius: '24px',
        backgroundColor: 'white'
      }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>Login</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Access your Apheresis account</p>
        
        {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={{ paddingLeft: '45px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', fontSize: '1.1rem', background: 'white' }}
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ paddingLeft: '45px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', fontSize: '1.1rem', background: 'white' }}
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
      
    </div>
  );
};

export default Login;
