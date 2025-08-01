const API_BASE_URL = 'http://localhost:5142/api';

// Tüm postları sayfalanmış olarak getirir (page parametreli, pageSize yok)
export async function getAllPostsPaged(page = 1) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/get-all-posts-paged?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Gönderiler alınamadı');
  }

  return response.json();
}

export async function getPostsByUserId(studentId, page = 1) {
  const token = localStorage.getItem('token');

  const url = new URL(`${API_BASE_URL}/Post/user/${studentId}/posts`);
  url.searchParams.append('page', page);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Kullanıcı gönderileri alınamadı');
  }

  return response.json();
}


// Post oluştur
export async function createPost(content) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/create-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Gönderi oluşturulamadı');
  }

  return response.json();
}

// Yorumu ekle
export async function addComment(postId, commentContent) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/${postId}/add-comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, commentContent }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Yorum eklenemedi');
  }

  return response.json();
}

// Beğeni işlemi
export async function toggleLike(postId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/toggle-like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Beğeni işlemi başarısız');
  }

  return response.json();
}

// Yorum sil
export async function deleteComment(commentId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/delete-comment/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Yorum silinemedi');
  }

  return response.json();
}

export async function deletePost(postId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Post/delete-post/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Gönderi silinemedi');
  }

  return response.json();
}


export async function getPagedAnnouncements(page = 1) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Admin/get-paged-announcements?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Duyurular alınamadı');
  }

  return response.json();
}

// Yeni: Duyuru sil (admin ise)
export async function deleteAnnouncement(announcementId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Admin/delete-announcement/${announcementId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Duyuru silinemedi');
  }

  return response.json();
}
