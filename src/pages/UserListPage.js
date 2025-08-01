import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  filterStudentsByProfession, 
  filterStudentsByUniversity,
  searchStudents
} from '../services/StudentService';
import Navbar from '../components/Navbar';
import '../styles/UserListPage.css';

function UserListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paging state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10; // backend ile uyumlu

  // URL parametrelerini parse etme
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  // Kullanıcıları yükleme fonksiyonu (arama, filtre, paging)
  const loadUsers = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const searchTerm = getQueryParam('search');
      const university = getQueryParam('university');
      const profession = getQueryParam('profession');

      let response;

      if (searchTerm) {
        response = await searchStudents(searchTerm, page);
      } else if (university) {
        response = await filterStudentsByUniversity(university, page);
      } else if (profession) {
        response = await filterStudentsByProfession(profession, page);
      } else {
        navigate('/'); // Eğer hiçbir filtre yoksa ana sayfaya yönlendir
        return;
        }

      if (response.isSuccess) {
        setUsers(response.data);
        setTotalResults(response.data.length > 0 ? response.data[0].totalResult : 0);
        setCurrentPage(page);
      } else {
        setError(response.failMessage || 'Kullanıcılar yüklenemedi.');
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa numarası değiştiğinde kullanıcıları tekrar yükle
  useEffect(() => {
    loadUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Sayfa değiştirici fonksiyonlar
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > Math.ceil(totalResults / pageSize)) return;
    setCurrentPage(pageNum);

    // URL query paramını güncelle (paging parametrelerini)
    const searchParams = new URLSearchParams(location.search);

    // page parametresi ekle/güncelle
    searchParams.set('page', pageNum);

    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  // Pagination component (basit)
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

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <Navbar />
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
                        src={user.profileImage || '/default-profile.png'} 
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
    </>
  );
}


export default UserListPage;
