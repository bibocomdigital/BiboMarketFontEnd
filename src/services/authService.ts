
// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Définition des rôles utilisateur
export enum UserRole { 
  CLIENT = 'CLIENT', 
  MERCHANT = 'MERCHANT', 
  SUPPLIER = 'SUPPLIER' 
}

// Labels à afficher pour chaque rôle
export const USER_ROLE_LABELS: Record<UserRole, string> = { 
  [UserRole.CLIENT]: 'Client', 
  [UserRole.MERCHANT]: 'Commerçant', 
  [UserRole.SUPPLIER]: 'Fournisseur' 
};

// Interface pour les données utilisateur
export interface User { 
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photo?: string;
  phoneNumber?: string;
  isVerified: boolean;
  country?: string;
  city?: string;
  department?: string;
  commune?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

/**
 * Type pour les données de profil
 */
export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  photo?: File;
  city?: string;
  country?: string;
}

/**
 * Vérifie si un email existe déjà
 */
export const checkEmailExists = async (email: string): Promise<{ exists: boolean }> => {
  try {
    console.log('🔍 [API] Vérification si l\'email existe:', email);
    const response = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 [API] Statut de la réponse de vérification d\'email:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur lors de la vérification de l\'email:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la vérification de l\'email');
    }

    const data = await response.json();
    console.log('✅ [API] Vérification de l\'email réussie:', data);
    
    // Log supplémentaire pour indiquer si l'email existe
    if (data.exists) {
      console.warn('⚠️ [API] Cet email existe déjà dans la base de données');
    } else {
      console.log('✅ [API] Cet email est disponible');
    }
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification de l\'email:', error);
    throw error;
  }
};

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (formData: FormData): Promise<{
  message: string;
  email: string;
}> => {
  try {
    console.log('🔄 [API] Préparation des données d\'inscription');
    
    // Obtenir les valeurs du FormData pour les logs (sans mot de passe)
    const formDataEntries = Object.fromEntries(formData.entries());
    const safeLogData = { ...formDataEntries };
    if (safeLogData.password) safeLogData.password = '[HIDDEN]';
    
    console.log('📤 [API] Envoi des données d\'inscription:', safeLogData);
    console.log('📤 [API] URL d\'inscription:', `${API_URL}/auth/register`);
    
    // S'assurer que tous les champs requis sont présents dans le FormData
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'role'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        console.error(`❌ [API] Champ requis manquant: ${field}`);
        throw new Error(`Le champ ${field} est requis pour l'inscription`);
      }
    }

    // Vérifier si le mot de passe est défini et valide
    const password = formData.get('password');
    if (!password || typeof password !== 'string' || password.length < 6) {
      console.error('❌ [API] Mot de passe invalide');
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    // Simuler une inscription réussie pour contourner l'erreur du serveur
    // Cette partie est temporaire jusqu'à ce que le problème côté serveur soit résolu
    if (import.meta.env.DEV && API_URL.includes('localhost')) {
      console.log('⚠️ [API] Mode développement: simulation d\'inscription réussie');
      
      // Attendre un court délai pour simuler le temps de réponse du serveur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const email = formData.get('email') as string;
      return {
        message: "Inscription réussie. Un code de vérification a été envoyé à votre email.",
        email
      };
    }
    
    // Appel API réel si nous ne sommes pas en mode simulation
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, il sera automatiquement défini avec le boundary pour FormData
    });

    console.log('📊 [API] Statut de la réponse d\'inscription:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur d\'inscription:', errorData);
      
      // Vérifier si l'erreur est due à un email déjà existant
      if (errorData.message && errorData.message.includes('déjà enregistré')) {
        console.error('❌ [API] Email déjà enregistré et vérifié');
        throw new Error('Cet email est déjà enregistré et vérifié.');
      }
      
      // Vérifier s'il s'agit de l'erreur 'hashedPassword is not defined'
      if (errorData.error && errorData.error.includes('hashedPassword is not defined')) {
        console.error('❌ [API] Erreur côté serveur avec le hachage du mot de passe');
        throw new Error('Erreur lors du traitement de votre mot de passe. Veuillez réessayer.');
      }
      
      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    console.log('✅ [API] Inscription réussie:', data);
    console.log('📧 [API] Un code de vérification a été envoyé à:', data.email);
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Vérifie le code envoyé par email et finalise l'inscription
 */
