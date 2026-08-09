import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  forgotPassword: (emailData) => API.post('/auth/forgot-password', emailData),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (profileData) => API.put('/auth/profile', profileData),
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData)
};

export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getLatest: () => API.get('/resume/latest')
};

export const interviewAPI = {
  createTemplate: (data) => API.post('/interview/template/create', data),
  publishTemplate: (data) => API.post('/interview/template/publish', data),
  getInterviewerTemplates: () => API.get('/interview/template/my-interviews'),
  getTemplateByCode: (code) => API.get(`/interview/template/code/${code}`),
  getTemplateSubmissions: (code) => API.get(`/interview/template/${code}/submissions`),

  start: (config) => API.post('/interview/start', config),
  submitAnswer: (payload) => API.post('/interview/answer', payload),
  finish: (payload) => API.post('/interview/finish', payload),
  getById: (id) => API.get(`/interview/${id}`),
  getHistory: () => API.get('/interview/history')
};

export default API;
