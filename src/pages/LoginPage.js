import React from 'react';
import '../styles/form.css';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <h2>Giriş Yap</h2>
      <form className="form-container">
        <input type="text" placeholder="Kullanıcı Adı" name="username" />
        <input type="password" placeholder="Şifre" name="password" />
        <button type="submit">Giriş</button>
      </form>
    </div>
  );
}

export default LoginPage;
