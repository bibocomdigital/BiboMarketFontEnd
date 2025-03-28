
// Types for authentication
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'commercant' | 'fournisseur';
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
