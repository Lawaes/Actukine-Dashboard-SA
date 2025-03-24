"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/lib/api';
import { User, AuthData, AuthState, AuthContextType } from '@/types';

// Définir l'état initial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null
};

// Types d'actions pour le reducer
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Créer le reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Créer le contexte
interface AuthContextProps {
  authState: AuthState;
  login: (data: AuthData) => Promise<void>;
  register: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Composant fournisseur du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getCurrentUser();
          if (response.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
          } else {
            authService.logout();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (data: AuthData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(data);
      if (response.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message || 'Échec de la connexion' });
      }
    } catch (error: any) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Échec de la connexion'
      });
    }
  };

  // Fonction d'inscription
  const register = async (data: AuthData): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await authService.register(data);
      if (response.success) {
        dispatch({ type: 'REGISTER_SUCCESS' });
      } else {
        dispatch({ 
          type: 'REGISTER_FAILURE', 
          payload: response.message || 'Échec de l\'inscription'
        });
      }
    } catch (error: any) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error.response?.data?.message || 'Échec de l\'inscription'
      });
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    authState: state,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 