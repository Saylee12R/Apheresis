import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DonateBlood = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '', weight: '', tattoo: false, alcohol: false, 
    medicine: false, illness: false, haemoglobin: '',
    bloodGroup: 'A+', bloodComponentType: 'Whole Blood', units: 1
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // basic validation
    if (formData.age < 18 || formData.age > 65 || formData.weight < 50 || formData.tattoo || formData.alcohol || formData.illness || formData.haemoglobin < 12.5) {
      alert("You are not currently eligible to donate based on the criteria.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/user/donate', {
        bloodGroup: formData.bloodGroup,
        bloodComponentType: formData.bloodComponentType,
        units: formData.units,
        quantityMl: formData.units * 350
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Thank you for your donation! Your next eligible date has been calculated.');
      navigate('/user');
    } catch (e) {
      alert('Error logging donation');
    }
  };

  return (
    <div className="animate-fade-in card glass" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Donate Blood</h2>
      
      {step === 1 && (
        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Step 1: Eligibility Check</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Haemoglobin (g/dL)</label>
              <input type="number" step="0.1" name="haemoglobin" value={formData.haemoglobin} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="tattoo" checked={formData.tattoo} onChange={handleChange} style={{ width: 'auto' }} />
            <label>Tattoo or piercing in the last 6 months?</label>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="alcohol" checked={formData.alcohol} onChange={handleChange} style={{ width: 'auto' }} />
            <label>Consumed alcohol in the last 24 hours?</label>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="illness" checked={formData.illness} onChange={handleChange} style={{ width: 'auto' }} />
            <label>Currently suffering from cold, flu or other illnesses?</label>
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Next Step</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Step 2: Donation Details</h3>
          <div className="form-group">
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Blood Component</label>
            <select name="bloodComponentType" value={formData.bloodComponentType} onChange={handleChange}>
              {['Whole Blood', 'RBC', 'Platelets', 'Plasma', 'Super Red'].map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Units</label>
            <input type="number" name="units" value={formData.units} onChange={handleChange} min="1" max="2" required />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Donation</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DonateBlood;
