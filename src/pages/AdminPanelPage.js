import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminPanelPage.css';

import {
  giveAdmin,
  revokeAdmin,
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  getAllUsersPaged,
  deleteStudent,
} from '../services/AdminService';

import { searchStudents } from '../services/StudentService';

function AdminPanelPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, []);

  // Duyuruları getir
  const fetchAnnouncements = async () => {
    try {
      const res = await getAllAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Kullanıcıları getir (arama varsa ona göre)
  const fetchUsers = async () => {
    try {
      const res = userSearch
        ? await searchStudents(userSearch, page)
        : await getAllUsersPaged(page);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchUsers();
  }, [page]);

  // Admin işlemleri
  const handleGiveAdmin = async () => {
    try {
      await giveAdmin(username);
      alert(`${username} artık admin.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRevokeAdmin = async () => {
    try {
      await revokeAdmin(username);
      alert(`${username} artık admin değil.`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Duyuru işlemleri
  const handleCreateAnnouncement = async () => {
    try {
      await createAnnouncement(announcementTitle, announcementContent);
      alert('Duyuru oluşturuldu.');
      setAnnouncementTitle('');
      setAnnouncementContent('');
      fetchAnnouncements();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert(err.message);
    }
  };

  // Kullanıcı silme
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteStudent(id);
      alert('Kullanıcı silindi.');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Arama
  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  return (
    <>
      <Navbar />
      <div className="admin-panel-container">
        <h1>Admin Paneli</h1>

        {/* Admin Yetkisi Ver/Kaldır */}
        <div className="admin-section">
          <h3>Kullanıcıya Admin Yetkisi Ver/Kaldır</h3>
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleGiveAdmin}>Admin Yap</button>
          <button onClick={handleRevokeAdmin}>Adminliği Kaldır</button>
        </div>

        {/* Duyuru Oluştur */}
        <div className="admin-section">
          <h3>Yeni Duyuru Oluştur</h3>
          <input
            type="text"
            placeholder="Başlık"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
          />
          <textarea
            placeholder="İçerik"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            rows={4}
          />
          <button onClick={handleCreateAnnouncement}>Duyuru Yayınla</button>
        </div>

        {/* Duyurular Listesi */}
        <div className="admin-section">
          <h3>Duyurular</h3>
          {announcements.length === 0 ? (
            <p>Henüz duyuru yok.</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}</strong> - {a.content}
                  <span
                    className="delete-icon"
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    title="Sil"
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Kullanıcılar Listesi */}
        <div className="admin-section">
          <h3>Kullanıcıları Yönet</h3>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="İsim / şehir / meslek"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Ara</button>
          </div>

          {users.length === 0 ? (
            <p>Kullanıcı bulunamadı.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Kullanıcı Adı</th>
                  <th>Şehir</th>
                  <th>Meslek</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.city || '-'}</td>
                    <td>{user.profession || '-'}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user.id)}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: '10px' }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Önceki</button>
            <span style={{ margin: '0 10px' }}>Sayfa {page}</span>
            <button onClick={() => setPage(page + 1)}>Sonraki →</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminPanelPage;
