import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const IIIT_LAT = 26.8006;
const IIIT_LNG = 81.0253;

// Uses OpenStreetMap via Leaflet embed — no API key required
const GoogleMapComponent = () => {
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${IIIT_LNG - 0.01}%2C${IIIT_LAT - 0.01}%2C${IIIT_LNG + 0.01}%2C${IIIT_LAT + 0.01}&layer=mapnik&marker=${IIIT_LAT}%2C${IIIT_LNG}`;
  const osmFullUrl = `https://www.openstreetmap.org/?mlat=${IIIT_LAT}&mlon=${IIIT_LNG}#map=15/${IIIT_LAT}/${IIIT_LNG}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', minHeight: '200px' }}>
      <iframe
        title="Apheresis Blood Bank Location"
        src={osmEmbedUrl}
        style={{ width: '100%', height: '100%', minHeight: '200px', border: 'none', borderRadius: '12px' }}
        allowFullScreen
      />
      {/* Open in full map link */}
      <a
        href={osmFullUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'var(--primary)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        <MapPin size={14} />
        Open Map
        <ExternalLink size={12} />
      </a>
    </div>
  );
};

export default GoogleMapComponent;
