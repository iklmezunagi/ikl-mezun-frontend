// src/pages/AdminPanelPage.js
import React, { useState, useEffect } from 'react';
import {
  giveAdmin,
  revokeAdmin,
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from '../services/AdminService.js';
import '../styles/AdminPanelPage.css';
import Navbar from '../components/Navbar';


function AdminPanelPage() {
  const [username, setUsername] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);

const fetchAnnouncements = async () => {
  try {
    const res = await getAllAnnouncements(); 
    setAnnouncements(res.data || []);
  } catch (err) {
    console.error(err.message);
  }
};

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

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

 const handleCreateAnnouncement = async () => {
  try {
    await createAnnouncement(announcementTitle, announcementContent);
    alert('Duyuru oluşturuldu.');
    setAnnouncementTitle('');
    setAnnouncementContent('');
    fetchAnnouncements(); // Listeyi yenile
  } catch (err) {
    alert(err.message);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
      <>
      <Navbar />
    <div className="admin-panel-container">
      <h1>Admin Paneli</h1>

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

      <div className="admin-section">
        <h3>Duyurular</h3>
        {announcements.length === 0 ? (
          <p>Henüz duyuru yok.</p>
        ) : (
          <ul className="announcement-list">
            {announcements.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> - {a.content}
                <span className="delete-icon" onClick={() => handleDelete(a.id)} title="Sil">
                  ❌
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
   </>
  );
}

export default AdminPanelPage;
