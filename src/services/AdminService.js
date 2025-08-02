// src/services/AdminService.js
const API_BASE_URL = 'http://localhost:5142/api';
const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

// 1. Admin yap
export async function giveAdmin(username) {
  const response = await fetch(`${API_BASE_URL}/Admin/give-admin/${username}`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) throw new Error('Admin yetkisi verilemedi.');
  return response.json();
}

// 2. Adminlikten çıkar
export async function revokeAdmin(username) {
  const response = await fetch(`${API_BASE_URL}/Admin/revoke-admin/${username}`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) throw new Error('Admin yetkisi kaldırılamadı.');
  return response.json();
}

// 3. Duyuru oluştur
    export async function createAnnouncement(title, content) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/Admin/create-announcement`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }), // sadece gerekli alanlar
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.failMessage || 'Duyuru oluşturulamadı');
    }

    return response.json();
    }



export async function getAllAnnouncements() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Admin/get-all-announcements`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Duyurular alınamadı.');
  }
  return response.json();
}

// 5. Duyuru sil
export async function deleteAnnouncement(id) {
  const response = await fetch(`${API_BASE_URL}/Admin/delete-announcement/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) throw new Error('Duyuru silinemedi.');
  return response.json();
}
