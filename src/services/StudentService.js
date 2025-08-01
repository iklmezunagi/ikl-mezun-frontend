const API_BASE_URL = 'http://localhost:5142/api';


// Ana feed için öğrencileri getir (pagination destekli)
export async function getAllStudentsPaged(page) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Student/get-all-students-paged?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Kullanıcılar alınamadı');
  }

  return response.json();
}

export async function searchStudents(keyword, page) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Student/search-student/paged/${keyword}?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Öğrenci aranamadı');
  }
  return response.json();
}

export async function filterStudentsByUniversity(universityName, page) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Student/filter-by-university/paged/${universityName}?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Üniversite filtreleme başarısız');
  }
  return response.json();
}

export async function filterStudentsByProfession(professionKeyword, page) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Student/filter-by-profession/paged/${professionKeyword}?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Meslek filtreleme başarısız');
  }
  return response.json();
}


// Kullanıcı profilini username ile getir
export async function getStudentProfileByUsername(username) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/Student/visit-profile/by-username/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
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
