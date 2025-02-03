import React, { useState, useEffect } from 'react';

function App() {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    model: '',
    location: '',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const addAsset = async () => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsset),
      });
      if (response.ok) {
        fetchAssets();
        setNewAsset({ name: '', model: '', location: '' });
      } else {
        console.error('Failed to add asset');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const deleteAsset = async (id) => {
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAssets();
      } else {
        console.error('Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  return (
    <div className="container">
      <h1>Hospital Asset Management System</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.model}</td>
              <td>{asset.location}</td>
              <td>
                <button onClick={() => deleteAsset(asset.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Add New Asset</h2>
      <div className="add-asset-form">
        <input
          type="text"
          name="name"
          placeholder="Asset Name"
          value={newAsset.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Asset Model"
          value={newAsset.model}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Asset Location"
          value={newAsset.location}
          onChange={handleInputChange}
        />
        <button onClick={addAsset}>Add Asset</button>
      </div>
    </div>
  );
}

export default App;
