import React from 'react';
import '../styles/form.css';
import '../styles/RegisterPage.css';

function RegisterPage() {
  return (
    <div className="register-page">
      <h2>Kayıt Ol</h2>
      <form className="form-container">
        <input type="text" placeholder="Ad" name="firstName" />
        <input type="text" placeholder="Soyad" name="lastName" />
        <input type="email" placeholder="Email" name="email" />
        <input type="text" placeholder="Lise Durumu" name="highSchoolStatus" />
        <input type="number" placeholder="Mezuniyet Yılı" name="highSchoolGraduateYear" />
        <input type="text" placeholder="Meslek" name="profession" />
        <input type="text" placeholder="Telefon" name="phoneNumber" />
        <input type="text" placeholder="Şehir" name="city" />
        <input type="text" placeholder="Kullanıcı Adı" name="username" />
        <input type="password" placeholder="Şifre" name="password" />
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
}

export default RegisterPage;
