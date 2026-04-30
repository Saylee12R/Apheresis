import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import assets
import heroImg from '../../assets/blood_donation3.jpg';
import groupsImg from '../../assets/blood_groups.jpg';
import benefitsImg from '../../assets/blood_donation_profits.jpg';
import factsImg from '../../assets/facts_blood_donation.jpg';
import eligibilityImg from '../../assets/blood_donation_eligibility.jpg';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item" style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          width: '100%', display: 'flex', justifyContent: 'space-between', 
          background: 'none', border: 'none', padding: 0, 
          color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '600', 
          textAlign: 'left', cursor: 'pointer' 
        }}
      >
        <span>{question}</span>
        <span style={{ color: 'var(--primary)' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {answer}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--pink-light) 100%)',
          minHeight: '60vh'
        }}
      >
        <div style={{ flex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '5.5rem', color: 'var(--primary)', marginBottom: '0.5rem', lineHeight: '1', fontWeight: '900', letterSpacing: '-2px' }}>
            Apheresis
          </h1>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1.5rem', fontWeight: '600' }}>
            Donate Blood, Save Lives
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px' }}>
            Blood donation is a voluntary process where any individual donates their blood for ethical medical use. Join us in this altruistic act that plays a crucial role in saving lives and maintaining public health.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', background: 'var(--primary)' }}>Donate Now</button>
            <button className="btn-secondary" onClick={() => navigate('/login')} style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderColor: 'var(--primary-dark)', color: 'var(--primary-dark)' }}>Request Blood</button>
          </div>
        </div>
      </section>

      {/* History and Introduction */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card glass" style={{ padding: '3rem' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Journey of Blood Donation</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            The history of blood donation in India dates back to the early 20th century. The first recorded blood transfusion in India took place in 1939 at the Army Hospital in Pune. During World War II, the demand for blood transfusions increased, leading to the establishment of the first blood bank in India in 1942 in Kolkata by Dr. Jivraj Mehta.
          </p>
          <p style={{ fontSize: '1.1rem' }}>
            Post-independence, the Indian Red Cross Society played a pivotal role in promoting voluntary blood donation. In 1962, the government established the National Blood Transfusion Council (NBTC) to oversee and regulate blood transfusion services across the country.
          </p>
        </div>
      </section>

      {/* Blood Classification & Compatibility */}
      <section style={{ padding: '4rem 2rem', background: 'var(--surface-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <img src={groupsImg} alt="Blood Groups" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>Blood Classification</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              Blood is classified into different types based on factors like antigens and antibodies. The primary classifications are the ABO system and the Rh factor.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Type A & B</h3>
                <p>Have A or B antigens on red cells and opposite antibodies in plasma.</p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Type AB</h3>
                <p>Has both A & B antigens. Universal Recipient (can receive any ABO type).</p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Type O</h3>
                <p>No A or B antigens. Universal Donor (can donate to any ABO type).</p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Rh Factor</h3>
                <p>Presence (Rh+) or absence (Rh-) of the D antigen. Rh- can only receive Rh-.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Donations */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '3rem' }}>Types of Blood Donations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Whole Blood', freq: 'Every 56 days', desc: 'Approximately one pint is collected and separated into components for various uses.' },
            { title: 'Platelet (Apheresis)', freq: 'Every 7 days', desc: 'Crucial for cancer patients and organ transplants. Only platelets are collected.' },
            { title: 'Plasma (Apheresis)', freq: 'Every 28 days', desc: 'Used for liver conditions, burns, and severe infections.' },
            { title: 'Double Red Cell', freq: 'Every 112 days', desc: 'Two units of red cells are collected. Beneficial for trauma and severe anemia.' }
          ].map((type, i) => (
            <div key={i} className="card glass" style={{ textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>{i+1}</div>
              <h3 style={{ color: 'var(--primary-dark)' }}>{type.title}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1rem' }}>{type.freq}</p>
              <p>{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white' }}>Who Can Donate?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
              Eligibility criteria ensure the safety of both donor and recipient. Basic requirements include:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                'Age 18-65 years',
                'Minimum weight 50 kg',
                'Good general health',
                'Normal Hb levels (>12.5)',
                'No recent tattoos/piercings',
                'No communicable diseases',
                'No major recent surgeries',
                'Not currently pregnant'
              ].map((req, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--pink-light)', fontSize: '1.5rem' }}>✓</span> {req}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <img src={eligibilityImg} alt="Eligibility" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      </section>

      {/* Benefits and Facts */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4rem', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '4rem' }}>
          <div style={{ flex: 1 }}>
            <img src={benefitsImg} alt="Benefits" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>Benefits of Donation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Cardiovascular Health</h3>
                <p>Helps lower iron levels, reducing the risk of heart disease and improving circulation.</p>
              </div>
              <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Cell Regeneration</h3>
                <p>The body replenishes donated blood, producing new cells and enhancing overall health.</p>
              </div>
              <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Free Health Screening</h3>
                <p>Includes a mini-physical checking pulse, blood pressure, body temperature, and hemoglobin.</p>
              </div>
              <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>
                <h3 style={{ color: 'var(--primary-dark)' }}>Mental Well-being</h3>
                <p>Donating reduces stress and provides a profound sense of satisfaction knowing you saved lives.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <img src={factsImg} alt="Facts" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>10 Key Facts</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>1 Pint:</strong> Standard collection is ~470ml.</li>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>Every 2 Seconds:</strong> Someone needs blood.</li>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>Universal Donor:</strong> O Negative.</li>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>Universal Recipient:</strong> AB Positive.</li>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>Shelf Life:</strong> Red cells 42 days, platelets 5 days.</li>
              <li style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}><strong>Saves 3 Lives:</strong> One donation can be split into components.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Post-Donation Diet */}
      <section style={{ padding: '4rem 2rem', background: 'var(--surface-color)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '1rem' }}>Diet After Donation</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>Replenish your body with the right nutrients after saving a life.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧</div>
              <h3 style={{ color: 'var(--secondary)' }}>Hydration</h3>
              <p>Drink plenty of fluids, especially water. Avoid alcohol and excess caffeine for 24 hours.</p>
            </div>
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥩</div>
              <h3 style={{ color: 'var(--secondary)' }}>Iron-Rich Foods</h3>
              <p>Spinach, lean meats, beans, and lentils to restore your iron stores.</p>
            </div>
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍊</div>
              <h3 style={{ color: 'var(--secondary)' }}>Vitamin C</h3>
              <p>Citrus fruits, berries, and bell peppers to significantly enhance iron absorption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
        <div className="card glass">
          <FAQItem 
            question="How much blood is taken during a donation?" 
            answer="During a standard whole blood donation, approximately one pint (about 470 milliliters) of blood is collected. The average adult has about 10 pints of blood." 
          />
          <FAQItem 
            question="Is blood donation good for health?" 
            answer="Yes! It helps reduce the risk of cardiovascular diseases by lowering iron levels, improves circulation, and stimulates the production of new blood cells. Plus, you get a mini health check-up." 
          />
          <FAQItem 
            question="Can I donate if I have a cold or flu?" 
            answer="No, individuals experiencing a cold, flu, or any other illness should refrain from donating until they have fully recovered. Donors must be in good health to ensure safety." 
          />
          <FAQItem 
            question="How often can I donate blood?" 
            answer="For whole blood, you can typically donate every 56 days (8 weeks). Platelet donors can donate more frequently (every 7 days), and plasma donors every 28 days." 
          />
          <FAQItem 
            question="What should I eat after donating?" 
            answer="Drink plenty of water and consume iron-rich foods like leafy greens, meat, and beans. Pair these with Vitamin C-rich foods (like oranges) to help your body absorb the iron." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--secondary)', 
        padding: '4rem 2rem 2rem', 
        textAlign: 'center',
        color: 'var(--primary-dark)',
        borderTop: '2px solid rgba(214, 40, 40, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem', letterSpacing: '1px' }}>Apheresis Blood Bank</h2>
          <p style={{ color: 'rgba(145, 27, 27, 0.85)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            In conclusion, blood donation in India encompasses a vital aspect of healthcare. It relies on the active approach of donors to save lives. Join our community today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <a href="#" style={{ color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: '600', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.7'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: '600', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.7'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Terms of Service</a>
            <span onClick={() => navigate('/contact')} style={{ color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: '600', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.7'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Contact Us</span>
          </div>
          <div style={{ width: '100%', height: '1px', background: 'rgba(145, 27, 27, 0.15)', margin: '2rem 0' }}></div>
          <p style={{ color: 'rgba(145, 27, 27, 0.75)', fontSize: '0.9rem', fontWeight: '500' }}>&copy; 2026 Apheresis by The Six Bytes Team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
