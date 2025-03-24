// Interface pour les réponses d'API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interface utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les données d'authentification
export interface AuthData {
  email: string;
  password: string;
  username?: string;
}

// Interface pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: AuthData) => Promise<void>;
  register: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// État d'authentification
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Interface pour les données de post dans un formulaire
export interface PostFormData {
  title: string;
  description?: string;
  imageUrl?: string;
  status: 'brouillon' | 'planifié' | 'publié';
  publishDate?: string;
  platforms?: string[];
  postType?: string;
  visualResponsibleId?: number;
  reviewResponsibleId?: number;
}

// Interface pour un post complet
export interface Post extends PostFormData {
  id: number;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
  visualResponsible?: User;
  reviewResponsible?: User;
  visualValidated?: boolean;
  reviewValidated?: boolean;
}

// Interface pour les filtres de post
export interface PostFilters {
  status?: string;
  platform?: string;
  type?: string;
  search?: string;
}

// Interface pour les données d'enregistrement
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
} 