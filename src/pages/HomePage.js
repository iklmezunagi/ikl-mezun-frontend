import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import { getStudentProfileByUsername } from '../services/StudentService';
import { getAllPostsPaged } from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

function HomePage() {
  const navigate = useNavigate();

  // Kullanıcı profil bilgisi
  const [currentUser, setCurrentUser] = useState(null);

  // Gönderiler ve sayfa numarası
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Arama ve filtreler
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    university: '',
    profession: '',
  });

  // localStorage'dan username al
  const username = localStorage.getItem('username');

  // Kullanıcı profilini çek
  useEffect(() => {
    if (!username) return;

    getStudentProfileByUsername(username)
      .then(res => {
        if (res.isSuccess && res.data) {
          setCurrentUser(res.data);
        } else {
          setCurrentUser(null);
          console.error('Profil bilgisi alınamadı:', res.failMessage);
        }
      })
      .catch(err => {
        setCurrentUser(null);
        console.error('Profil çağrısı hatası:', err.message);
      });
  }, [username]);

  // Gönderileri getir (sayfalı)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const data = await getAllPostsPaged(page);
        setPosts(data);
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

  // Arama butonuna basınca
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/userList?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Üniversite filtresi değişince
  const handleUniversityFilter = (uni) => {
    setFilterOptions(prev => ({ ...prev, university: uni }));
    if (uni) {
      navigate(`/userList?university=${encodeURIComponent(uni)}`);
    } else {
      navigate('/userList');
    }
  };

  // Meslek filtresi değişince
  const handleProfessionFilter = (prof) => {
    setFilterOptions(prev => ({ ...prev, profession: prof }));
    if (prof) {
      navigate(`/userList?profession=${encodeURIComponent(prof)}`);
    } else {
      navigate('/userList');
    }
  };

  return (
    <div className="home-page">
      <Navbar currentUser={currentUser} />

      <div className="home-container">
        {/* Sol Sidebar - Kullanıcı Kartı */}
        <div className="left-sidebar">
          {currentUser ? (
            <div className="user-card">
              <div className="user-avatar">
                <img
                  src={currentUser.profileImage || '/default-profile.png'}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                />
              </div>
              <div className="user-info">
                <h3>{currentUser.firstName} {currentUser.lastName}</h3>
                <p>{currentUser.profession}</p>
                <p>{currentUser.universityName || currentUser.university}</p>
                <p className="user-bio">{currentUser.bio || 'Merhaba! Ben bu platformun bir üyesiyim.'}</p>
              </div>
            </div>
          ) : (
            <p>Kullanıcı bilgileri yükleniyor...</p>
          )}
        </div>

        {/* Orta Ana İçerik - Gönderiler ve Arama */}
        <div className="main-content">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Mezun ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button type="submit">Ara</button>
            </form>
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

        {/* Sağ Sidebar - Filtreler */}
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
    </div>
  );
}

export default HomePage;
