import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import Footer from '../components/Footer';

import CreatePostModal from '../components/CreatePostModal';
import { getStudentProfileById } from '../services/StudentService';  
import { getAllPostsPaged, createPost, getAllAnnouncements } from '../services/PostService';
import { useNavigate } from 'react-router-dom';

import '../styles/Homepage.css';
import defaultProfile from '../assets/default-profile.png';
import '../styles/AnnouncementSlider.css';

function parseAnnouncementContent(content) {
  const linkPrefix = 'link:';
  const lines = content.split('\n');
  const linkLine = lines.find(line => line.startsWith(linkPrefix));
  const link = linkLine ? linkLine.slice(linkPrefix.length).trim() : null;
  const text = lines.filter(line => !line.startsWith(linkPrefix)).join('\n');
  return { text, link };
}

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
  const [cities, setCities] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    university: '',
    profession: '',
    city: '',
  });

  const [announcements, setAnnouncements] = useState([]);
  const [annIndex, setAnnIndex] = useState(0);

  const studentId = localStorage.getItem('studentId'); 

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch user profile by ID
  useEffect(() => {
    if (!studentId) return;

    getStudentProfileById(studentId)
      .then(res => {
        if (res.isSuccess && res.data) {
          setCurrentUser(res.data);
        } else {
          setCurrentUser(null);
          console.error('Profile info could not be fetched:', res.failMessage);
        }
      })
      .catch(err => {
        setCurrentUser(null);
        console.error('Profile call error:', err.message);
      });
  }, [studentId]);

  // Fetch posts (paginated)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const data = await getAllPostsPaged(page);
        setPosts(data.data || data);
      } catch (err) {
        console.error('Posts could not be fetched:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Load professions
  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions(data))
      .catch(err => console.error('Professions could not be loaded:', err));
  }, []);

  // Load universities
  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Universities could not be loaded:', err));
  }, []);

  // Load cities
  useEffect(() => {
    fetch('https://turkiyeapi.dev/api/v1/provinces')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK' && Array.isArray(data.data)) {
          setCities(data.data.map(city => city.name));
        }
      })
      .catch(err => console.error('City API error:', err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/userList?search=${encodeURIComponent(searchTerm)}&page=1`);
    }
  };

  const handleUniversityFilter = (uni) => {
    setFilterOptions(prev => ({ ...prev, university: uni }));
    if (uni) {
      navigate(`/userList?university=${encodeURIComponent(uni)}&page=1`);
    } else {
      navigate('/userList');
    }
  };

  const handleProfessionFilter = (prof) => {
    setFilterOptions(prev => ({ ...prev, profession: prof }));
    if (prof) {
      navigate(`/userList?profession=${encodeURIComponent(prof)}&page=1`);
    } else {
      navigate('/userList');
    }
  };

  const handleCityFilter = (city) => {
    setFilterOptions(prev => ({ ...prev, city }));
    if (city) {
      navigate(`/userList?city=${encodeURIComponent(city)}&page=1`);
    } else {
      navigate('/userList');
    }
  };

const handlePostCreated = async (content) => {
  try {
    const newPost = await createPost(content);
    // Yeni postu anında local state'e ekle
    setPosts(prev => [newPost.data || newPost, ...prev]);
    setIsModalOpen(false);
    // Backend'e ekledikten sonra sayfayı yenile
    window.location.reload();
  } catch (err) {
    alert('Gönderi oluşturulamadı: ' + err.message);
  }
};

  // Fetch announcements
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
        console.error('Announcements could not be fetched:', err);
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);

 return (
  <div className="home-page">
    <Navbar />

    <div className="home-container">
      {/* Sol Kenar Çubuğu */}
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
                <p className="user-bio">{currentUser.bio || 'Merhaba! Bu platformun bir üyesiyim.'}</p>
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

      {/* Ana İçerik */}
      <div className="main-content">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Ara..."
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
                  <p>
                    {
                      parseAnnouncementContent(announcements[annIndex].content).text.length > 100
                        ? parseAnnouncementContent(announcements[annIndex].content).text.slice(0, 100) + '...'
                        : parseAnnouncementContent(announcements[annIndex].content).text
                    }
                  </p>

                  {
                    parseAnnouncementContent(announcements[annIndex].content).link && (
                      <a
                        href={parseAnnouncementContent(announcements[annIndex].content).link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="announcement-link"
                      >
                        Bağlantıyı Görüntüle
                      </a>
                    )
                  }

                  <div className="announcement-meta">
                    {announcements[annIndex].createdAt} — {announcements[annIndex].createdBy}
                  </div>
                </div>
              </div>

              {announcements.length >= 2 && (
                <div className="slider-buttons">
                  <button onClick={() => setAnnIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}>
                    &lt; Önceki
                  </button>
                  <button onClick={() => setAnnIndex((prev) => (prev + 1) % announcements.length)}>
                    Sonraki &gt;
                  </button>
                </div>
              )}
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

      {/* Sağ Kenar Çubuğu */}
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

          <div className="filter-group">
            <h3>Şehre Göre Filtrele</h3>
            <select
              value={filterOptions.city}
              onChange={e => handleCityFilter(e.target.value)}
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <CreatePostModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onPostCreated={handlePostCreated}
    />
  </div>
);

}

export default HomePage;