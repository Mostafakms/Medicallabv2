import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Patients API
export const getPatients = () => api.get('/patients');
export const getPatient = (id: string) => api.get(`/patients/${id}`);
export const createPatient = (data: any) => api.post('/patients', data);
export const updatePatient = (id: string, data: any) => api.put(`/patients/${id}`, data);
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);
export const getPatientSamples = (id: string) => api.get(`/patients/${id}/samples`);
export const searchPatients = (name: string) => api.get(`/patients/search?name=${name}`); // Added searchPatients API call

// Samples API
export const getSamples = () => api.get('/samples');
export const getSample = (id: string) => api.get(`/samples/${id}`);
export const createSample = (data: any) => api.post('/samples', data);
export const updateSample = (id: string, data: any) => api.put(`/samples/${id}`, data);
export const deleteSample = (id: string) => api.delete(`/samples/${id}`);
export const getSampleTests = (id: string) => api.get(`/samples/${id}/tests`);
export const addTestsToSample = (id: string, data: any) => api.post(`/samples/${id}/tests`, data);
export const updateSampleTest = (sampleId: string, testId: string, data: any) => 
  api.put(`/samples/${sampleId}/tests/${testId}`, data);

// Tests API
export const getTests = () => api.get('/tests');
export const getTest = (id: string) => api.get(`/tests/${id}`);
export const createTest = (data: any) => api.post('/tests', data);
export const updateTest = (id: string, data: any) => api.put(`/tests/${id}`, data);
export const deleteTest = (id: string) => api.delete(`/tests/${id}`);

export default api;
