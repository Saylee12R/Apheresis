import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Droplet, ClipboardList, MapPin, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="sidebar glass" style={{ width: isOpen ? '250px' : '80px', transition: 'width 0.3s ease', overflow: 'hidden' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ alignSelf: isOpen ? 'flex-end' : 'center', background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginBottom: '1rem' }}>
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {role === 'ROLE_ADMIN' && (
        <>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} style={{minWidth: '20px'}} /> {isOpen && <span>Dashboard</span>}
          </NavLink>
        </>
      )}

      {role === 'ROLE_WORKER' && (
        <>
          <NavLink to="/worker" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Droplet size={20} style={{minWidth: '20px'}} /> {isOpen && <span>Worker Panel</span>}
          </NavLink>
        </>
      )}

      {role === 'ROLE_USER' && (
        <>
          <NavLink to="/user" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ClipboardList size={20} style={{minWidth: '20px'}} /> {isOpen && <span>My Dashboard</span>}
          </NavLink>
          <NavLink to="/donate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Activity size={20} style={{minWidth: '20px'}} /> {isOpen && <span>Donate Blood</span>}
          </NavLink>
          <NavLink to="/request" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Droplet size={20} style={{minWidth: '20px'}} /> {isOpen && <span>Request Blood</span>}
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
