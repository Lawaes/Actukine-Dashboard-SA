import axios from 'axios';
import { ApiResponse, User, AuthData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Service pour gérer les opérations liées à l'authentification
const authService = {
  // Connecter un utilisateur
  login: async (data: AuthData): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    // Stocker le token d'authentification
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token);
      // Configurer axios pour envoyer le token dans les requêtes futures
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    }
    return response.data;
  },
  
  // Inscrire un nouvel utilisateur
  register: async (data: AuthData): Promise<ApiResponse<User>> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },
  
  // Déconnecter l'utilisateur
  logout: async (): Promise<void> => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return localStorage.getItem('authToken') !== null;
  },
  
  // Récupérer le token d'authentification
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
  
  // Récupérer les informations de l'utilisateur actuel
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  }
};

// Configurer axios avec le token s'il existe déjà
const token = localStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService; 