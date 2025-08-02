import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // localStorage string döner

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Profil sayfasındayken buton "Ana Sayfa" olsun
  const isProfilePage = location.pathname === '/myprofile';
  // Ana sayfadaysak buton "Profilim" olsun
  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="İKL Logo" className="logo" />
        <h2 className={isLoginPage ? 'welcome-text' : 'site-title'}>
          {isLoginPage ? 'İzmir Kız Lisesi Mezun Ağına Hoş Geldiniz' : 'İKL Mezun Ağı'}
        </h2>
      </div>
      <div className="navbar-right">
        {!isLoginPage && (
          <>
            {isProfilePage && (
              <button onClick={() => navigate('/home')}>Ana Sayfa</button>
            )}
            {isHomePage && (
              <button onClick={() => navigate('/myprofile')}>Profili Düzenle</button>
            )}
            {!isProfilePage && !isHomePage && (
              <>
                {/* Diğer sayfalarda profil butonu gösterebilirsin istersen */}
                <button onClick={() => navigate('/home')}>Ana Sayfa</button>
              </>
            )}

            {isAdmin && <button onClick={() => navigate('/admin')}>Admin Paneli</button>}
            <button onClick={handleLogout}>Çıkış Yap</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
