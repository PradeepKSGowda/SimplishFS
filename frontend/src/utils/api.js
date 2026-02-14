import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const lessonApi = {
    getAll: () => api.get('/lessons'),
    upload: (formData) => api.post('/lessons/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/lessons/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/lessons/${id}`),
};

export const assessmentApi = {
    getByLesson: (lessonId) => api.get(`/assessments/lesson/${lessonId}`),
    upsertQuestions: (lessonId, questions) => api.post(`/assessments/lesson/${lessonId}/questions`, { questions }),
    submit: (formData) => api.post('/assessments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    processMedia: (formData) => api.post('/assessments/process-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export default api;
