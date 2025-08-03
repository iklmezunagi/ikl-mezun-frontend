import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


import { getStudentProfileById, getStudentProfileByUsername } from '../services/StudentService';
import { getPostsByUserId } from '../services/PostService';

import Feed from '../components/Feed'; 
import '../styles/VisitProfile.css';

function VisitProfilePage() {
  const { studentId, username } = useParams(); // Get both possible parameters
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch profile based on either ID or username
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
      var token = localStorage.getItem('token')
      if (token === null) {
        navigate('/')
      }
  
  }, [])

  // Fetch posts when profile is loaded
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

  if (loadingProfile) return <p>Profil yükleniyor...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Profil bulunamadı.</p>;

  return (
    <>
      <Navbar />
      <div className="visit-profile-container">
        <section className="profile-info">
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p><strong>Kullanıcı Adı:</strong> {profile.username}</p>
          <p><strong>Meslek:</strong> {profile.profession}</p>
          <p><strong>Şehir:</strong> {profile.city}</p>
          <p><strong>Biyografi:</strong> {profile.bio}</p>
          <p><strong>Okul Durumu:</strong> {profile.highSchoolStatus}</p>
          <p><strong>Üniversite:</strong> {profile.universityName}</p>
          
          {profile.highSchoolStatus.toLowerCase() === 'mezun' ? (
            <p><strong>Lise:</strong> {profile.highSchoolStartYear} - {profile.highSchoolFinishYear} yılları arasında İzmir Kız Lisesi'nde okudu.</p>
          ) : (
            <p><strong>Lise:</strong> {profile.highSchoolStartYear} yılından beri İzmir Kız Lisesi öğrencisi.</p>
          )}

          <p><strong>Email:</strong> {profile.email}</p>
        </section>

        <section className="posts-section">
          <h3>Gönderiler</h3>

          {loadingPosts && <p>Gönderiler yükleniyor...</p>}
          {!loadingPosts && posts.length === 0 && <p>Gönderi bulunamadı.</p>}

          <Feed
            posts={posts}
            currentUser={{ studentId: currentUserId }}
            onUpdate={refreshPosts}
          />
        </section>
      </div>
    </>
  );
}

export default VisitProfilePage;