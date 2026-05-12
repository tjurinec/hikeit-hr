import axios from 'axios';
import type { Excursion, GalleryImage } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Postavi Basic Auth kredencijale za admin pozive
export function setAdminAuth(username: string, password: string) {
  api.defaults.auth = { username, password };
}

export function clearAdminAuth() {
  delete api.defaults.auth;
}

export const excursionsApi = {
  getAll: () => api.get<Excursion[]>('/excursions').then(r => r.data),
  getBySlug: (slug: string) => api.get<Excursion>(`/excursions/${slug}`).then(r => r.data),
  getFeatured: () => api.get<Excursion[]>('/excursions/featured').then(r => r.data),
  create: (data: unknown) => api.post<Excursion>('/excursions', data).then(r => r.data),
  update: (id: number, data: unknown) => api.put<Excursion>(`/excursions/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/excursions/${id}`),
};

export const galleryApi = {
  getAll: () => api.get<GalleryImage[]>('/gallery').then(r => r.data),
};

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string }>('/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.url);
  },
};

export default api;
