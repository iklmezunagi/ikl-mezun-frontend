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
  if (!content) return { text: '', link: '' };
  
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
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [announcementError, setAnnouncementError] = useState(null);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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

  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions(data))
      .catch(err => console.error('Professions could not be loaded:', err));
  }, []);

  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Universities could not be loaded:', err));
  }, []);

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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      setAnnouncementError(null);
      try {
        const res = await getAllAnnouncements();
        const announcementsData = res.data || res;
        
        if (Array.isArray(announcementsData)) {
          setAnnouncements(announcementsData);
        } else {
          console.error('Unexpected announcements format:', announcementsData);
          setAnnouncementError('Duyurular beklenen formatta değil');
          setAnnouncements([]);
        }
      } catch (err) {
        console.error('Announcements could not be fetched:', err);
        setAnnouncementError('Duyurular yüklenirken bir hata oluştu');
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    
    fetchAnnouncements();
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
      setPosts(prev => [newPost.data || newPost, ...prev]);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert('Gönderi oluşturulamadı: ' + err.message);
    }
  };

  const renderAnnouncementSlider = () => {
    if (loadingAnnouncements) {
      return <p>Duyurular yükleniyor...</p>;
    }

    if (announcementError) {
      return <p className="error-message">{announcementError}</p>;
    }

    if (!announcements.length) {
      return <p>Henüz duyuru yok.</p>;
    }

    const currentAnnouncement = announcements[annIndex];
    const parsedContent = parseAnnouncementContent(currentAnnouncement?.content);

    return (
      <div className="announcement-slider">
        <div className="announcement-card">
          <h4>{currentAnnouncement?.title || 'Başlıksız Duyuru'}</h4>
          {currentAnnouncement?.photoUrl && (
            <img
              src={currentAnnouncement.photoUrl}
              alt="Duyuru Fotoğrafı"
              className="announcement-image"
              loading="lazy"
              draggable={false}
            />
          )}
          <p className="announcement-text">
            {parsedContent.text.length > 200
              ? parsedContent.text.slice(0, 200) + '...'
              : parsedContent.text || 'Duyuru içeriği yok'}
          </p>
          {parsedContent.link && (
            <a 
              href={parsedContent.link.startsWith('http') ? parsedContent.link : `https://${parsedContent.link}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="announcement-link"
            >
              Bağlantıyı Görüntüle
            </a>
          )}
          <div className="announcement-meta">
            {currentAnnouncement?.createdAt 
              ? new Date(currentAnnouncement.createdAt).toLocaleDateString() 
              : 'Tarih bilgisi yok'} — {currentAnnouncement?.createdBy || 'Bilinmeyen'}
          </div>
        </div>

        {announcements.length > 1 && (
          <div className="announcement-controls">
            <button 
              onClick={() => setAnnIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
              disabled={annIndex === 0}
            >
              &lt; Önceki
            </button>
            <span className="announcement-counter">{annIndex + 1} / {announcements.length}</span>
            <button 
              onClick={() => setAnnIndex((prev) => (prev + 1) % announcements.length)}
              disabled={annIndex === announcements.length - 1}
            >
              Sonraki &gt;
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          {currentUser ? (
            <>
              <div className="user-card">
                <div className="user-avatar">
                  <img
                    src={currentUser.profilePhotoUrl || defaultProfile}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  />
                </div>
                <div className="user-info">
                  <h3
                    className="clickable-name"
                    onClick={() => navigate(`/visit-profile-id/${currentUser.studentId}`)}
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

        {/* Main Content */}
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
            {renderAnnouncementSlider()}
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

        {/* Right Sidebar */}
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
    </>
  );
}

export default HomePage;
