import axios from 'axios';
import { LoginFormData, RegisterFormData, PostFormData } from '@/types';

// Définition de l'URL de base de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  // Connexion
  login: async (data: LoginFormData) => {
    const response = await api.post('/users/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  // Inscription
  register: async (data: RegisterFormData) => {
    return api.post('/users/register', data);
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    return api.get('/users/profile');
  },
};

// Services pour les posts
export const postService = {
  // Récupérer tous les posts
  getPosts: async (filters = {}) => {
    return api.get('/posts', { params: filters });
  },

  // Récupérer un post par son ID
  getPost: async (id: number) => {
    return api.get(`/posts/${id}`);
  },

  // Créer un nouveau post
  createPost: async (data: PostFormData) => {
    return api.post('/posts', data);
  },

  // Mettre à jour un post
  updatePost: async (id: number, data: PostFormData) => {
    return api.put(`/posts/${id}`, data);
  },

  // Supprimer un post
  deletePost: async (id: number) => {
    return api.delete(`/posts/${id}`);
  },

  // Récupérer les tâches assignées à l'utilisateur connecté
  getUserTasks: async () => {
    return api.get('/posts/tasks');
  },

  // Valider une tâche (visuel ou relecture)
  validateTask: async (id: number, taskType: 'visual' | 'review') => {
    return api.put(`/posts/${id}/validate`, { taskType });
  },
};

// Services pour les utilisateurs (admin)
export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async () => {
    return api.get('/users');
  },

  // Récupérer un utilisateur par son ID
  getUser: async (id: number) => {
    return api.get(`/users/${id}`);
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: number, data: any) => {
    return api.put(`/users/${id}`, data);
  },

  // Supprimer un utilisateur
  deleteUser: async (id: number) => {
    return api.delete(`/users/${id}`);
  },
};

export default api; 