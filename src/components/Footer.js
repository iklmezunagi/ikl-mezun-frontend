// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const developer = {
    name: 'Eylül Özatman',
    email: 'eylulozatman@gmail.com',
    portfolio: 'https://eylulozatman.github.io/my-portfolio/',
  };

  const admins = [
    { name: 'Onur Akdeniz', email: 'akdeniz14@protonmail.com' },
    { name: 'Yiğit Tınmaz', email: 'tnmazyigit@gmail.com' },
    { name: 'Kerem Salih Okumuş', email: 'keremsalihok@gmail.com' },
    { name: 'Can Sırrı', email: 'cansirri@icloud.com' },
    { name: 'Rıfat Kaşıkçı', email: 'rifatkasikci@gmail.com ' }
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <p className="footer-logo">© 2025 İKL Mezun Ağı</p>
          <Link to="/about" className="footer-link">Hakkında</Link>
          <a
            href="https://izmirkizlisesi.meb.k12.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            🌐 İKL Resmi Site
          </a>
          <p className="footer-text">Yeşiltepe, Mithatpaşa Cd. No:47 D, Konak/İzmir</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Geliştirici</h4>
          <div className="dev-card">
            <strong>{developer.name}</strong>
            <a href={`mailto:${developer.email}`} className="dev-email">
              <i className="fas fa-envelope"></i> {developer.email}
            </a>
            <a
              href={developer.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              🌐 Eylül Özatman Portfolyo
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Adminler</h4>
          <div className="admin-grid">
            {admins.map((admin, index) => (
              <div key={index} className="admin-card">
                <span>{admin.name}</span>
                <a href={`mailto:${admin.email}`} className="admin-email">
                  <i className="fas fa-envelope"></i> {admin.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        Her türlü şikayet ve öneri için yukarıdaki adreslerle iletişime geçebilirsiniz.
      </div>
    </footer>
  );
}

export default Footer;
