import React from 'react';

// Import assets matching each camp name
import campImg1 from '../../assets/city_centre_mega_drive.webp';
import campImg2 from '../../assets/blood_donation2.jpg';   // corporate_lifesaver.cms is not a valid image format
import campImg3 from '../../assets/Awareness_camp.webp';
import campImg4 from '../../assets/university_blodd_fest.jpg';
import campImg5 from '../../assets/weekend_heroes_drive.jpg';
import campImg6 from '../../assets/global_awareness_day_camp.jpg';

const Activity = () => {
  // Mock data for recent camps
  const recentCamps = [
    {
      id: 1,
      title: 'City Center Mega Drive',
      date: 'April 25, 2026',
      location: 'Main Town Hall, Pune',
      units: 320,
      image: campImg1,
      description: 'Our largest community drive this year. We saw an overwhelming response from the youth, specifically college students.',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Corporate Lifesavers Event',
      date: 'April 10, 2026',
      location: 'Tech Park, Hinjewadi',
      units: 185,
      image: campImg2,
      description: 'Partnering with 5 major IT firms, employees stepped away from their desks to donate blood and spread awareness.',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Suburban Awareness Camp',
      date: 'March 28, 2026',
      location: 'Community Center, Kothrud',
      units: 95,
      image: campImg3,
      description: 'A targeted camp focusing on collecting rare blood types (O- and AB-). Special thanks to local volunteers.',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'University Blood Fest',
      date: 'March 15, 2026',
      location: 'Symbiosis Campus',
      units: 410,
      image: campImg4,
      description: 'An incredibly energetic event where over 400 students donated for the first time. The future of blood donation is bright!',
      status: 'Completed'
    },
    {
      id: 5,
      title: 'Weekend Heroes Drive',
      date: 'March 02, 2026',
      location: 'Phoenix Mall Atrium',
      units: 150,
      image: campImg5,
      description: 'Shoppers turned into heroes! We set up a quick 15-minute donation process that allowed busy individuals to contribute.',
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Global Awareness Day Camp',
      date: 'February 14, 2026',
      location: 'City Hospital Grounds',
      units: 230,
      image: campImg6,
      description: 'Held on Valentine\'s Day to spread the message of "Give Love, Give Blood". A heartwarming event with many couples donating together.',
      status: 'Completed'
    }
  ];

  return (
    <div className="activity-container" style={{ padding: '4rem 2rem', background: 'var(--bg-color)', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>Activity & Camp Gallery</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          A look back at our successful blood donation camps and events. Your participation makes these numbers possible.
        </p>

        {/* Improved Grid Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2.5rem', 
          alignItems: 'stretch' 
        }}>
          {recentCamps.map((camp) => (
            <div 
              key={camp.id} 
              className="card glass" 
              style={{ 
                padding: 0, 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                textAlign: 'left',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Image Section */}
              <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={camp.image} 
                  alt={camp.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--success)',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {camp.status}
                </div>
              </div>

              {/* Content Section */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  {camp.title}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    📅 {camp.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    🩸 {camp.units} Units
                  </span>
                </div>

                <p style={{ color: 'var(--text-color)', fontSize: '1rem', lineHeight: '1.5', flex: 1 }}>
                  {camp.description}
                </p>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📍 {camp.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;
