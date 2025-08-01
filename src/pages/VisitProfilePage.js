import React, { useState, useEffect } from 'react';
import {
  getStudentProfileByUsername,
} from '../services/StudentService';

import {
  addComment,
  toggleLike,
  deleteComment,
  deletePost,
  getPostsByUserId
} from '../services/PostService';

import '../styles/Feed.css';

function VisitProfilePage({ username }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Profil ve postlar yüklenirken hata varsa yakala
  const [error, setError] = useState(null);

  // Profil çek
  useEffect(() => {
    if (!username) return;

    setLoadingProfile(true);
    getStudentProfileByUsername(username)
      .then((res) => {
        if (res.isSuccess) {
          setProfile(res.data);
        } else {
          setError(res.failMessage || 'Profil alınamadı');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProfile(false));
  }, [username]);

  // Postları çek (profile yüklendikten sonra studentId lazım)
  useEffect(() => {
    if (!profile || !profile.studentId) return;

    setLoadingPosts(true);
    getPostsByUserId(profile.studentId)
      .then((res) => {
        setPosts(res);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingPosts(false));
  }, [profile]);

  const refreshPosts = () => {
    if (!profile || !profile.studentId) return;
    getPostsByUserId(profile.studentId)
      .then((res) => setPosts(res))
      .catch((err) => setError(err.message));
  };

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
      refreshPosts();
    } catch (err) {
      alert('Beğeni işlemi başarısız: ' + err.message);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || content.trim() === '') return;

    try {
      await addComment(postId, content);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      refreshPosts();
    } catch (err) {
      alert('Yorum eklenemedi: ' + err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Yorumu silmek istediğinize emin misiniz?')) return;

    try {
      await deleteComment(commentId);
      refreshPosts();
    } catch (err) {
      alert('Yorum silinemedi: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Gönderiyi silmek istediğinize emin misiniz?')) return;

    try {
      await deletePost(postId);
      refreshPosts();
    } catch (err) {
      alert('Gönderi silinemedi: ' + err.message);
    }
  };

  if (loadingProfile) return <p>Profil yükleniyor...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Profil bulunamadı.</p>;

  // Varsayılan olarak kendi profiline göre postları silebilme izni
  const currentUserId = localStorage.getItem('studentId');

  const isMyPost = (post) => currentUserId && post.studentId === currentUserId;

  return (
    <div className="visit-profile-container">
      <section className="profile-info">
        <h2>
          {profile.firstName} {profile.lastName}
        </h2>
        <p><strong>Meslek:</strong> {profile.profession}</p>
        <p><strong>Şehir:</strong> {profile.city}</p>
        <p><strong>Biyografi:</strong> {profile.bio}</p>
        <p><strong>Okul Durumu:</strong> {profile.highSchoolStatus}</p>
        <p><strong>Üniversite:</strong> {profile.universityName}</p>
        <p>
          <strong>Lise Başlangıç - Bitiş:</strong>{' '}
          {profile.highSchoolStartYear} - {profile.highSchoolFinishYear}
        </p>
        <p><strong>Email:</strong> {profile.email}</p>
      </section>

      <section className="posts-section">
        <h3>Gönderiler</h3>
        {loadingPosts && <p>Gönderiler yükleniyor...</p>}
        {!loadingPosts && posts.length === 0 && <p>Gönderi bulunamadı.</p>}

        {posts.map((post) => (
          <div key={post.postId} className="post-card">
            <div className="post-header">
              <p>
                <strong>
                  {post.firstName} {post.lastName}
                </strong>
              </p>
              {isMyPost(post) && (
                <button
                  className="delete-post-btn"
                  title="Gönderiyi sil"
                  onClick={() => handleDeletePost(post.postId)}
                >
                  🗑️
                </button>
              )}
            </div>

            <p>{post.content}</p>

            <div className="post-actions">
              <button
                className={post.isLiked ? 'liked' : ''}
                onClick={() => handleLike(post.postId)}
              >
                👍 {post.totalLikeCount}
              </button>
            </div>

            <div className="comments-section">
              {post.comments.map((comment) => (
                <div key={comment.commentId} className="comment">
                  <p>
                    <strong>
                      {comment.firstName} {comment.lastName}
                    </strong>
                    : {comment.commentContent}
                  </p>
                  {post.deletableComments.includes(comment.commentId) && (
                    <button
                      className="delete-comment-btn"
                      title="Yorumu sil"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}

              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Yorum ekle..."
                  value={commentInputs[post.postId] || ''}
                  onChange={(e) => handleCommentChange(post.postId, e.target.value)}
                />
                <button onClick={() => handleAddComment(post.postId)}>Gönder</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default VisitProfilePage;
