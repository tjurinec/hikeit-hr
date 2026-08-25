import axios from 'axios';
import type { Excursion, GalleryImage, Guide } from '../types';

// Bez globalnog Content-Typea: axios ga postavlja sam po tipu tijela
// (application/json za objekte, multipart/form-data s boundaryem za FormData).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
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
  // Admin: vraća i neobjavljene izlete
  getAllForAdmin: () => api.get<Excursion[]>('/excursions/admin/all').then(r => r.data),
  getByIdForAdmin: (id: number) => api.get<Excursion>(`/excursions/admin/${id}`).then(r => r.data),
  getBySlug: (slug: string) => api.get<Excursion>(`/excursions/${slug}`).then(r => r.data),
  getFeatured: () => api.get<Excursion[]>('/excursions/featured').then(r => r.data),
  create: (data: unknown) => api.post<Excursion>('/excursions', data).then(r => r.data),
  update: (id: number, data: unknown) => api.put<Excursion>(`/excursions/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/excursions/${id}`),
};

export const galleryApi = {
  getAll: () => api.get<GalleryImage[]>('/gallery').then(r => r.data),
  create: (data: unknown) => api.post<GalleryImage>('/gallery', data).then(r => r.data),
  update: (id: number, data: unknown) => api.put<GalleryImage>(`/gallery/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/gallery/${id}`),
};

export const guidesApi = {
  getAll: () => api.get<Guide[]>('/guides').then(r => r.data),
  create: (data: Omit<Guide, 'id'>) => api.post<Guide>('/guides', data).then(r => r.data),
  update: (id: number, data: Omit<Guide, 'id'>) => api.put<Guide>(`/guides/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/guides/${id}`),
};

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string }>('/upload/image', form).then(r => r.data.url);
  },
};

export default api;