export const verifyCode = async (email: string, verificationCode: string): Promise<{
  message: string;
  user: User;
}> => {
  try {
    console.log('🔄 [API] Début de la vérification du code');
    console.log('📧 [API] Email:', email);
    console.log('🔑 [API] Code de vérification:', verificationCode);
    console.log('📤 [API] URL de vérification:', `${API_URL}/auth/verify-code`);
    
    // En mode DEV, simuler une vérification réussie
    if (import.meta.env.DEV && API_URL.includes('localhost')) {
      console.log('⚠️ [API] Mode développement: simulation de vérification réussie');
      
      // Pour le test, acceptons tous les codes "123456"
      if (verificationCode !== "123456") {
        console.error('❌ [API] Code de vérification incorrect en mode simulation');
        throw new Error('Code de vérification incorrect. Veuillez réessayer.');
      }
      
      // Attendre un court délai pour simuler le temps de réponse du serveur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Retourner un utilisateur simulé
      return {
        message: "Compte vérifié avec succès.",
        user: {
          id: 1,
          email: email,
          firstName: "Utilisateur",
          lastName: "Simulé",
          role: UserRole.CLIENT,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationCode }),
    });

    console.log('📊 [API] Statut de la réponse de vérification:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de vérification du code:', errorData);
      
      // Déterminer le type d'erreur pour personnaliser le message
      if (errorData.message && errorData.message.includes('expiré')) {
        console.error('⏰ [API] Code de vérification expiré');
        throw new Error('Code de vérification expiré. Veuillez vous réinscrire.');
      } else if (errorData.message && errorData.message.includes('incorrect')) {
        console.error('❌ [API] Code de vérification incorrect');
        throw new Error('Code de vérification incorrect. Veuillez réessayer.');
      } else if (errorData.message && errorData.message.includes('non trouvé')) {
        console.error('🔍 [API] Utilisateur non trouvé');
        throw new Error('Utilisateur non trouvé. Veuillez vous inscrire.');
      }
      
      throw new Error(errorData.message || 'Erreur lors de la vérification du code');
    }

    const data = await response.json();
    console.log('✅ [API] Vérification réussie:', data);
    console.log('👤 [API] Utilisateur vérifié:', data.user.email);
    console.log('👤 [API] Rôle de l\'utilisateur:', data.user.role);
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification du code:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur existant
 */
export const login = async (credentials: { email: string; password: string }): Promise<{
  token: string;
  user: User;
}> => {
  try {
    console.log('🔄 [API] Tentative de connexion pour:', credentials.email);
    
    // En mode DEV, simuler une connexion réussie
    if (import.meta.env.DEV && API_URL.includes('localhost')) {
      console.log('⚠️ [API] Mode développement: simulation de connexion réussie');
      
      // Attendre un court délai pour simuler le temps de réponse du serveur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = {
        id: 1,
        email: credentials.email,
        firstName: "Utilisateur",
        lastName: "Simulé",
        role: UserRole.CLIENT,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Simuler un token JWT
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Stocker le token et l'utilisateur dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    }
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📊 [API] Statut de la réponse de connexion:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de connexion:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    console.log('✅ [API] Connexion réussie pour:', data.user.email);
    
    // Stocker le token dans le localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = (): void => {
  try {
    console.log('🔄 [API] Déconnexion de l\'utilisateur');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ [API] Utilisateur déconnecté avec succès');
  } catch (error) {
    console.error('❌ [API] Erreur lors de la déconnexion:', error);
  }
};

/**
 * Vérifie si l'utilisateur est connecté
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

/**
 * Récupère l'utilisateur connecté
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

/**
 * Récupère l'utilisateur pour des raisons de compatibilité
 * @deprecated Utiliser getCurrentUser à la place
 */
export const getUser = (): User | null => {
  return getCurrentUser();
};

/**
 * Récupère le profil utilisateur détaillé
 */
export const getUserProfile = async (): Promise<ProfileData> => {
  try {
    console.log('🔄 [API] Récupération du profil utilisateur');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ [API] Tentative de récupération du profil sans token');
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 [API] Statut de la réponse du profil:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de récupération du profil:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    console.log('✅ [API] Profil utilisateur récupéré avec succès:', data);
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

/**
 * Met à jour le profil utilisateur
 */
export const updateUserProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  try {
    console.log('🔄 [API] Mise à jour du profil utilisateur');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ [API] Tentative de mise à jour du profil sans token');
      throw new Error('Non authentifié');
    }
    
    // Utiliser FormData pour pouvoir envoyer des fichiers
    const formData = new FormData();
    
    // Ajouter les champs du profil au FormData
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    
    // Log des données à envoyer (sans le fichier)
    const logData = { ...profileData };
    if (logData.photo) {
      logData.photo = '[FILE]' as any;
    }
    console.log('📤 [API] Données de profil à envoyer:', logData);
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type car il est automatiquement défini avec le boundary pour FormData
      },
      body: formData,
    });

    console.log('📊 [API] Statut de la réponse de mise à jour du profil:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de mise à jour du profil:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
    }

    const data = await response.json();
    console.log('✅ [API] Profil utilisateur mis à jour avec succès:', data);
    
    // Mettre à jour l'utilisateur stocké localement si nécessaire
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};
