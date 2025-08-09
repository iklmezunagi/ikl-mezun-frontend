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
import { FaPen } from 'react-icons/fa';

function AdminPanelPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementPhotoUrl, setAnnouncementPhotoUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAllAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err.message);
      alert('Duyurular yüklenirken hata oluştu: ' + err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = userSearch
        ? await searchStudents(userSearch, page)
        : await getAllUsersPaged(page);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err.message);
      alert('Kullanıcılar yüklenirken hata oluştu: ' + err.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchUsers();
  }, [page]);

  const handleGiveAdmin = async () => {
    if (!username.trim()) {
      alert('Kullanıcı adı giriniz');
      return;
    }
    
    try {
      await giveAdmin(username);
      alert(`${username} artık admin.`);
      setUsername('');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!username.trim()) {
      alert('Kullanıcı adı giriniz');
      return;
    }
    
    try {
      await revokeAdmin(username);
      alert(`${username} artık admin değil.`);
      setUsername('');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "iklmezunagi");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dertyg91x/image/upload", {
        method: "POST",
        body: data,
      });
      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setAnnouncementPhotoUrl(uploaded.secure_url);
        setUploadError('');
      } else {
        setUploadError("Fotoğraf yüklenemedi");
      }
    } catch (err) {
      setUploadError("Fotoğraf yüklenirken hata oluştu");
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      alert('Başlık ve içerik zorunludur!');
      return;
    }

    if (isCreatingAnnouncement) return;
    
    setIsCreatingAnnouncement(true);
    
    try {
      let fullContent = announcementContent;
      if (announcementLink.trim()) {
        fullContent += `\nlink:${announcementLink.trim()}`;
      }

      await createAnnouncement(
        announcementTitle,
        fullContent,
        announcementPhotoUrl
      );

      alert('Duyuru başarıyla oluşturuldu!');
      // Reset form
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementLink('');
      setAnnouncementPhotoUrl('');
      setUploadError('');
      // Refresh announcements
      fetchAnnouncements();
    } catch (err) {
      alert('Duyuru oluşturulamadı: ' + err.message);
    } finally {
      setIsCreatingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
      alert('Duyuru silindi');
    } catch (err) {
      alert(err.message);
    }
  };

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
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
          <div className="admin-action-buttons">
            <button onClick={handleGiveAdmin}>Admin Yap</button>
            <button onClick={handleRevokeAdmin}>Adminliği Kaldır</button>
          </div>
        </div>

        <div className="admin-section">
          <h3>Yeni Duyuru Oluştur</h3>
          <input
            type="text"
            placeholder="Başlık*"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="İçerik*"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            rows={4}
            required
          />
          <input
            type="text"
            placeholder="İsteğe bağlı link (https://...)"
            value={announcementLink}
            onChange={(e) => setAnnouncementLink(e.target.value)}
          />

          <div className="photo-upload">
            <label htmlFor="photo-upload-input" className="photo-upload-label">
              {announcementPhotoUrl ? 'Fotoğraf Değiştir' : 'Fotoğraf Yükle (opsiyonel)'}
            </label>
            <input
              id="photo-upload-input"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {announcementPhotoUrl && (
              <div className="photo-preview">
                <img
                  src={announcementPhotoUrl}
                  alt="Duyuru Fotoğrafı"
                />
                <button 
                  className="remove-photo"
                  onClick={() => setAnnouncementPhotoUrl('')}
                >
                  ×
                </button>
              </div>
            )}
            {uploadError && <p className="upload-error">{uploadError}</p>}
          </div>

          <button 
            onClick={handleCreateAnnouncement}
            disabled={isCreatingAnnouncement}
          >
            {isCreatingAnnouncement ? 'Yayınlanıyor...' : 'Duyuru Yayınla'}
          </button>
        </div>

        <div className="admin-section">
          <h3>Duyurular</h3>
          {announcements.length === 0 ? (
            <p>Henüz duyuru yok.</p>
          ) : (
            <div className="announcements-container">
              {announcements.map((a) => (
                <div key={a.id} className="announcement-item">
                  <div className="announcement-header">
                    <h4>{a.title}</h4>
                    <span
                      className="delete-icon"
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      title="Sil"
                    >
                      ❌
                    </span>
                  </div>
                  <div className="announcement-content">
                    <p>{a.content}</p>
                    {a.photoUrl && (
                      <img
                        src={a.photoUrl}
                        alt="Duyuru Fotoğrafı"
                        className="announcement-image"
                      />
                    )}
                  </div>
                  <div className="announcement-footer">
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <span>{a.createdBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-section">
          <h3>Kullanıcıları Yönet</h3>
          <form onSubmit={handleSearch} className="user-search-form">
            <input
              type="text"
              placeholder="İsim / şehir / meslek"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <button type="submit">Ara</button>
          </form>

          {users.length === 0 ? (
            <p>Kullanıcı bulunamadı.</p>
          ) : (
            <div className="users-table-container">
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
                      <td>
                        <span className="username-cell">
                          {user.username}
                          {user.isAdmin && (
                            <span className="admin-badge">Admin</span>
                          )}
                        </span>
                      </td>
                      <td>{user.city || '-'}</td>
                      <td>{user.profession || '-'}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="delete-user-btn"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination-controls">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              ← Önceki
            </button>
            <span>Sayfa {page}</span>
            <button onClick={() => setPage(page + 1)}>
              Sonraki →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminPanelPage;