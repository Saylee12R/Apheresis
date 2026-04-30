import React, { useState } from 'react';
import axios from 'axios';
import { Facebook, X, Instagram, Linkedin, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ orgName: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/v1/camp-requests', {
        orgName: formData.orgName,
        email: formData.email,
        message: formData.message,
      });
      setSubmitted(true);
      setFormData({ orgName: '', email: '', message: '' });
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialBtnStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.8rem', 
    color: 'white', 
    background: 'var(--primary)', 
    padding: '1rem 2rem', 
    borderRadius: '50px', 
    textDecoration: 'none', 
    fontWeight: 'bold', 
    fontSize: '1.3rem', 
    boxShadow: '0 8px 20px rgba(214, 40, 40, 0.4)', 
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  };

  const hoverEffect = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 12px 25px rgba(214, 40, 40, 0.6)';
  };

  const resetEffect = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(214, 40, 40, 0.4)';
  };

  return (
    <div className="contact-container" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Eye-catching Social Media Links */}
      <div className="card glass" style={{ marginBottom: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--secondary-light) 0%, var(--pink-light) 100%)', border: '2px solid var(--primary-light)' }}>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem', fontSize: '2.5rem' }}>Connect With Us</h2>
        <p style={{ color: 'var(--primary-dark)', marginBottom: '2.5rem', fontSize: '1.2rem', opacity: 0.9 }}>
          Join our growing community online. Stay updated on our latest drives, health tips, and ways you can help save lives!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="#" style={socialBtnStyle} onMouseOver={hoverEffect} onMouseOut={resetEffect}>
            <Facebook size={26} /> Facebook
          </a>
          <a href="#" style={socialBtnStyle} onMouseOver={hoverEffect} onMouseOut={resetEffect}>
            <X size={26} /> X (Twitter)
          </a>
          <a href="#" style={socialBtnStyle} onMouseOver={hoverEffect} onMouseOut={resetEffect}>
            <Instagram size={26} /> Instagram
          </a>
          <a href="#" style={socialBtnStyle} onMouseOver={hoverEffect} onMouseOut={resetEffect}>
            <Linkedin size={26} /> LinkedIn
          </a>
        </div>
      </div>

      {/* Collaboration Form */}
      <div className="card glass" style={{ padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Host a Camp</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Are you an organization looking to collaborate or host a blood donation camp? Fill out the form below and we will be in touch.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Request Submitted!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Thank you for your interest! Our team will review your proposal and contact you soon.</p>
            <button className="btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>Submit Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Organization Name</label>
              <input type="text" required value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})} placeholder="e.g. HealthCorp Inc." style={{ padding: '1rem', fontSize: '1.1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Contact Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="contact@org.com" style={{ padding: '1rem', fontSize: '1.1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>Message / Proposal</label>
              <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="How would you like to collaborate?" style={{ padding: '1rem', fontSize: '1.1rem', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', fontSize: '1.2rem', padding: '1rem' }}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
