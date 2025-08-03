import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/AboutPage.css';
import iklImage from '../assets/ikl.png';

function AboutPage() {
  const [flipped, setFlipped] = useState(false);

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <>
      <Navbar />
      <div className="about-container">
        <div
          className={`flip-card ${flipped ? 'flipped' : ''}`}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        >
          <div className="flip-card-inner">

            <div className="flip-card-front">
            <h2>İzmir Kız Lisesi Mezun Ağı</h2>

            <section>
                <p>
                Mezun ağımız, öğrencilerimiz ve mezunlarımızın bir araya gelerek güçlü sosyal bağlar kurmasını sağlar.
                Burada dostluklar gelişir, deneyimler paylaşılır ve anlamlı sohbetler edilir.
                </p>
            </section>

            <section>
                <p>
                Platformda okuldan haberler, önemli duyurular ve etkinlikler güncel olarak paylaşılarak,
                herkesin gelişmelerden haberdar olması sağlanır.
                </p>
            </section>

            <section>
                <p>
                Ayrıca öğrenciler, kariyer yolculuklarında deneyimli mezunlarımızdan destek alabilir,
                mentorluk yapacak mezunları kolayca bulabilirler.
                </p>
            </section>

            <section>
                <p>
                Bu sayede hem sosyal anlamda hem de kariyer planlamasında birbirimize güç katan,
                dayanışma dolu bir topluluk oluşturmayı hedefliyoruz.
                </p>
            </section>

            </div>

            <div className="flip-card-back">
              <div className="image-wrapper">
                <img src={iklImage} alt="İzmir Kız Lisesi" className="main-photo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
