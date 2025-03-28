
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
console.log('🔄 [AUTH] API_URL configuré:', API_URL);

// Function to store token in localStorage
const setToken = (token: string): void => {
  console.log('📝 [AUTH] Stockage du token dans localStorage', token.substring(0, 15) + '...');
  localStorage.setItem('bibocom_token', token);
};

// Function to retrieve token from localStorage
export const getToken = (): string | null => {
  const token = localStorage.getItem('bibocom_token');
  console.log('🔍 [AUTH] Récupération du token:', token ? `${token.substring(0, 15)}...` : 'Aucun token');
  return token;
};

// Function to remove token from localStorage
export const removeToken = (): void => {
  console.log('🗑️ [AUTH] Suppression du token de localStorage');
  localStorage.removeItem('bibocom_token');
};

// Function to store user in localStorage
export const setUser = (user: User): void => {
  console.log('📝 [AUTH] Stockage des informations utilisateur dans localStorage:', user);
  console.log('👤 [AUTH] Rôle utilisateur stocké:', user.role);
  localStorage.setItem('bibocom_user', JSON.stringify(user));
};

// Function to retrieve user from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('bibocom_user');
  if (!userStr) {
    console.log('❌ [AUTH] Aucun utilisateur trouvé dans localStorage');
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    console.log('👤 [AUTH] Utilisateur récupéré depuis localStorage:', user);
    console.log('👤 [AUTH] Rôle utilisateur récupéré:', user.role);
    return user;
  } catch (error) {
    console.error('❌ [AUTH] Erreur lors du parsing des données utilisateur:', error);
    return null;
  }
};

// Function to remove user from localStorage
export const removeUser = (): void => {
  console.log('🗑️ [AUTH] Suppression des informations utilisateur de localStorage');
  localStorage.removeItem('bibocom_user');
};

// Function to make API requests
const apiRequest = async (url: string, method: string, data?: any) => {
  console.log(`🌐 [AUTH API] Requête: ${method} ${API_URL}${url}`, data ? {
    ...data, 
    password: data.password ? '********' : undefined
  } : 'sans données');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Add token to headers if available
  const token = getToken();
  if (token) {
    console.log('🔑 [AUTH API] Token ajouté aux en-têtes de la requête');
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('⚠️ [AUTH API] Aucun token disponible pour la requête');
  }

  try {
    console.log('📤 [AUTH API] Envoi de la requête...');
    const startTime = performance.now();
    
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    const endTime = performance.now();
    console.log(`⏱️ [AUTH API] Temps de réponse: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`📥 [AUTH API] Réponse reçue avec statut: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [AUTH API] Erreur API:', errorData);
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    const responseData = await response.json();
    console.log('✅ [AUTH API] Données de réponse:', responseData);
    return responseData;
  } catch (error) {
    console.error('❌ [AUTH API] Erreur de requête API:', error);
    throw error;
  }
};

// Function to make API requests with FormData (for file uploads)
const apiFormRequest = async (url: string, method: string, formData: FormData) => {
  console.log(`🌐 [AUTH API FORM] Requête FormData: ${method} ${API_URL}${url}`);
  
  // Log FormData contents (excluding file content details)
  const formDataEntries: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      formDataEntries[key] = `File: ${value.name} (${value.size} bytes)`;
    } else {
      formDataEntries[key] = value;
    }
  });
  console.log('📦 [AUTH API FORM] Contenu du FormData:', formDataEntries);
  
  const headers: HeadersInit = {};

  // Add token to headers if available
  const token = getToken();
  if (token) {
    console.log('🔑 [AUTH API FORM] Token ajouté aux en-têtes de la requête');
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('⚠️ [AUTH API FORM] Aucun token disponible pour la requête');
  }

  try {
    console.log('📤 [AUTH API FORM] Envoi de la requête avec FormData...');
    const startTime = performance.now();
    
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: formData
    });

    const endTime = performance.now();
    console.log(`⏱️ [AUTH API FORM] Temps de réponse: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`📥 [AUTH API FORM] Réponse reçue avec statut: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [AUTH API FORM] Erreur API:', errorData);
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    const responseData = await response.json();
    console.log('✅ [AUTH API FORM] Données de réponse:', responseData);
    return responseData;
  } catch (error) {
    console.error('❌ [AUTH API FORM] Erreur de requête API:', error);
    throw error;
  }
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🔐 [AUTH] Tentative de connexion avec email:', credentials.email);
    console.log('📝 [AUTH] Données de connexion complètes:', { email: credentials.email, password: '********' });
    
    if (!credentials.email || !credentials.password) {
      console.error('❌ [AUTH] Email ou mot de passe manquant');
      throw new Error("Email et mot de passe requis");
    }

    const response = await apiRequest('/auth/login', 'POST', credentials);
    
    if (response.token && response.user) {
      console.log('✅ [AUTH] Connexion réussie pour:', response.user.email);
      console.log('👤 [AUTH] Rôle utilisateur:', response.user.role);
      console.log('👤 [AUTH] ID utilisateur:', response.user.id);
      console.log('🧾 [AUTH] Données utilisateur complètes:', response.user);
      
      // Store authentication data
      setToken(response.token);
      setUser(response.user);
      return response;
    } else {
      console.error('❌ [AUTH] Réponse de connexion invalide:', response);
      throw new Error("Réponse de connexion invalide");
    }
  } catch (error: any) {
    console.error('❌ [AUTH] Erreur de connexion:', error);
    throw error;
  }
};

