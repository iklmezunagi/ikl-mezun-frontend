import React, { useState } from 'react';
import { loginStudent } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/form.css';
import '../styles/LoginPage.css';


function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await loginStudent(formData);

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
          <button type="submit" className="submit-button">Giriş Yap</button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
        <p className="register-link">
          Henüz hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
