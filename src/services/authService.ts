
// Types for authentication
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  department?: string;
  commune?: string;
  photo?: string;
  role: 'client' | 'commercant' | 'fournisseur' | 'merchant' | 'supplier';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  bio?: string;
  birthdate?: string;
  photo?: File;
}

// API URL configuration
const API_URL = "http://localhost:3000/api"; // Ajustez selon votre configuration
console.log('API_URL configuré:', API_URL);

// Function to store token in localStorage
const setToken = (token: string): void => {
  console.log('Stockage du token dans localStorage');
  localStorage.setItem('bibocom_token', token);
};

// Function to retrieve token from localStorage
export const getToken = (): string | null => {
  const token = localStorage.getItem('bibocom_token');
  console.log('Récupération du token:', token ? 'Token présent' : 'Aucun token');
  return token;
};

// Function to remove token from localStorage
export const removeToken = (): void => {
  console.log('Suppression du token de localStorage');
  localStorage.removeItem('bibocom_token');
};

// Function to store user in localStorage
export const setUser = (user: User): void => {
  console.log('Stockage des informations utilisateur dans localStorage:', user);
  localStorage.setItem('bibocom_user', JSON.stringify(user));
};

// Function to retrieve user from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('bibocom_user');
  const user = userStr ? JSON.parse(userStr) : null;
  console.log('Récupération des informations utilisateur:', user);
  return user;
};

// Function to remove user from localStorage
export const removeUser = (): void => {
  console.log('Suppression des informations utilisateur de localStorage');
  localStorage.removeItem('bibocom_user');
};

// Function to make API requests
const apiRequest = async (url: string, method: string, data?: any) => {
  console.log(`Requête API: ${method} ${API_URL}${url}`, data ? 'avec données' : 'sans données');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Add token to headers if available
  const token = getToken();
  if (token) {
    console.log('Token ajouté aux en-têtes de la requête');
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log('Envoi de la requête...');
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    console.log(`Réponse reçue avec statut: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API:', errorData);
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    const responseData = await response.json();
    console.log('Données de réponse:', responseData);
    return responseData;
  } catch (error) {
    console.error('Erreur de requête API:', error);
    throw error;
  }
};

// Function to make API requests with FormData (for file uploads)
const apiFormRequest = async (url: string, method: string, formData: FormData) => {
  console.log(`Requête API FormData: ${method} ${API_URL}${url}`);
  
  const headers: HeadersInit = {};

  // Add token to headers if available
  const token = getToken();
  if (token) {
    console.log('Token ajouté aux en-têtes de la requête');
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log('Envoi de la requête avec FormData...');
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: formData
    });

    console.log(`Réponse reçue avec statut: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API:', errorData);
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    const responseData = await response.json();
    console.log('Données de réponse:', responseData);
    return responseData;
  } catch (error) {
    console.error('Erreur de requête API:', error);
    throw error;
  }
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Tentative de connexion avec email:', credentials.email);
    
    if (!credentials.email || !credentials.password) {
      console.error('Email ou mot de passe manquant');
      throw new Error("Email et mot de passe requis");
    }

    const response = await apiRequest('/auth/login', 'POST', credentials);
    
    if (response.token && response.user) {
      console.log('Connexion réussie pour:', response.user.email);
      console.log('Rôle utilisateur:', response.user.role);
      
      // Store authentication data
      setToken(response.token);
      setUser(response.user);
      return response;
    } else {
      console.error('Réponse de connexion invalide:', response);
      throw new Error("Réponse de connexion invalide");
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Function to verify token validity
export const verifyToken = async (): Promise<User | null> => {
  console.log('Vérification de la validité du token');
  try {
    const response = await apiRequest('/auth/verify-token', 'GET');
    console.log('Token valide, utilisateur:', response.user);
    return response.user;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    // If token verification fails, clean up
    logout();
    return null;
  }
};

// Function to get user profile
export const getUserProfile = async (): Promise<User> => {
  console.log('Récupération du profil utilisateur');
  try {
    const response = await apiRequest('/auth/profile', 'GET');
    console.log('Profil utilisateur récupéré:', response.user);
    
    // Update local storage with fresh user data
    if (response.user) {
      setUser(response.user);
    }
    
    return response.user;
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (profileData: ProfileData): Promise<User> => {
  console.log('Mise à jour du profil utilisateur avec données:', profileData);
  try {
    // If there's a photo, use FormData
    if (profileData.photo) {
      const formData = new FormData();
      
      // Add all profile fields to formData
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'photo' && value instanceof File) {
            formData.append('photo', value);
          } else if (typeof value === 'string') {
            formData.append(key, value);
          }
        }
      });
      
      console.log('Envoi des données de profil avec photo via FormData');
      const response = await apiFormRequest('/auth/profile', 'PUT', formData);
      
      if (response.user) {
        console.log('Profil mis à jour avec succès:', response.user);
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Réponse de mise à jour du profil invalide');
      }
    } else {
      // No photo, use regular JSON
      console.log('Envoi des données de profil via JSON');
      const response = await apiRequest('/auth/profile', 'PUT', profileData);
      
      if (response.user) {
        console.log('Profil mis à jour avec succès:', response.user);
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Réponse de mise à jour du profil invalide');
      }
    }
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    throw error;
  }
};

// Function to log out
export const logout = (): void => {
  console.log('Déconnexion de l\'utilisateur');
  // Optionally call the backend to invalidate the token
  try {
    if (getToken()) {
      console.log('Tentative d\'invalidation du token sur le serveur');
      apiRequest('/auth/logout', 'POST').catch(console.error);
    }
  } finally {
    removeToken();
    removeUser();
    console.log('Déconnexion terminée, données locales effacées');
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authenticated = getToken() !== null;
  console.log('Vérification de l\'authentification:', authenticated ? 'Authentifié' : 'Non authentifié');
  return authenticated;
};

// Function to get the current user's role
export const getUserRole = (): string | null => {
  const user = getUser();
  const role = user ? user.role : null;
  console.log('Récupération du rôle utilisateur:', role);
  return role;
};
