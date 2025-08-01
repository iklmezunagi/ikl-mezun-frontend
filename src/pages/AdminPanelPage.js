// src/pages/AdminPanelPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanelPage.css';

function AdminPanelPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-panel-container">
      <h1>Admin Paneli</h1>
      <div className="admin-actions">
        <button onClick={() => navigate('/userList')}>Tüm Kullanıcıları Gör</button>
        {/* Buraya başka admin aksiyonları da eklenebilir */}
      </div>
    </div>
  );
}

export default AdminPanelPage;
