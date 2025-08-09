import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileField from '../components/ProfileField';
import Feed from '../components/Feed';
import { getStudentProfileByUsername, editProfile } from '../services/StudentService';
import { getPostsByUserId } from '../services/PostService';
import '../styles/ProfilePage.css';
import defaultProfile from '../assets/default-profile.png';
import { FaPen } from 'react-icons/fa';

function ProfilePage() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('studentId');
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
    phoneNumber: '',
    profilePhotoUrl: '' // 📌 Eklendi
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

  const [showCustomUniversity, setShowCustomUniversity] = useState(false);
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [showCustomProfession, setShowCustomProfession] = useState(false);

  // 🔹 Cloudinary'ye fotoğraf yükleme
  const handleImageUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "iklmezunagi"); // Unsigned preset adı

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dertyg91x/image/upload",
        { method: "POST", body: data }
      );
      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setFormData(prev => ({ ...prev, profilePhotoUrl: uploaded.secure_url }));
        setHasChanges(true);
      } else {
        setError("Fotoğraf yüklenemedi");
      }
    } catch (err) {
      console.error("Fotoğraf yüklenemedi:", err);
      setError("Fotoğraf yüklenemedi");
    }
  };

  useEffect(() => {
    var token = localStorage.getItem('token');
    if (token === null) {
      navigate('/');
    }
  }, [navigate]);

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
          phoneNumber: res.data.phoneNumber || '',
          profilePhotoUrl: res.data.profilePhotoUrl || '' // 📌 Fotoğraf URL'si backend'den alınır
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
        setPosts(res);
      })
      .catch(err => console.error('Gönderiler alınamadı:', err))
      .finally(() => setLoadingPosts(false));
  }, [userId, page]);

  // Meslekler
  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions([...data, 'Diğer']))
      .catch(err => console.error('Meslekler yüklenemedi:', err));
  }, []);

  // Üniversiteler
  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities([...data, 'Diğer']))
      .catch(err => console.error('Üniversiteler yüklenemedi:', err));
  }, []);

  // Şehirler
  useEffect(() => {
    fetch('https://turkiyeapi.dev/api/v1/provinces')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK' && Array.isArray(data.data)) {
          const cityNames = data.data.map(city => city.name);
          setCities([...cityNames, 'Diğer']);
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
        id: userId, // küçük i harfi olmalı backend bekliyorsa
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

          {/* 📌 Profil Fotoğrafı Alanı */}
          
      <div className="photo-upload">
        <label>Profil Fotoğrafı</label>
        <div className="photo-container" onClick={() => document.getElementById("profilePhotoInput").click()}>
          <img
            src={formData.profilePhotoUrl || defaultProfile}
            alt="Profil"
            className="profile-photo"
          />
          <div className="edit-icon">
            <FaPen />
          </div>
        </div>
        <input
          id="profilePhotoInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
      </div>

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
            placeholder={"Örnek:\n- Yazılım geliştirici\n- Kitap okumayı severim\n- Seyahat etmeyi severim"}
            onChange={val => onFieldChange('bio', val)}
          />

          {/* Meslek */}
          <ProfileField
            label="Meslek"
            value={formData.profession}
            type="select"
            options={professions}
            onChange={val => {
              setShowCustomProfession(val === 'Diğer');
              if (val !== 'Diğer') {
                onFieldChange('profession', val);
              } else {
                onFieldChange('profession', '');
              }
            }}
          />
          {showCustomProfession && (
            <input
              type="text"
              placeholder="Meslek adını giriniz"
              value={formData.profession}
              onChange={e => onFieldChange('profession', e.target.value)}
            />
          )}

          {/* Üniversite */}
          <ProfileField
            label="Üniversite"
            value={formData.universityName}
            type="select"
            options={universities}
            onChange={val => {
              setShowCustomUniversity(val === 'Diğer');
              if (val !== 'Diğer') {
                onFieldChange('universityName', val);
              } else {
                onFieldChange('universityName', '');
              }
            }}
          />
          {showCustomUniversity && (
            <input
              type="text"
              placeholder="Üniversite adını giriniz"
              value={formData.universityName}
              onChange={e => onFieldChange('universityName', e.target.value)}
            />
          )}

          {/* Şehir */}
          <ProfileField
            label="Şehir"
            value={formData.city}
            type="select"
            options={cities}
            onChange={val => {
              setShowCustomCity(val === 'Diğer');
              if (val !== 'Diğer') {
                onFieldChange('city', val);
              } else {
                onFieldChange('city', '');
              }
            }}
          />
          {showCustomCity && (
            <input
              type="text"
              placeholder="Şehir adını giriniz"
              value={formData.city}
              onChange={e => onFieldChange('city', e.target.value)}
            />
          )}

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
