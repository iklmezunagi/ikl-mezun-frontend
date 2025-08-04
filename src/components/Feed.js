import React, { useState, useEffect } from 'react';
import { addComment, toggleLike, deleteComment, deletePost } from '../services/PostService';
import '../styles/Feed.css';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/default-profile.png';

function Feed({ posts, currentUser, page, setPage, onUpdate }) {
  const navigate = useNavigate();
  const [commentInputs, setCommentInputs] = useState({});
  const [localPosts, setLocalPosts] = useState(posts);

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const isMyPost = (post) => currentUser && post.studentId === currentUser.studentId;

  const pageSize = 20;
  const totalPostCount = posts.length > 0 ? posts[0].totalPostCount : 0;
  const totalPages = Math.ceil(totalPostCount / pageSize);

  const handleLike = async (postId) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.postId === postId) {
          const isLiked = !post.isLiked;
          const totalLikeCount = isLiked ? post.totalLikeCount + 1 : post.totalLikeCount - 1;
          return { ...post, isLiked, totalLikeCount };
        }
        return post;
      })
    );

    try {
      await toggleLike(postId);
    } catch (err) {
      alert('Beğeni işlemi başarısız: ' + err.message);
      onUpdate();
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Gönderiyi silmek istediğinize emin misiniz?')) return;
    try {
      await deletePost(postId);
      onUpdate();
    } catch (err) {
      alert('Gönderi silinemedi: ' + err.message);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    if (!commentInputs[postId] || commentInputs[postId].trim() === '') return;
    try {
      await addComment(postId, commentInputs[postId]);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      onUpdate();
    } catch (err) {
      alert('Yorum eklenemedi: ' + err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Yorumu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteComment(commentId);
      onUpdate();
    } catch (err) {
      alert('Yorum silinemedi: ' + err.message);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/visit-profile-username/${username}`);
  };

  return (
    <div className="feed-container">
      <div className="feed-content">
        {localPosts.length === 0 ? (
          <p className="no-posts">Gönderi bulunamadı.</p>
        ) : (
          localPosts.map(post => (
            <div key={post.postId} className="post-card">
              <div className="post-header">
                <div className="post-user-info">
                  <img
                    src={post.profileImage || defaultProfile}
                    alt={`${post.firstName} ${post.lastName}`}
                    className="post-user-avatar"
                  />
                  <div>
                    <button
                      className="post-user-name-link"
                      onClick={() => handleUserClick(post.username)}
                      title={`Profili ziyaret et: ${post.firstName} ${post.lastName}`}
                    >
                      {post.firstName} {post.lastName}
                    </button>
                    <div className="post-time">{new Date(post.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="post-actions">
                  {/* Kalp Butonu */}
                  <button
                    className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.postId)}
                    title={post.isLiked ? 'Beğeniyi kaldır' : 'Beğen'}
                  >
                    <i className={`fas fa-heart ${post.isLiked ? 'liked-icon' : ''}`}></i>
                  </button>

                  {/* Beğeni Sayısı ve Hover ile beğenenlerin isimleri */}
                  <div className="like-count-wrapper" title="Beğenenler">
                    <span className="like-count">{post.totalLikeCount}</span>
                    {post.likes && post.likes.length > 0 && (
                      <div className="like-user-list">
                        {post.likes.map((like, idx) => (
                          <div key={idx} className="like-user-item">
                            {like.firstName} {like.lastName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isMyPost(post) && (
                    <button
                      className="delete-btn"
                      title="Gönderiyi sil"
                      onClick={() => handleDeletePost(post.postId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="post-image" />}
              </div>

              <div className="comments-section">
                {post.comments?.map(comment => (
                  <div key={comment.commentId} className="comment">
                    <div className="comment-user-info">
                      <img
                        src={comment.profileImage || defaultProfile}
                        alt={`${comment.firstName} ${comment.lastName}`}
                        className="comment-user-avatar"
                      />
                      <div className="comment-content">
                        <button
                          className="comment-user-name-link"
                          onClick={() => handleUserClick(comment.username)}
                          title={`Profili ziyaret et: ${comment.firstName} ${comment.lastName}`}
                        >
                          {comment.firstName} {comment.lastName}
                        </button>
                        <p>{comment.commentContent}</p>
                      </div>
                    </div>
                    {(post.deletableComments?.includes(comment.commentId) || currentUser?.studentId === comment.studentId) && (
                      <button
                        className="delete-comment-btn"
                        title="Yorumu sil"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        <i className="fas fa-times"></i>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.postId)}
                  />
                  <button
                    className="comment-submit-btn"
                    onClick={() => handleAddComment(post.postId)}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        {page > 1 && (
          <button className="pagination-btn" onClick={() => setPage(page - 1)}>
            <i className="fas fa-chevron-left"></i> Önceki
          </button>
        )}
        {page < totalPages && (
          <button className="pagination-btn" onClick={() => setPage(page + 1)}>
            Sonraki <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default Feed;
