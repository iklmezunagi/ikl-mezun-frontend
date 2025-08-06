import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getStudentProfileById, getStudentProfileByUsername } from '../services/StudentService';
import { getPostsByUserId } from '../services/PostService';
import Feed from '../components/Feed';
import defaultProfile from '../assets/default-profile.png';
import '../styles/VisitProfile.css';

function VisitProfilePage() {
  const { studentId, username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId && !username) return;

    setLoadingProfile(true);

    const fetchProfile = username
      ? getStudentProfileByUsername(username)
      : getStudentProfileById(studentId);

    fetchProfile
      .then((res) => {
        if (res.isSuccess) {
          setProfile(res.data);
          setError(null);
        } else {
          setError(res.failMessage || 'Profil alınamadı');
          setProfile(null);
        }
      })
      .catch((err) => {
        setError(err.message);
        setProfile(null);
      })
      .finally(() => setLoadingProfile(false));
  }, [studentId, username]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, []);

  useEffect(() => {
    if (!profile || !profile.studentId) return;

    setLoadingPosts(true);
    getPostsByUserId(profile.studentId)
      .then((res) => {
        setPosts(res);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setPosts([]);
      })
      .finally(() => setLoadingPosts(false));
  }, [profile]);

  const refreshPosts = () => {
    if (!profile || !profile.studentId) return;
    setLoadingPosts(true);
    getPostsByUserId(profile.studentId)
      .then((res) => setPosts(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingPosts(false));
  };

  const currentUserId = localStorage.getItem('studentId');

  const formatBio = (bio) => {
    if (!bio) return null;
    const splitLines = bio.split(/(?<=[*.\-])\s+/);
    return splitLines.map((line, index) => <p key={index}>{line.trim()}</p>);
  };

  if (loadingProfile) return <p className="loading">Profil yükleniyor...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p className="error">Profil bulunamadı.</p>;

  return (
    <>
      <Navbar />
      <div className="visit-profile-container">
        <div className="profile-card">
          <div className="profile-photo-wrapper">
            <img
              src={profile.profilePhotoUrl || defaultProfile}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="profile-photo"
            />
          </div>

          <h2 className="profile-name">{profile.firstName} {profile.lastName}</h2>

          <div className="profile-info-grid">
            <div className="profile-info-item"><strong>Meslek:</strong> {profile.profession || 'Belirtilmemiş'}</div>
            <div className="profile-info-item"><strong>Şehir:</strong> {profile.city || 'Belirtilmemiş'}</div>
            <div className="profile-info-item"><strong>Email:</strong> {profile.email || '-'}</div>

            <div className="profile-info-item"><strong>Lise Durumu:</strong> {profile.highSchoolStatus || '-'}</div>
            <div className="profile-info-item"><strong>Üniversite:</strong> {profile.universityName || '-'}</div>
            <div className="profile-info-item">
              <strong>Lise:</strong>{' '}
              {profile.highSchoolStatus?.toLowerCase() === 'mezun'
                ? `${profile.highSchoolStartYear} - ${profile.highSchoolFinishYear} yılları arasında İzmir Kız Lisesi'nde okudu.`
                : `${profile.highSchoolStartYear} yılından beri İzmir Kız Lisesi öğrencisi.`}
            </div>
          </div>

          <div className="bio-section">
            <h3>Biyografi</h3>
            <div className="bio">{formatBio(profile.bio)}</div>
          </div>
        </div>

        <div className="posts-section">
          <h3>Gönderiler</h3>
          {loadingPosts && <p className="loading">Gönderiler yükleniyor...</p>}
          {!loadingPosts && posts.length === 0 && <p>Gönderi bulunamadı.</p>}
          <Feed
            posts={posts}
            currentUser={{ studentId: currentUserId }}
            onUpdate={refreshPosts}
          />
        </div>
      </div>
    </>
  );
}

export default VisitProfilePage;
