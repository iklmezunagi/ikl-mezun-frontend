import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileField from '../components/ProfileField';
import Feed from '../components/Feed';
import { getStudentProfileByUsername, editProfile } from '../services/StudentService';
import { getPostsByUserId } from '../services/PostService';
import '../styles/ProfilePage.css';
import Footer from '../components/Footer';

function ProfilePage() {
  // Anahtarları küçük harfli tutmak daha sağlıklı olur
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('studentId'); // burada küçük harf kullandım

  const navigate = useNavigate();
  

  const currentUser = userId ? { studentId: userId } : null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    highSchoolStatus: '',
    highSchoolGraduateYear: '',
    bio: '',
    profession: '',
    universityName: '',
    city: '',
    phoneNumber: ''
  });

  const [universities, setUniversities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
      var token = localStorage.getItem('token')
      if (token === null) {
        navigate('/')
      }
  
  }, [])

  useEffect(() => {
    if (!username) return;

    getStudentProfileByUsername(username).then(res => {
      if (res.isSuccess && res.data) {
        const uniRaw = res.data.universityName || '';
        const cleanUni = uniRaw.toLowerCase().includes('belirtilmemiş') ? '' : uniRaw;
        setFormData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          highSchoolStatus: res.data.highSchoolStatus || '',
          highSchoolGraduateYear: res.data.highSchoolFinishYear || '',
          bio: res.data.bio || '',
          profession: res.data.profession || '',
          universityName: cleanUni,
          city: res.data.city || '',
          phoneNumber: res.data.phoneNumber || ''
        });
      } else {
        setError(res.failMessage || 'Profil bilgileri alınamadı');
      }
    }).catch(err => setError(err.message));
  }, [username]);


  useEffect(() => {
  if (!userId) return;

  setLoadingPosts(true);
  getPostsByUserId(userId, page)
    .then(res => {
      console.log('ProfilePage posts:', res);
      res.forEach(post => {
        console.log(`PostId: ${post.postId}, isLiked: ${post.isLiked}`);
      });
      setPosts(res);
    })
    .catch(err => console.error('Gönderiler alınamadı:', err))
    .finally(() => setLoadingPosts(false));
}, [userId, page]);


  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions(data))
      .catch(err => console.error('Meslekler yüklenemedi:', err));
  }, []);

  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Üniversiteler yüklenemedi:', err));
  }, []);

  useEffect(() => {
    fetch('https://turkiyeapi.dev/api/v1/provinces')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK' && Array.isArray(data.data)) {
          setCities(data.data.map(city => city.name));
        }
      })
      .catch(err => console.error('İl API hatası:', err));
  }, []);

  const onFieldChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setHasChanges(true);
      setSuccessMessage('');
      setError('');
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccessMessage('');
      const payload = {
        Id: userId,
        ...formData,
        highSchoolGraduateYear: Number(formData.highSchoolGraduateYear) || 0,
      };
      const res = await editProfile(payload);
      if (res.isSuccess) {
        setSuccessMessage('Profil başarıyla güncellendi.');
        setHasChanges(false);
      } else {
        setError(res.failMessage || 'Güncelleme başarısız.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-left">
          <h2>Profil Bilgilerim</h2>

            <div className="readonly-field">
          <label>Kullanıcı Adı</label>
          <input type="text" value={username || ''} readOnly />
          </div>

          <ProfileField label="İsim" value={formData.firstName} onChange={val => onFieldChange('firstName', val)} />
          <ProfileField label="Soyisim" value={formData.lastName} onChange={val => onFieldChange('lastName', val)} />
          <ProfileField label="Email" value={formData.email} onChange={val => onFieldChange('email', val)} />

          <ProfileField
          label="Lise Durumu"
          value={formData.highSchoolStatus}
          onChange={val => onFieldChange('highSchoolStatus', val)}
          type="radio"
          options={['Mezun', 'Öğrenci']}
        />

          <ProfileField
            label="Lise Mezuniyet Yılı"
            value={formData.highSchoolGraduateYear}
            type="number"
            onChange={val => onFieldChange('highSchoolGraduateYear', val)}
          />
          <ProfileField
            label="Hakkımda"
            value={formData.bio}
            type="textarea"
            onChange={val => onFieldChange('bio', val)}
          />
          <ProfileField
            label="Meslek"
            value={formData.profession}
            type="select"
            options={professions}
            onChange={val => onFieldChange('profession', val)}
          />
          <ProfileField
            label="Üniversite"
            value={formData.universityName}
            type="select"
            options={universities}
            onChange={val => onFieldChange('universityName', val)}
          />
          <ProfileField
            label="Şehir"
            value={formData.city}
            type="select"
            options={cities}
            onChange={val => onFieldChange('city', val)}
          />
          <ProfileField
            label="Telefon Numarası"
            value={formData.phoneNumber}
            type="tel"
            placeholder="Örn: 5xx xxx xxxx (Opsiyonel)"
            onChange={val => onFieldChange('phoneNumber', val)}
          />

          <button
            className="save-btn"
            disabled={!hasChanges}
            onClick={handleSave}
            title={!hasChanges ? 'Değişiklik yapınca aktifleşir' : 'Kaydet'}
          >
            Kaydet
          </button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="profile-right">
          <h2>Gönderilerim</h2>
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
      </div>
    </>
  );
}

export default ProfilePage;
