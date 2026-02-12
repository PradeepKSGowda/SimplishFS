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
};

export const assessmentApi = {
    getByLesson: (lessonId) => api.get(`/assessments/lesson/${lessonId}`),
    submit: (payload) => api.post('/assessments/submit', payload),
    processMedia: (formData) => api.post('/assessments/process-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;
