import React, { useState, useEffect } from 'react';
import { registerStudent, loginStudent } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/form.css';
import '../styles/RegisterPage.css';
import Navbar from '../components/Navbar';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    highSchoolStatus: '',
    highSchoolGraduateYear: '',
    bio: '',
    profession: '',
    phoneNumber: '',
    city: '',
    universityName: '',
    username: '',
    password: ''
  });

  const [cities, setCities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [customUniversity, setCustomUniversity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Şehirleri çek
  useEffect(() => {
    fetch('https://turkiyeapi.dev/api/v1/provinces')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          setCities(data.data.map(city => city.name));
        }
      })
      .catch(err => console.error('İl API hatası:', err));
  }, []);

  // Meslekleri çek
  useEffect(() => {
    fetch('/data/meslekler.json')
      .then(res => res.json())
      .then(data => setProfessions(data))
      .catch(err => console.error('Meslek API hatası:', err));
  }, []);

  // Üniversiteleri çek
  useEffect(() => {
    fetch('/data/uni.json')
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Üniversite verisi alınamadı:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'universityName' && value === 'Diğer') {
      setCustomUniversity('');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Backend zorunlu alan kontrolü (nullable olmayanlar)
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.highSchoolStatus.trim() ||
      !formData.highSchoolGraduateYear ||
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      setErrorMessage('Lütfen zorunlu alanları doldurun');
      setSuccessMessage('');
      return;
    }

    // universityName nullable olduğu için kontrol yok, sadece formda seçim için gösteriliyor (opsiyonel)

    const finalFormData = {
      ...formData,
      universityName: formData.universityName === 'Diğer' ? customUniversity : formData.universityName,
      highSchoolGraduateYear: parseInt(formData.highSchoolGraduateYear) || 0
    };

    try {
      const response = await registerStudent(finalFormData);
      setSuccessMessage(response.responseMessage || 'Kayıt başarılı! Yönlendiriliyorsunuz.');
      setErrorMessage('');

    } catch (err) {
      setErrorMessage(err.message || 'Kayıt başarısız oldu.');
      setSuccessMessage('');
    }

    var loginData = {'Username': finalFormData.username, 'Password': finalFormData.password}
    
    try {
    const response = await loginStudent(loginData);

    if (response.isSuccess && response.data) {
      // Burada response.data içinden alıyoruz!
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('studentId', response.data.id);  // burası önemli
      localStorage.setItem('isAdmin', response.data.isAdmin);


      setSuccessMessage(response.responseMessage || 'Giriş başarılı!');
      setErrorMessage('');
      
      setTimeout(() => {
        navigate('/home'); 
      }, 1000);
    } else {
      setErrorMessage(response.failMessage || 'Giriş başarısız');
      setSuccessMessage('');
    }
  } catch (err) {
    setErrorMessage(err.message);
    setSuccessMessage('');
  }

  };

  return (
     <>
      <Navbar />
    <div className="register-page">
      <h2>Kayıt Ol</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ad *"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Soyad *"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <select name="city" value={formData.city} onChange={handleChange}>
          <option value="">Yaşadığınız İl</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <div className="highSchoolStatusContainer" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <p className="section-title">Liseye Devam Durumunuz *</p>
          <label>
            <input
              type="radio"
              name="highSchoolStatus"
              value="Mezun"
              checked={formData.highSchoolStatus === 'Mezun'}
              onChange={handleChange}
              required
            />
            Mezun
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              name="highSchoolStatus"
              value="Öğrenci"
              checked={formData.highSchoolStatus === 'Öğrenci'}
              onChange={handleChange}
              required
            />
            Öğrenci
          </label>
        </div>

        <input
          type="number"
          placeholder="Lise Mezuniyet Yılı *"
          name="highSchoolGraduateYear"
          value={formData.highSchoolGraduateYear}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
          required
        />

        {/* universityName nullable, opsiyonel olduğu için zorunlu değil */}
        {formData.highSchoolStatus === 'Mezun' && (
          <>
            <select
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
            >
              <option value="">Üniversite Seçin (Opsiyonel)</option>
              {universities.map((uni, idx) => (
                <option key={idx} value={uni}>{uni}</option>
              ))}
            </select>

            {formData.universityName === 'Diğer' && (
              <input
                type="text"
                placeholder="Üniversite Adınızı Girin (Opsiyonel)"
                value={customUniversity}
                onChange={(e) => setCustomUniversity(e.target.value)}
              />
            )}
          </>
        )}

        <select
          name="profession"
          value={formData.profession}
          onChange={handleChange}
        >
          <option value="">Meslek Seçiniz (Opsiyonel)</option>
          {professions.map(prof => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>

        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Örn: 5xx xxx xxxx (Opsiyonel)"
        />

        <input
          type="text"
          placeholder="Kullanıcı Adı *"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Şifre *"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-button">Kayıt Ol</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <p className="login-link">
          Hesabın var mı? <Link to="/">Giriş Yap</Link>
        </p>
      </form>
    </div>
       </>
  );
}

export default RegisterPage;
