import React, { useState, useEffect } from 'react';
import { addComment, toggleLike, deleteComment, deletePost } from '../services/PostService';
import '../styles/Feed.css';

function Feed({ posts, currentUser, page, setPage, onUpdate }) {
  const [commentInputs, setCommentInputs] = useState({});
  const [localPosts, setLocalPosts] = useState(posts);

  // Prop posts değişince localPosts'u güncelle
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleLike = async (postId) => {
    // Önce UI güncelle
    setLocalPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.postId === postId) {
          const isLiked = !post.isLiked;
          const totalLikeCount = isLiked ? post.totalLikeCount + 1 : post.totalLikeCount - 1;
          return { ...post, isLiked, totalLikeCount };
        }
        return post;
      });
    });

    try {
      await toggleLike(postId);
      // Başarılıysa zaten UI güncellendi
    } catch (err) {
      alert('Beğeni işlemi başarısız: ' + err.message);
      // Hata olursa listeyi yeniden yükle
      onUpdate();
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    if (!commentInputs[postId] || commentInputs[postId].trim() === '') return;
    try {
      await addComment(postId, commentInputs[postId]);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
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

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Gönderiyi silmek istediğinize emin misiniz?')) return;
    try {
      await deletePost(postId);
      onUpdate();
    } catch (err) {
      alert('Gönderi silinemedi: ' + err.message);
    }
  };

  const isMyPost = (post) => currentUser && post.studentId === currentUser.studentId;

  return (
    <div className="feed-container">
      {localPosts.length === 0 && <p className="no-posts">Gönderi bulunamadı.</p>}

      {localPosts.map((post) => (
        <div key={post.postId} className="post-card">
          <div className="post-header">
            <div className="post-user-info">
              <img
                src={post.profileImage || '/default-profile.png'}
                alt={`${post.firstName} ${post.lastName}`}
                className="post-user-avatar"
              />
              <span className="post-user-name">{post.firstName} {post.lastName}</span>
            </div>

            <div className="post-header-actions">
              <button
                className={`like-btn-header ${post.isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post.postId)}
                title="Beğen"
              >
                <i className="fas fa-heart"></i>
              </button>
              <span className="like-count">{post.totalLikeCount}</span>

              {isMyPost(post) && (
                <button
                  className="delete-post-btn"
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

          <div className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </div>

          <div className="comments-section">
            {post.comments?.map((comment) => (
              <div key={comment.commentId} className="comment">
                <div className="comment-user-info">
                  <img
                    src={comment.profileImage || '/default-profile.png'}
                    alt={`${comment.firstName} ${comment.lastName}`}
                    className="comment-user-avatar"
                  />
                  <div className="comment-content">
                    <span className="comment-user-name">{comment.firstName} {comment.lastName}</span>
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
      ))}

      <div className="pagination">
        {page > 1 && (
          <button className="pagination-btn" onClick={() => setPage(page - 1)}>
            <i className="fas fa-chevron-left"></i> Önceki
          </button>
        )}
        <button className="pagination-btn" onClick={() => setPage(page + 1)}>
          Sonraki <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Feed;
