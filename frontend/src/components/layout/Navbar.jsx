import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="nav-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <img src={require('../../assets/apheresis_logo.jpeg')} alt="Apheresis Logo" style={{height: '40px', width: '40px', borderRadius: '50%'}} />
        <span>Apheresis</span>
      </div>
      
      {!auth ? (
        <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Home</span>
          <span style={{cursor: 'pointer'}} onClick={() => navigate('/activity')}>Activity</span>
          <span style={{cursor: 'pointer'}} onClick={() => navigate('/contact')}>Contact/Join Us</span>
          <span style={{cursor: 'pointer'}} onClick={() => navigate('/team')}>About Team</span>
          <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>Welcome, <strong style={{ color: 'var(--primary)' }}>{username}</strong></span>
          <button className="btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
