import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';
  const isAboutPage = location.pathname === '/about';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isProfilePage = location.pathname === '/myprofile';
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
        {(isLoginPage || isRegisterPage) && (
          <button onClick={() => navigate('/about')}>Hakkında</button>
        )}

        {isAboutPage && (
          token
            ? <button onClick={() => navigate('/home')}>Ana Sayfa</button>
            : <button onClick={() => navigate('/')}>Giriş Yap</button>
        )}

        {!isLoginPage && !isRegisterPage && !isAboutPage && (
          <>
            <button onClick={() => navigate('/about')}>Hakkında</button>

            {isProfilePage && <button onClick={() => navigate('/home')}>Ana Sayfa</button>}
            {isHomePage && <button onClick={() => navigate('/myprofile')}>Profili Düzenle</button>}
            {!isProfilePage && !isHomePage && (
              <button onClick={() => navigate('/home')}>Ana Sayfa</button>
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
