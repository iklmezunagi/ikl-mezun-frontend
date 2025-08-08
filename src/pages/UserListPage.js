import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  filterStudentsByProfession, 
  filterStudentsByUniversity,
  filterStudentsByCity,
  searchStudents
} from '../services/StudentService';
import Navbar from '../components/Navbar';
import '../styles/UserListPage.css';
import defaultProfile from '../assets/default-profile.png';
import Footer from '../components/Footer';

function UserListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  // URL parametresi alma yardımcı fonksiyonu
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  // Kullanıcı listesini normalize et (studentId varsa onu kullan, yoksa id)
  const normalizeUserList = (users) => {
    return users.map((user) => ({
      ...user,
      studentId: user.studentId || user.id,
    }));
  };

  // Kullanıcıları yükleme fonksiyonu
  const loadUsers = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const searchTerm = getQueryParam('search');
      const university = getQueryParam('university');
      const profession = getQueryParam('profession');
      const city = getQueryParam('city');

      let response;

      if (searchTerm) {
        response = await searchStudents(searchTerm, page);
      } else if (university) {
        response = await filterStudentsByUniversity(university, page);
      } else if (profession) {
        response = await filterStudentsByProfession(profession, page);
      } else if (city) {
        response = await filterStudentsByCity(city, page);  // Şehir filtresi eklendi
      } else {
        // Hiç filtre yoksa anasayfaya dön veya uygun bir sayfa
        navigate('/');
        return;
      }

      if (response.isSuccess) {
        const normalizedUsers = normalizeUserList(response.data);
        setUsers(normalizedUsers);
        // totalResult API'den geliyor varsayımıyla:
        setTotalResults(normalizedUsers.length > 0 ? normalizedUsers[0].totalResult : 0);
        setCurrentPage(page);
      } else {
        setError(response.failMessage || 'Kullanıcılar yüklenemedi.');
      }
    } catch (err) {
      // Eğer 401 Unauthorized ise login sayfasına yönlendir
      if (
        err.message.toLowerCase().includes('unauthorized') ||
        err.message.includes('401')
      ) {
        navigate('/login');
      } else {
        setError(err.message || 'Bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sayfa veya query değişince kullanıcıları yükle
  useEffect(() => {
    loadUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Sayfa değiştirme fonksiyonu
  const goToPage = (pageNum) => {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', pageNum);

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  // Sayfalama bileşeni
  const Pagination = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={i === currentPage ? 'active-page' : ''}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>«</button>
        {pages}
        <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>»</button>
      </div>
    );
  };

  // Kullanıcı kartına tıklayınca profiline git
  const handleUserClick = (userId) => {
    navigate(`/visit-profile-id/${userId}`);
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <main className="page-content">
          <div className="user-list-container">
            <h2>Mezunlar</h2>

            {error && <p className="error">{error}</p>}

            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i> Yükleniyor...
              </div>
            ) : (
              <>
                <div className="user-cards">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div 
                        key={user.studentId} 
                        className="user-card"
                        onClick={() => handleUserClick(user.studentId)}
                      >
                        <div className="user-avatar">
                          <img 
                            src={user.profilePhotoUrl || defaultProfile} 
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        </div>
                        <div className="user-info">
                          <h3>{user.firstName} {user.lastName}</h3>
                          <p><i className="fas fa-briefcase"></i> {user.profession || 'Belirtilmemiş'}</p>
                          <p><i className="fas fa-university"></i> {user.universityName || 'Belirtilmemiş'}</p>
                          <p><i className="fas fa-map-marker-alt"></i> {user.city || 'Belirtilmemiş'}</p>
                          <p className="user-bio">{user.bio || 'Merhaba! Ben bu platformun bir üyesiyim.'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-users">Kullanıcı bulunamadı.</p>
                  )}
                </div>

                <Pagination />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default UserListPage;
