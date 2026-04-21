// ─── api.js ─── Central API layer ───────────────────────────────────────────
const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = (isFormData = false) => {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) h['Content-Type'] = 'application/json';
  return h;
};

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// AUTH
export const registerUser = (body) =>
  fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleRes);

export const loginUser = (body) =>
  fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleRes);

export const getMe = () =>
  fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handleRes);

// CLASSES
export const getAllClasses = () =>
  fetch(`${BASE_URL}/classes`).then(handleRes);

export const createClass = (body) =>
  fetch(`${BASE_URL}/classes`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const getMyClasses = () =>
  fetch(`${BASE_URL}/classes/my`, { headers: headers() }).then(handleRes);

// CONTENT
export const getContent = (classId = '') =>
  fetch(`${BASE_URL}/content${classId ? `?classId=${classId}` : ''}`, { headers: headers() }).then(handleRes);

export const uploadContent = (formData) =>
  fetch(`${BASE_URL}/content`, { method: 'POST', headers: headers(true), body: formData }).then(handleRes);

export const deleteContent = (id) =>
  fetch(`${BASE_URL}/content/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);

// QUIZ
export const getQuizzes = (classId = '') =>
  fetch(`${BASE_URL}/quiz${classId ? `?classId=${classId}` : ''}`, { headers: headers() }).then(handleRes);

export const getQuiz = (id) =>
  fetch(`${BASE_URL}/quiz/${id}`, { headers: headers() }).then(handleRes);

export const createQuiz = (body) =>
  fetch(`${BASE_URL}/quiz`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const submitQuiz = (id, answers) =>
  fetch(`${BASE_URL}/quiz/${id}/submit`, { method: 'POST', headers: headers(), body: JSON.stringify({ answers }) }).then(handleRes);

export const getQuizResult = (id) =>
  fetch(`${BASE_URL}/quiz/${id}/result`, { headers: headers() }).then(handleRes);

export const deleteQuiz = (id) =>
  fetch(`${BASE_URL}/quiz/${id}`, { method: 'DELETE', headers: headers() }).then(handleRes);
