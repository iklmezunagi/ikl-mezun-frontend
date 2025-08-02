import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import VisitProfilePage from './pages/VisitProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import UserListPage  from './pages/UserListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/myprofile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/userList" element={<UserListPage />} />
""""""""<Route path="/visit-profile-id/:studentId" element={<VisitProfilePage />} />
        <Route path="/visit-profile-username/:username" element={<VisitProfilePage />} />



      </Routes>
    </Router>
  );
}

export default App;
