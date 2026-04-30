import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'ROLE_USER',
    governmentId: '',
    isGovtOfficer: false,
    bloodGroup: 'A+',
    bmi: '',
    haemoglobin: '',
    medicalHistory: '',
    isEmergencyDonor: false,
    empId: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
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
        maxWidth: '650px', 
        padding: '3rem', 
        border: '1px solid var(--pink-light)', 
        boxShadow: '0 15px 35px rgba(248, 200, 220, 0.4)',
        borderRadius: '24px',
        backgroundColor: 'white',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>Join Apheresis</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Create an account to start saving lives</p>
        
        {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</div>}
        
        <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          
          {/* Basic Info */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ padding: '12px', fontSize: '1.05rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', outline: 'none', background: 'white' }}>
              <option value="ROLE_USER">Donor / Receiver</option>
              <option value="ROLE_WORKER">BloodBank Worker</option>
              <option value="ROLE_ADMIN">Administrator</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} placeholder="Your username" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} placeholder="contact@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} placeholder="Create a password" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ padding: '12px', fontSize: '1.05rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', outline: 'none', background: 'white' }}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* User/Donor Specific */}
          {formData.role === 'ROLE_USER' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>BMI</label>
                <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} placeholder="e.g. 22.5" style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Haemoglobin (g/dL)</label>
                <input type="number" step="0.1" name="haemoglobin" value={formData.haemoglobin} onChange={handleChange} placeholder="e.g. 13.5" style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Medical History</label>
                <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} placeholder="Any prior illnesses, surgeries, etc." rows={2} style={{ padding: '12px', fontSize: '1.05rem', resize: 'vertical', background: 'white' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" name="isEmergencyDonor" checked={formData.isEmergencyDonor} onChange={handleChange} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                <label style={{ cursor: 'pointer', fontWeight: '500' }}>Register as Emergency Donor (We can call you in critical shortages)</label>
              </div>
            </>
          )}

          {/* Worker Specific */}
          {formData.role === 'ROLE_WORKER' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Employee ID</label>
              <input type="text" name="empId" value={formData.empId} onChange={handleChange} placeholder="e.g. WRK-1024" style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} />
            </div>
          )}

          {/* Government / Security */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Government ID (For Security)</label>
            <input type="text" name="governmentId" value={formData.governmentId} onChange={handleChange} placeholder="Enter ID number" style={{ padding: '12px', fontSize: '1.05rem', background: 'white' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <input type="checkbox" name="isGovtOfficer" checked={formData.isGovtOfficer} onChange={handleChange} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label style={{ cursor: 'pointer', fontWeight: '500' }}>I am a Government Officer (Eligible for discount)</label>
          </div>

          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
            <UserPlus size={20} /> Create Account
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
      
    </div>
  );
};

export default Register;
