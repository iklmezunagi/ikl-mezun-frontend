// src/services/StudentService.js

const API_BASE_URL = 'http://localhost:5142/api';

// Tüm kullanıcıları getir (admin erişimi)
export async function getAllUsers() {
  const response = await fetch(`${API_BASE_URL}/Student/get-all-users`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Kullanıcılar alınamadı');
  }
  return response.json();
}

// Mesleğe göre filtrele
export async function filterStudentsByProfession(professionKeyword) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Student/filter-by-profession/${professionKeyword}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Meslek filtreleme başarısız');
  }

  return response.json();
}

// Üniversiteye göre filtrele
export async function filterStudentsByUniversity(universityName) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Student/filter-by-university/${universityName}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Üniversite filtreleme başarısız');
  }

  return response.json();
}

// Anahtar kelime ile öğrenci ara
export async function searchStudents(keyword) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Student/search-student/${keyword}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Öğrenci aranamadı');
  }

  return response.json();
}

// Kullanıcı profilini username ile getir
export async function getStudentProfileByUsername(username) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Student/visit-profile/by-username/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Profil alınamadı');
  }

  return response.json();
}


// Profil düzenle
export async function editProfile(profileData) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/Student/edit-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Profil güncellenemedi');
  }

  return response.json();
}


