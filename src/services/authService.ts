
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

// Function to store token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('bibocom_token', token);
};

// Function to retrieve token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('bibocom_token');
};

// Function to remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('bibocom_token');
};

// Function to store user in localStorage
export const setUser = (user: User): void => {
  localStorage.setItem('bibocom_user', JSON.stringify(user));
};

// Function to retrieve user from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('bibocom_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Function to remove user from localStorage
export const removeUser = (): void => {
  localStorage.removeItem('bibocom_user');
};

// Function to make API requests
const apiRequest = async (url: string, method: string, data?: any) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Add token to headers if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email et mot de passe requis");
    }

    const response = await apiRequest('/auth/login', 'POST', credentials);
    
    if (response.token && response.user) {
      // Store authentication data
      setToken(response.token);
      setUser(response.user);
      return response;
    } else {
      throw new Error("Réponse de connexion invalide");
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Function to verify token validity
export const verifyToken = async (): Promise<User | null> => {
  try {
    const response = await apiRequest('/auth/verify-token', 'GET');
    return response.user;
  } catch (error) {
    console.error('Token verification error:', error);
    // If token verification fails, clean up
    logout();
    return null;
  }
};

// Function to log out
export const logout = (): void => {
  // Optionally call the backend to invalidate the token
  try {
    if (getToken()) {
      apiRequest('/auth/logout', 'POST').catch(console.error);
    }
  } finally {
    removeToken();
    removeUser();
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Function to get the current user's role
export const getUserRole = (): string | null => {
  const user = getUser();
  return user ? user.role : null;
};
