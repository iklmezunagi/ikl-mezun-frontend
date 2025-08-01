import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  filterStudentsByProfession, 
  filterStudentsByUniversity,
  searchStudents
} from '../services/StudentService';
import '../styles/UserListPage.css';
import Navbar from '../components/Navbar';


function UserListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // URL parametrelerini parse etme
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  // Kullanıcıları yükleme
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const searchTerm = getQueryParam('search');
      const university = getQueryParam('university');
      const profession = getQueryParam('profession');

      let response;
      
      if (searchTerm) {
        response = await searchStudents(searchTerm);
      } else if (university) {
        response = await filterStudentsByUniversity(university);
      } else if (profession) {
        response = await filterStudentsByProfession(profession);
      } else {
        navigate('/'); // Eğer hiçbir filtre yoksa ana sayfaya yönlendir
        return;
      }

      if (response.isSuccess) {
        setUsers(response.data);
      } else {
        setError(response.failMessage || 'Kullanıcılar yüklenemedi.');
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [location.search]);

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
      )}
    </div>
      </>
  );
}

export default UserListPage;