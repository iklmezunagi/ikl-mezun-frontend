// src/services/AuthService.js

// const API_BASE_URL = 'http://localhost:5142/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



export async function registerStudent(registerData) {
  const response = await fetch(`${API_BASE_URL}/Student/StudentRegister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Kayıt başarısız oldu');
  }
  return response.json();
}

export async function loginStudent(loginData) {
  const response = await fetch(`${API_BASE_URL}/Student/StudentLogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.failMessage || 'Giriş başarısız oldu');
  }
  return response.json();
}


