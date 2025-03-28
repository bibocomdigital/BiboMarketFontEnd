
import { toast } from "@/hooks/use-toast";

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

// API URL configuration - replace with your actual backend URL when deployed
const API_URL = "http://localhost:3000/api";

// Helper function to handle API errors
const handleApiError = (error: any): string => {
  console.error("API Error:", error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || "Une erreur est survenue lors de la communication avec le serveur";
  } else if (error.request) {
    // The request was made but no response was received
    return "Impossible de joindre le serveur. Veuillez vérifier votre connexion internet.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return "Une erreur est survenue lors de la préparation de la requête";
  }
};

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

// Mock login function for testing - replace with actual API call when backend is ready
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // For now, we'll create a mock response
  try {
    // This is where you would normally make the API call:
    // const response = await axios.post(`${API_URL}/auth/login`, credentials);
    // return response.data;

    // Instead, let's simulate the API response based on the provided email
    // This is for testing purposes only
    if (!credentials.email || !credentials.password) {
      throw new Error("Email et mot de passe requis");
    }

    // Mock roles based on email prefix for testing
    let role: 'client' | 'commercant' | 'fournisseur' = 'client';
    if (credentials.email.startsWith('commercant')) {
      role = 'commercant';
    } else if (credentials.email.startsWith('fournisseur')) {
      role = 'fournisseur';
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockResponse: AuthResponse = {
      token: "mock_jwt_token_for_testing_purposes",
      user: {
        id: 1,
        email: credentials.email,
        firstName: "Utilisateur",
        lastName: "Test",
        role: role
      },
      message: "Connexion réussie"
    };

    // Store authentication data
    setToken(mockResponse.token);
    setUser(mockResponse.user);

    return mockResponse;
  } catch (error: any) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Function to log out
export const logout = (): void => {
  removeToken();
  removeUser();
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

// Function to verify auth token with the backend
export const verifyToken = async (): Promise<boolean> => {
  // For now, we'll just check if the token exists in localStorage
  // In a real implementation, you would verify the token with the backend
  return isAuthenticated();
};
