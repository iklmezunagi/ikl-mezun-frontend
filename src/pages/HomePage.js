import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import CreatePostModal from '../components/CreatePostModal';
import { getStudentProfileById } from '../services/StudentService';  
import { getAllPostsPaged, createPost, getAllAnnouncements } from '../services/PostService';
import { useNavigate } from 'react-router-dom';

import '../styles/Homepage.css';
import defaultProfile from '../assets/default-profile.png';
import '../styles/AnnouncementSlider.css';

function HomePage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    university: '',
    profession: '',
  });

  const [announcements, setAnnouncements] = useState([]);
  const [annIndex, setAnnIndex] = useState(0);

const studentId = localStorage.getItem('studentId'); 

  // Kullanıcı profilini ID ile çek
  useEffect(() => {
    if (!studentId) return;

    getStudentProfileById(studentId)
      .then(res => {
        console.log('API response for user profile:', res); // Kontrol için log
        console.log('LocalStorage studentId:', localStorage.getItem('studentId'));

        if (res.isSuccess && res.data) {
          setCurrentUser(res.data); // data içindeki kullanıcı objesi
        } else {
          setCurrentUser(null);
          console.error('Profil bilgisi alınamadı:', res.failMessage);
        }
      })
      .catch(err => {
        setCurrentUser(null);
        console.error('Profil çağrısı hatası:', err.message);
      });
  }, [studentId]);

  // Gönderileri getir (sayfalı)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const data = await getAllPostsPaged(page);
        setPosts(data.data || data);
      } catch (err) {
        console.error('Gönderiler alınamadı:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Meslekleri yükle
  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions(data))
      .catch(err => console.error('Meslekler yüklenemedi:', err));
  }, []);

  // Üniversiteleri yükle
  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Üniversiteler yüklenemedi:', err));
  }, []);

  // Arama butonuna basınca sayfa 1 ile arama yapacak
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/userList?search=${encodeURIComponent(searchTerm)}&page=1`);
    }
  };

  // Üniversite filtresi değişince sayfa 1 ile git
  const handleUniversityFilter = (uni) => {
    setFilterOptions(prev => ({ ...prev, university: uni }));
    if (uni) {
      navigate(`/userList?university=${encodeURIComponent(uni)}&page=1`);
    } else {
      navigate('/userList');
    }
  };

  // Meslek filtresi değişince sayfa 1 ile git
  const handleProfessionFilter = (prof) => {
    setFilterOptions(prev => ({ ...prev, profession: prof }));
    if (prof) {
      navigate(`/userList?profession=${encodeURIComponent(prof)}&page=1`);
    } else {
      navigate('/userList');
    }
  };

  // Yeni gönderi oluşturulunca çağrılır (modal'dan)
  const handlePostCreated = async (content) => {
    try {
      await createPost(content);
      setPage(1);
      const data = await getAllPostsPaged(1);
      setPosts(data.data || data);
    } catch (err) {
      alert('Gönderi oluşturulamadı: ' + err.message);
    }
  };

  // Duyuruları getir
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await getAllAnnouncements();
        if (res.isSuccess && Array.isArray(res.data)) {
          setAnnouncements(res.data);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.error('Duyurular alınamadı:', err);
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-container">
        {/* Sol Sidebar */}
        <div className="left-sidebar">
          {currentUser ? (
            <>
              <div className="user-card">
                <div className="user-avatar">
                  <img
                    src={currentUser.profileImage || defaultProfile}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  />
                </div>
                <div className="user-info">
                  <h3
                    className="clickable-name"
                    onClick={() => navigate(`/visit-profile-id/${currentUser.studentId}`)}
                    style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                  >
                    {currentUser.firstName} {currentUser.lastName}
                  </h3>
                  <p>{currentUser.profession || 'Belirtilmemiş'}</p>
                  <p>{currentUser.universityName || currentUser.university || 'Belirtilmemiş'}</p>
                  <p className="user-bio">{currentUser.bio || 'Merhaba! Ben bu platformun bir üyesiyim.'}</p>
                </div>
              </div>

              <button
                className="create-post-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Gönderi Oluştur
              </button>
            </>
          ) : (
            <p>Kullanıcı bilgileri yükleniyor...</p>
          )}
        </div>

        {/* Orta Ana İçerik */}
        <div className="main-content">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="arama yap..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button type="submit">Ara</button>
            </form>
          </div>

          <div className="announcement-slider-wrapper">
            <h3>Duyurular</h3>
            {announcements.length === 0 ? (
              <p>Henüz duyuru yok.</p>
            ) : (
              <>
                <div className="announcement-slider">
                  <div className="announcement-card" style={{ flex: '1 1 100%' }}>
                    <h4>{announcements[annIndex].title}</h4>
                    <p>{announcements[annIndex].content.length > 100 ? announcements[annIndex].content.slice(0, 100) + '...' : announcements[annIndex].content}</p>
                    <div className="announcement-meta">
                      {announcements[annIndex].createdAt} — {announcements[annIndex].createdBy}
                    </div>
                  </div>
                </div>
                <div className="slider-buttons">
                  <button onClick={() => setAnnIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}>
                    &lt; Önceki
                  </button>
                  <button onClick={() => setAnnIndex((prev) => (prev + 1) % announcements.length)}>
                    Sonraki &gt;
                  </button>
                </div>
              </>
            )}
          </div>

          {loadingPosts ? (
            <p>Gönderiler yükleniyor...</p>
          ) : (
            <Feed
              posts={posts}
              currentUser={currentUser}
              page={page}
              setPage={setPage}
              onUpdate={() => setPage(1)}
            />
          )}
        </div>

        {/* Sağ Sidebar */}
        <div className="right-sidebar">
          <div className="filter-section">
            <h2>Mezunlarımızla Tanışın</h2>

            <div className="filter-group">
              <h3>Üniversiteye Göre Filtrele</h3>
              <select
                value={filterOptions.university}
                onChange={e => handleUniversityFilter(e.target.value)}
              >
                <option value="">Tüm Üniversiteler</option>
                {universities.map((uni, idx) => (
                  <option key={idx} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h3>Mesleğe Göre Filtrele</h3>
              <select
                value={filterOptions.profession}
                onChange={e => handleProfessionFilter(e.target.value)}
              >
                <option value="">Tüm Meslekler</option>
                {professions.map((prof, idx) => (
                  <option key={idx} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default HomePage;
