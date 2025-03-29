import axios from 'axios';
import { ApiResponse, Post, PostFormData, PostFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Service pour gérer les opérations liées aux posts
const postService = {
  // Récupérer tous les posts avec filtres optionnels
  getPosts: async (filters?: PostFilters): Promise<ApiResponse<Post[]>> => {
    let url = `${API_URL}/posts`;
    
    // Ajouter les filtres à l'URL si présents
    if (filters) {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.platform) queryParams.append('platform', filters.platform);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const response = await axios.get(url);
    return response.data;
  },
  
  // Récupérer un post par son ID
  getPost: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    return response.data;
  },
  
  // Créer un nouveau post
  createPost: async (postData: PostFormData): Promise<ApiResponse<Post>> => {
    const response = await axios.post(`${API_URL}/posts`, postData);
    return response.data;
  },
  
  // Mettre à jour un post existant
  updatePost: async (id: number, postData: PostFormData): Promise<ApiResponse<Post>> => {
    const response = await axios.put(`${API_URL}/posts/${id}`, postData);
    return response.data;
  },
  
  // Supprimer un post
  deletePost: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axios.delete(`${API_URL}/posts/${id}`);
    return response.data;
  },
  
  // Changer le statut d'un post
  updateStatus: async (id: number, status: string): Promise<ApiResponse<Post>> => {
    const response = await axios.patch(`${API_URL}/posts/${id}/status`, { status });
    return response.data;
  },
  
  // Valider une tâche (visuel ou relecture)
  validateTask: async (id: number, taskType: 'visual' | 'review'): Promise<ApiResponse<Post>> => {
    const response = await axios.patch(`${API_URL}/posts/${id}/validate`, { taskType });
    return response.data;
  }
};

export default postService; 