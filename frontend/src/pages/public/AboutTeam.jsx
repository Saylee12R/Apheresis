import React from 'react';
import anshumaImg from '../../assets/anshuma.jpeg';
import brahmaniImg from '../../assets/brahmani.jpeg';
import dhammshilaImg from '../../assets/dhammshila.jpeg';
import harshadaImg from '../../assets/harshada.jpeg';
import manasviImg from '../../assets/manasvi.jpeg';
import sayleeImg from '../../assets/Saylee.jpeg';

const teamMembers = [
  { name: 'Anshuma', img: anshumaImg, position: 'center' },
  { name: 'Brahmani', img: brahmaniImg, position: 'top' },
  { name: 'Dhammshila', img: dhammshilaImg, position: '50% 70%' },
  { name: 'Harshada', img: harshadaImg, position: 'top' },
  { name: 'Manasvi', img: manasviImg, position: 'center' },
  { name: 'Saylee', img: sayleeImg, position: 'top' },
];

const AboutTeam = () => {
  return (
    <div className="team-container" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 70px)' }}>

      {/* Softened Header Section */}
      <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '3.8rem', 
          color: 'var(--primary-dark)', 
          marginBottom: '1rem', 
          fontWeight: '900',
          position: 'relative',
          display: 'inline-block'
        }}>
          <span style={{ position: 'relative', zIndex: 1 }}>The Six Bytes</span>
          <span style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '-5%', 
            width: '110%', 
            height: '24px', 
            background: 'var(--pink-light)', 
            zIndex: 0, 
            borderRadius: '8px', 
            opacity: 0.9 
          }}></span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: '1.6' }}>
          Meet the minds behind Apheresis.
        </p>
      </div>

      {/* Softer, Image-Focused Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'stretch'
      }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="card"
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '3rem 2rem',
              transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              cursor: 'default',
              background: 'white',
              border: '1px solid var(--pink-light)',
              borderRadius: '24px',
              boxShadow: '0 8px 25px rgba(248, 200, 220, 0.4)' // Soft pink shadow
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(248, 200, 220, 0.7)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(248, 200, 220, 0.4)';
            }}
          >
            {/* Prominent Image */}
            <img 
              src={member.img} 
              alt={member.name}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: member.position,
                border: '4px solid var(--secondary)', // soft pink border
                marginBottom: '2rem',
                backgroundColor: 'var(--bg-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
            />

            {/* Name */}
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: '0', fontWeight: '600' }}>
              {member.name}
            </h3>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTeam;
