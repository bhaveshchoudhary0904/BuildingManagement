import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './DeveloperStyles.css';

const DeveloperDashboard = () => {
  const [buildings, setBuildings] = useState([]);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showChangeAdminModal, setShowChangeAdminModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  const [buildingForm, setBuildingForm] = useState({
    building_name: '',
    address: '',
    total_floors: '',
  });
  
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    building_id: '',
  });

  const [changeAdminForm, setChangeAdminForm] = useState({
    building_id: '',
    admin_id: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await api.get('/api/developer/buildings');
      setBuildings(response.data.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      const buildingData = {
        building_name: buildingForm.building_name,
        address: buildingForm.address,
        total_floors: parseInt(buildingForm.total_floors)
      };
      await api.post('/api/developer/buildings', buildingData);
      setShowBuildingModal(false);
      setBuildingForm({ building_name: '', address: '', total_floors: '' });
      fetchBuildings();
    } catch (error) {
      console.error('Error creating building:', error);
      alert('Error creating building: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminData = {
        ...adminForm,
        building_id: adminForm.building_id ? parseInt(adminForm.building_id) : undefined
      };
      await api.post('/api/developer/admins', adminData);
      setShowAdminModal(false);
      setAdminForm({ name: '', email: '', phone_number: '', password: '', building_id: '' });
      fetchBuildings();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteBuilding = async (buildingId) => {
    if (!window.confirm('Are you sure you want to delete this building? This will remove admin assignments but will not delete the admin accounts.')) {
      return;
    }
    
    try {
      await api.delete(`/api/developer/buildings/${buildingId}`);
      alert('Building deleted successfully');
      fetchBuildings();
    } catch (error) {
      console.error('Error deleting building:', error);
      alert('Error deleting building: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChangeAdminClick = (building) => {
    setSelectedBuilding(building);
    setChangeAdminForm({
      building_id: building.building_id,
      admin_id: building.admins && building.admins.length > 0 ? building.admins[0].user_id : '',
    });
    setShowChangeAdminModal(true);
  };

  const handleChangeAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove current admin assignment
      const currentAdmins = buildings.find(b => b.building_id === parseInt(changeAdminForm.building_id))?.admins || [];
      
      for (const admin of currentAdmins) {
        await api.put(`/api/developer/admins/${admin.user_id}`, {
          building_id: null,
        });
      }
      
      // Assign new admin to building if selected
      if (changeAdminForm.admin_id) {
        await api.put(`/api/developer/admins/${changeAdminForm.admin_id}`, {
          building_id: parseInt(changeAdminForm.building_id),
        });
      }
      
      setShowChangeAdminModal(false);
      setChangeAdminForm({ building_id: '', admin_id: '' });
      setSelectedBuilding(null);
      fetchBuildings();
      alert('Admin assignment changed successfully');
    } catch (error) {
      console.error('Error changing admin:', error);
      alert('Error changing admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await api.put(`/api/developer/admins/${adminId}`, {
        building_id: null,
      });
      fetchBuildings();
      alert('Admin removed from building successfully');
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="developer-dashboard">
      <div className="dashboard-header">
        <h1>Developer Dashboard</h1>
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => setShowBuildingModal(true)}>
            + Add Building
          </button>
          <button className="btn-primary" onClick={() => setShowAdminModal(true)}>
            + Add Admin
          </button>
        </div>
      </div>

      <div className="buildings-list">
        <h2>Buildings & Assigned Admins</h2>
        {!buildings || buildings.length === 0 ? (
          <p className="no-data">No buildings found. Create your first building!</p>
        ) : (
          <div className="buildings-grid">
            {buildings.map((building) => (
              <div key={building.building_id} className="building-card">
                <div className="building-header">
                  <h3>{building.building_name}</h3>
                  <span className="building-id">ID: {building.building_id}</span>
                </div>
                <p><strong>Address:</strong> {building.address || 'N/A'}</p>
                <p><strong>Total Floors:</strong> {building.total_floors}</p>
                <p><strong>Units:</strong> {building.units?.length || 0}</p>
                <div className="assigned-admins">
                  <strong>Assigned Admins:</strong>
                  {building.admins && Array.isArray(building.admins) && building.admins.length > 0 ? (
                    <ul>
                      {building.admins.map((admin) => (
                        <li key={admin.user_id}>
                          {admin.name} ({admin.email})
                          <button 
                            className="btn-danger" 
                            style={{marginLeft: '8px', padding: '2px 8px', fontSize: '11px'}}
                            onClick={() => handleRemoveAdmin(admin.user_id)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-admin">No admin assigned</span>
                  )}
                </div>
                <div className="building-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleChangeAdminClick(building)}
                  >
                    Change Admin
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteBuilding(building.building_id)}
                  >
                    Delete Building
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Building Modal */}
      {showBuildingModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Building</h2>
            <form onSubmit={handleBuildingSubmit}>
              <div className="form-group">
                <label>Building Name *</label>
                <input
                  type="text"
                  name="building_name"
                  value={buildingForm.building_name}
                  onChange={(e) => setBuildingForm({...buildingForm, building_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={buildingForm.address}
                  onChange={(e) => setBuildingForm({...buildingForm, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Total Floors *</label>
                <input
                  type="number"
                  name="total_floors"
                  value={buildingForm.total_floors || ''}
                  onChange={(e) => setBuildingForm({...buildingForm, total_floors: e.target.value})}
                  required
                  min="1"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Create Building</button>
                <button type="button" onClick={() => setShowBuildingModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Admin</h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={adminForm.phone_number}
                  onChange={(e) => setAdminForm({...adminForm, phone_number: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign Building *</label>
                <select
                  name="building_id"
                  value={adminForm.building_id}
                  onChange={(e) => setAdminForm({...adminForm, building_id: e.target.value})}
                  required
                >
                  <option value="">Select Building</option>
                  {buildings && buildings.map((building) => (
                    <option key={building.building_id} value={building.building_id}>
                      {building.building_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Create Admin</button>
                <button type="button" onClick={() => setShowAdminModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Admin Modal */}
      {showChangeAdminModal && selectedBuilding && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Admin for {selectedBuilding.building_name}</h2>
            <form onSubmit={handleChangeAdminSubmit}>
              <div className="form-group">
                <label>Current Admins:</label>
                {selectedBuilding.admins && selectedBuilding.admins.length > 0 ? (
                  <ul>
                    {selectedBuilding.admins.map((admin) => (
                      <li key={admin.user_id}>{admin.name} ({admin.email})</li>
                    ))}
                  </ul>
                ) : (
                  <p>No admin currently assigned</p>
                )}
              </div>
              <div className="form-group">
                <label>Select New Admin:</label>
                <select
                  name="admin_id"
                  value={changeAdminForm.admin_id}
                  onChange={(e) => setChangeAdminForm({...changeAdminForm, admin_id: e.target.value})}
                >
                  <option value="">No Admin (Remove current admin)</option>
                  {buildings.flatMap(b => b.admins || [])
                    .filter(admin => !selectedBuilding.admins?.some(currentAdmin => currentAdmin.user_id === admin.user_id))
                    .map((admin) => {
                      const currentBuilding = buildings.find(b => b.admins?.some(a => a.user_id === admin.user_id));
                      return (
                        <option key={admin.user_id} value={admin.user_id}>
                          {admin.name} ({admin.email}) - Currently: {currentBuilding ? currentBuilding.building_name : 'Unassigned'}
                        </option>
                      );
                    })}
                </select>
                <small style={{color: '#666', marginTop: '4px', display: 'block'}}>
                  Note: Select an existing admin or create a new admin using the "Add Admin" button.
                </small>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Change Admin</button>
                <button type="button" onClick={() => {
                  setShowChangeAdminModal(false);
                  setChangeAdminForm({ building_id: '', admin_id: '' });
                  setSelectedBuilding(null);
                }} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