// Function to verify token validity
export const verifyToken = async (): Promise<User | null> => {
  console.log('🔍 [AUTH] Vérification de la validité du token');
  try {
    const response = await apiRequest('/auth/verify-token', 'GET');
    console.log('✅ [AUTH] Token valide, utilisateur:', response.user);
    return response.user;
  } catch (error) {
    console.error('❌ [AUTH] Erreur de vérification du token:', error);
    // If token verification fails, clean up
    logout();
    return null;
  }
};

// Function to get user profile
export const getUserProfile = async (): Promise<User> => {
  console.log('👤 [AUTH] Récupération du profil utilisateur');
  try {
    const response = await apiRequest('/auth/profile', 'GET');
    console.log('✅ [AUTH] Profil utilisateur récupéré:', response.user);
    
    // Update local storage with fresh user data
    if (response.user) {
      console.log('📝 [AUTH] Mise à jour des données utilisateur en localStorage');
      setUser(response.user);
    }
    
    return response.user;
  } catch (error) {
    console.error('❌ [AUTH] Erreur de récupération du profil:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (profileData: ProfileData): Promise<User> => {
  console.log('✏️ [AUTH] Mise à jour du profil utilisateur avec données:', {
    ...profileData,
    photo: profileData.photo ? `File: ${profileData.photo.name} (${profileData.photo.size} bytes)` : undefined
  });
  
  try {
    // If there's a photo, use FormData
    if (profileData.photo) {
      const formData = new FormData();
      
      // Add all profile fields to formData
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'photo' && value instanceof File) {
            console.log(`📎 [AUTH] Ajout du fichier photo au FormData: ${value.name} (${value.size} bytes)`);
            formData.append('photo', value);
          } else if (typeof value === 'string') {
            console.log(`📝 [AUTH] Ajout du champ ${key} au FormData: ${value}`);
            formData.append(key, value);
          }
        }
      });
      
      console.log('📤 [AUTH] Envoi des données de profil avec photo via FormData');
      const response = await apiFormRequest('/auth/profile', 'PUT', formData);
      
      if (response.user) {
        console.log('✅ [AUTH] Profil mis à jour avec succès (avec photo):', response.user);
        setUser(response.user);
        return response.user;
      } else {
        console.error('❌ [AUTH] Réponse de mise à jour du profil invalide:', response);
        throw new Error('Réponse de mise à jour du profil invalide');
      }
    } else {
      // No photo, use regular JSON
      console.log('📤 [AUTH] Envoi des données de profil via JSON');
      const response = await apiRequest('/auth/profile', 'PUT', profileData);
      
      if (response.user) {
        console.log('✅ [AUTH] Profil mis à jour avec succès:', response.user);
        setUser(response.user);
        return response.user;
      } else {
        console.error('❌ [AUTH] Réponse de mise à jour du profil invalide:', response);
        throw new Error('Réponse de mise à jour du profil invalide');
      }
    }
  } catch (error) {
    console.error('❌ [AUTH] Erreur de mise à jour du profil:', error);
    throw error;
  }
};

// Function to log out
export const logout = (): void => {
  console.log('🚪 [AUTH] Déconnexion de l\'utilisateur');
  // Optionally call the backend to invalidate the token
  try {
    if (getToken()) {
      console.log('🔄 [AUTH] Tentative d\'invalidation du token sur le serveur');
      apiRequest('/auth/logout', 'POST').catch(error => {
        console.error('⚠️ [AUTH] Erreur lors de l\'invalidation du token:', error);
      });
    }
  } finally {
    removeToken();
    removeUser();
    console.log('✅ [AUTH] Déconnexion terminée, données locales effacées');
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const authenticated = token !== null;
  console.log('🔍 [AUTH] Vérification de l\'authentification:', authenticated ? 'Authentifié' : 'Non authentifié');
  if (authenticated) {
    console.log('🔑 [AUTH] Token présent:', token ? `${token.substring(0, 15)}...` : 'Aucun token');
    
    const user = getUser();
    if (user) {
      console.log('👤 [AUTH] Utilisateur authentifié:', user.email);
      console.log('👤 [AUTH] Rôle utilisateur:', user.role);
    } else {
      console.log('⚠️ [AUTH] Token présent mais aucun utilisateur en localStorage');
    }
  }
  return authenticated;
};

// Function to get the current user's role
export const getUserRole = (): string | null => {
  const user = getUser();
  const role = user ? user.role : null;
  console.log('👤 [AUTH] Récupération du rôle utilisateur:', role);
  
  if (role) {
    // Log additional role information for debugging
    console.log('🔍 [AUTH] Type de la valeur du rôle:', typeof role);
    console.log('🔍 [AUTH] Valeur exacte du rôle (minuscules):', role.toLowerCase());
    console.log('🔍 [AUTH] Est-ce "merchant"?', role.toLowerCase() === 'merchant');
    console.log('🔍 [AUTH] Est-ce "commercant"?', role.toLowerCase() === 'commercant');
    console.log('🔍 [AUTH] Est-ce "supplier"?', role.toLowerCase() === 'supplier');
    console.log('🔍 [AUTH] Est-ce "fournisseur"?', role.toLowerCase() === 'fournisseur');
  }
  
  return role;
};
