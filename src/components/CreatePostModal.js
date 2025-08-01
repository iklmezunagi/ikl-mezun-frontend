import React, { useState } from 'react';
import '../styles/CreatePostModal.css';

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Gönderi içeriği boş olamaz.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // createPost fonksiyonunu dışarıdan import ettiğini varsayıyorum
      await onPostCreated(content);
      setContent('');
      onClose();
    } catch (err) {
      setError(err.message || 'Gönderi oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Yeni Gönderi Oluştur</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Gönderi içeriğinizi yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={loading}>İptal</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
