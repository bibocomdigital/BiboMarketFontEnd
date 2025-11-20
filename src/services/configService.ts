/**
 * Configuration globale de l'application
 */

// URL de l'API backend
export const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// Interface pour les erreurs d'API
export interface ApiError {
  message?: string;
  status?: number;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Vérifier si l'utilisateur est connecté
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Récupérer le token d'authentification
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Headers d'authentification pour les requêtes
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Fonction utilitaire pour gérer les erreurs de requête
export const handleApiError = (error: ApiError, defaultMessage: string = 'Une erreur est survenue'): never => {
  console.error(`${defaultMessage}:`, error);
  throw error;
};