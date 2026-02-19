import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const classesAPI = {
  getAll: () => api.get('/classes'),
  create: (classData) => api.post('/classes', classData),
  getSpreadsheet: (classId) => api.get(`/classes/${classId}/spreadsheet`),
  updateCell: (classId, cellData) => api.put(`/classes/${classId}/cell`, cellData),
  bulkUpdate: (classId, marks) => api.post(`/classes/${classId}/bulk-update`, { marks }),
  finalize: (classId) => api.post(`/classes/${classId}/finalize`),
  getAnalytics: (classId) => api.get(`/classes/${classId}/analytics`),
  getBroadsheet: (classId) => api.get(`/classes/${classId}/broadsheet`),
  exportBroadsheet: (classId) => api.get(`/classes/${classId}/broadsheet/export`),
  addStudents: (classId, students) => api.post(`/classes/${classId}/students`, { students }),
  getStudentReport: (classId, studentId) => api.get(`/classes/${classId}/students/${studentId}/report`),
  getBulkReports: (classId) => api.get(`/classes/${classId}/bulk-reports`),
};

export const utilityAPI = {
  getLevels: () => api.get('/levels'),
  getSubjects: (levelId) => api.get(`/levels/${levelId}/subjects`),
  getTeachers: () => api.get('/teachers'),
};

export default api;
