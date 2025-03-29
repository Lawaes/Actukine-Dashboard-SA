import axios from 'axios';
import { ApiResponse, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Service pour gérer les opérations liées aux utilisateurs
const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },
  
  // Récupérer un utilisateur par son ID
  getUser: async (id: number): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },
  
  // Récupérer le profil de l'utilisateur courant
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },
  
  // Mettre à jour le profil de l'utilisateur
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  },
  
  // Mettre à jour un utilisateur (admin)
  updateUser: async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },
  
  // Supprimer un utilisateur
  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  }
};

export default userService; 