import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const ROLE_COLORS = {
  ROLE_ADMIN: { bg: '#fde8e8', color: '#b91c1c', label: 'Admin' },
  ROLE_WORKER: { bg: '#e0f2fe', color: '#0369a1', label: 'Worker' },
  ROLE_USER: { bg: '#dcfce7', color: '#15803d', label: 'Donor' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRequests: 0, totalBloodUnits: 0, criticalAlerts: 0 });
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [campRequests, setCampRequests] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = ['#d32f2f', '#ff6659', '#b71c1c', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds to pick up user/worker activity
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [invRes, reqRes, usersRes, campRes] = await Promise.all([
        axios.get('http://localhost:8080/api/v1/inventory', { headers }),
        axios.get('http://localhost:8080/api/v1/requests', { headers }),
        axios.get('http://localhost:8080/api/v1/user/all', { headers }),
        axios.get('http://localhost:8080/api/v1/camp-requests', { headers }),
      ]);

      setInventory(invRes.data);
      setRequests(reqRes.data);
      setUsers(usersRes.data);
      setCampRequests(campRes.data);
      setLastUpdated(new Date());

      const critical = reqRes.data.filter(r => r.urgency === 'Critical' && r.status === 'PENDING').length;

      setStats({
        totalRequests: reqRes.data.length,
        totalBloodUnits: invRes.data.filter(i => i.status === 'AVAILABLE').length,
        criticalAlerts: critical
      });
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCampStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/camp-requests/${id}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCampRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) { console.error(e); }
  };

  const handleCampDelete = async (id) => {
    if (!window.confirm('Delete this camp request?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/camp-requests/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCampRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      alert(e.response?.data || 'Failed to delete user');
    }
  };

  // Process data for charts
  const bloodGroupCounts = inventory.reduce((acc, unit) => {
    if (unit.status === 'AVAILABLE') {
      acc[unit.bloodGroup] = (acc[unit.bloodGroup] || 0) + (unit.units || 1);
    }
    return acc;
  }, {});

  const pieData = Object.keys(bloodGroupCounts).map(key => ({
    name: key,
    value: bloodGroupCounts[key]
  }));

  const requestStatusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(requestStatusCounts).map(key => ({
    name: key,
    count: requestStatusCounts[key]
  }));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Administrator Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastUpdated && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={refreshing}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: '1px solid var(--primary)',
              background: refreshing ? 'var(--pink-light)' : 'white',
              color: 'var(--primary)',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'var(--success)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--success)',
            animation: 'pulse 2s infinite'
          }} title="Live - auto-refreshes every 30s" />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <p>Total Blood Units Available</p>
          <div className="stat-value">{stats.totalBloodUnits}</div>
        </div>
        <div className="stat-card glass">
          <p>Total Blood Requests</p>
          <div className="stat-value">{stats.totalRequests}</div>
        </div>
        <div className="stat-card glass" style={{ borderLeft: stats.criticalAlerts > 0 ? '4px solid var(--danger)' : 'none' }}>
          <p>Critical Pending Alerts</p>
          <div className="stat-value" style={{ color: stats.criticalAlerts > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {stats.criticalAlerts}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Available Blood by Group</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Requests Status Overview</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData.length > 0 ? barData : [{ name: 'No Data', count: 0 }]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="var(--text-color)" />
                <YAxis stroke="var(--text-color)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User & Worker Management Table */}
      <div className="glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>User &amp; Worker Management</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const roleStyle = ROLE_COLORS[u.role] || { bg: '#f3f4f6', color: '#374151', label: u.role };
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td style={{ fontWeight: '600' }}>{u.username}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email || '—'}</td>
                    <td>
                      <span style={{
                        background: roleStyle.bg,
                        color: roleStyle.color,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {roleStyle.label}
                      </span>
                    </td>
                    <td>{u.bloodGroup || '—'}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.85rem',
                          background: 'transparent',
                          border: '1px solid var(--danger)',
                          color: 'var(--danger)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camp Hosting Requests */}
      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>🏕️ Camp Hosting Requests</h3>
          {campRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span style={{ background: 'var(--danger)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600' }}>
              {campRequests.filter(r => r.status === 'PENDING').length} Pending
            </span>
          )}
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Organization</th>
                <th>Email</th>
                <th>Message</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campRequests.map(req => {
                const statusColor = req.status === 'PENDING' ? '#f59e0b' : req.status === 'ACCEPTED' ? 'var(--success)' : req.status === 'REJECTED' ? 'var(--danger)' : 'var(--text-muted)';
                return (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td style={{ fontWeight: '600' }}>{req.orgName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{req.email}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.message}>{req.message}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{req.submittedAt?.substring(0, 10)}</td>
                    <td>
                      <span style={{ color: statusColor, fontWeight: '600' }}>{req.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {req.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleCampStatus(req.id, 'ACCEPTED')} style={{ padding: '3px 10px', fontSize: '0.8rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Accept</button>
                            <button onClick={() => handleCampStatus(req.id, 'REJECTED')} style={{ padding: '3px 10px', fontSize: '0.8rem', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
                          </>
                        )}
                        <button onClick={() => handleCampDelete(req.id)} style={{ padding: '3px 10px', fontSize: '0.8rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {campRequests.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No camp requests yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
