import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    bloodComponentType: 'Whole Blood',
    quantityUnits: 1,
    urgency: 'Normal'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/requests', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Request submitted successfully! We will process it shortly.');
      navigate('/user');
    } catch (e) {
      alert('Error submitting request');
    }
  };

  return (
    <div className="animate-fade-in card glass" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Request Blood</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label>Required Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Blood Component Needed</label>
          <select name="bloodComponentType" value={formData.bloodComponentType} onChange={handleChange}>
            {['Whole Blood', 'RBC', 'Platelets', 'Plasma', 'Super Red'].map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Units Needed</label>
          <input type="number" name="quantityUnits" value={formData.quantityUnits} onChange={handleChange} min="1" required />
        </div>
        <div className="form-group">
          <label>Urgency Level</label>
          <select name="urgency" value={formData.urgency} onChange={handleChange}>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        
        {formData.urgency !== 'Normal' && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', margin: 0 }}>
              <strong>Alert:</strong> Submitting an Urgent/Critical request will trigger emergency donor notifications if inventory is low.
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Submit Request</button>
      </form>
    </div>
  );
};

export default RequestBlood;
