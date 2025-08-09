import React, { useState } from 'react';
import { loginStudent } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/form.css';
import '../styles/LoginPage.css';
import Footer from '../components/Footer';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Loading başlat
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await loginStudent(formData);

      if (response.isSuccess && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('studentId', response.data.id); 
        localStorage.setItem('isAdmin', response.data.isAdmin);

        setSuccessMessage('Giriş başarılı!');
        
        setTimeout(() => {
          navigate('/home'); 
        }, 1000);
      } else {
        setErrorMessage('Giriş başarısız');
      }
    } catch (err) {
      let message = err.message || 'Giriş başarısız oldu.';
      if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('expired')) {
        message = 'Veritabanı yükleniyor, lütfen bekleyin. Bu işlem 30 saniye kadar sürebilir.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false); // Loading durdur
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <h2>Giriş Yap</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i> Yükleniyor...
              </div>
            ) : (
              'Giriş Yap'
            )}
          </button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <p className="register-link">
            Henüz hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
          </p>
        </form>
      </div>
      <Footer />     
    </>
  );
}

export default LoginPage;
