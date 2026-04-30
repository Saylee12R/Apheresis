import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchBg, setSearchBg] = useState('');
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    fetchInventory();
    fetchRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/inventory', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInventory(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/requests/${id}/status?status=FULFILLED`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/requests/${id}/status?status=REJECTED`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const cleanupExpired = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/inventory/cleanup', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchInventory();
      alert('Cleanup completed!');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInventory = inventory.filter(u => 
    (searchBg === '' || u.bloodGroup === searchBg) &&
    (searchType === '' || u.bloodComponentType === searchType)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Worker Dashboard</h2>

      {/* Alerts */}
      {requests.filter(r => r.status === 'PENDING' && (r.urgency === 'Critical' || r.urgency === 'Urgent')).length > 0 && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', borderRadius: '4px' }}>
          <h3 style={{ color: 'var(--danger)', margin: 0 }}>⚠️ Emergency Alerts</h3>
          <p style={{ margin: '0.5rem 0 0 0' }}>There are pending Critical or Urgent requests. Please process them immediately!</p>
        </div>
      )}
      
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3>Inventory Management</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select value={searchBg} onChange={(e) => setSearchBg(e.target.value)} style={{ padding: '8px', width: 'auto' }}>
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px', width: 'auto' }}>
              <option value="">All Components</option>
              {['Whole Blood', 'RBC', 'Platelets', 'Plasma', 'Super Red'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
            <button className="btn-secondary" onClick={cleanupExpired} style={{ padding: '8px 16px' }}>Cleanup Expired</button>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Blood Group</th>
                <th>Component</th>
                <th>Units</th>
                <th>Collection Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(unit => (
                <tr key={unit.id}>
                  <td>{unit.id}</td>
                  <td>{unit.bloodGroup}</td>
                  <td>{unit.bloodComponentType}</td>
                  <td>{unit.units || 1}</td>
                  <td>{unit.collectionDate}</td>
                  <td>{unit.expiryDate}</td>
                  <td>
                    <span style={{ color: unit.status === 'EXPIRED' ? 'var(--danger)' : 'var(--success)' }}>
                      {unit.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && <tr><td colSpan="7">No blood units found matching criteria.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card glass">
        <h3 style={{ marginBottom: '1rem' }}>Blood Requests Management</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Requester</th>
                <th>Blood Group</th>
                <th>Component</th>
                <th>Units Needed</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.requester?.username}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.bloodComponentType}</td>
                  <td>{req.quantityUnits}</td>
                  <td>
                    <span style={{ 
                      color: req.urgency === 'Critical' ? 'var(--danger)' : req.urgency === 'Urgent' ? 'var(--warning)' : 'inherit',
                      fontWeight: req.urgency !== 'Normal' ? 'bold' : 'normal'
                    }}>
                      {req.urgency}
                    </span>
                  </td>
                  <td>{req.status}</td>
                  <td>
                    {req.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--success)' }} onClick={() => approveRequest(req.id)}>
                          Approve
                        </button>
                        <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => rejectRequest(req.id)}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="8">No requests found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
