// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || "https://ecommerce-2-uy2x.onrender.com/api";

// URL de base Cloudinary pour les images
export const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/yourdomain"; // À remplacer par votre domaine Cloudinary

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
  // photo?: File;
  city?: string;
  country?: string;
}

/**
 * Obtient l'URL complète d'une image stockée sur Cloudinary
 * @param photoPath Chemin partiel de l'image depuis l'API
 * @returns URL complète de l'image
 */
export const getPhotoUrl = (photoPath?: string): string => {
  if (!photoPath) return '';
  
  // Si l'URL est déjà complète (commence par http ou https), la retourner telle quelle
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // Si l'URL pointe vers Cloudinary
  if (photoPath.includes('cloudinary')) {
    // Si c'est une URL complète Cloudinary, la retourner telle quelle
    if (photoPath.startsWith('https://res.cloudinary.com')) {
      return photoPath;
    }
    
    // Si c'est un chemin partiel Cloudinary, construire l'URL complète
    return `${CLOUDINARY_BASE_URL}/${photoPath}`;
  }
  
  // Pour les anciennes images non-Cloudinary (pour compatibilité)
  return `${API_URL.replace('/api', '')}/uploads/${photoPath}`;
};

/**
 * Vérifie si un email existe déjà
 */
export const checkEmailExists = async (email: string): Promise<{ exists: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la vérification de l\'email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
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
    // S'assurer que tous les champs requis sont présents dans le FormData
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'role'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        throw new Error(`Le champ ${field} est requis pour l'inscription`);
      }
    }

    // Vérifier si le mot de passe est défini et valide
    const password = formData.get('password');
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    // Appel API pour l'inscription
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, il sera automatiquement défini avec le boundary pour FormData
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Vérifier si l'erreur est due à un email déjà existant
      if (errorData.message && errorData.message.includes('déjà utilisée')) {
        throw new Error('Cet email est déjà enregistré et vérifié.');
      }

      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

  /**
   * Vérifie si un email existe déjà (version simplifiée pour les composants)
   */
  export const handleCheckEmail = async (email: string, setEmailExists: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }

    try {
      const result = await checkEmailExists(email);
      setEmailExists(result.exists);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email :", error);
      setEmailExists(false);
    }
  };

  /**
   * Vérifie si un numéro de téléphone existe déjà
   */
  export const handleCheckPhone = async (phoneNumber: string, setPhoneExists: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setPhoneExists(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        setPhoneExists(false);
        return;
      }

      const data = await response.json();
      setPhoneExists(data.exists || false);
    } catch (error) {
      console.error("Erreur lors de la vérification du téléphone :", error);
      setPhoneExists(false);
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
    console.log('📤 [API] URL de vérification:', `${API_URL}/api/auth/verify`);
    
    // Préparer le body de la requête
    const body = JSON.stringify({ email, verificationCode });
    console.log('📤 [API] Body de la requête de vérification:', body);
    
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
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
 * Renvoie un code de vérification à l'utilisateur
 */
export const resendVerificationCode = async (email: string): Promise<{
  message: string;
}> => {
  try {
    console.log('🔄 [API] Demande de renvoi de code de vérification');
    console.log('📧 [API] Email:', email);
    console.log('📤 [API] URL de renvoi de code:', `${API_URL}/api/auth/resend-code`);
    
    const response = await fetch(`${API_URL}/auth/resend-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('📊 [API] Statut de la réponse de renvoi de code:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de renvoi de code:', errorData);
      
      if (errorData.message && errorData.message.includes('non trouvé')) {
        console.error('🔍 [API] Utilisateur non trouvé');
        throw new Error('Utilisateur non trouvé. Veuillez vous inscrire.');
      } else if (errorData.message && errorData.message.includes('vérifié')) {
        console.error('✅ [API] Compte déjà vérifié');
        throw new Error('Ce compte est déjà vérifié.');
      }
      
      throw new Error(errorData.message || 'Erreur lors du renvoi du code');
    }

    const data = await response.json();
    console.log('✅ [API] Renvoi de code réussi:', data);
    
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors du renvoi du code:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur existant
 */
export const login = async (credentials: { email?: string; password: string, phoneNumber?: string }): Promise<{
  token: string;
  user: User;
}> => {
  try {
    console.log('🔄 [API] Tentative de connexion pour:', credentials.email);
    
    // Désactivation du mode simulation - toujours utiliser l'API réelle
    console.log('📤 [API] URL de connexion:', `${API_URL}/api/auth/login`);
    console.log('📤 [API] Données envoyées:', { email: credentials.email, password: '********', phoneNumber: credentials.phoneNumber });

    
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
    console.log('👤 [API] Rôle de l\'utilisateur:', data.user.role);
    
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
    
    const response = await fetch(`${API_URL}/auth/profile`, {
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
    // Object.entries(profileData).forEach(([key, value]) => {
    //   if (value !== undefined) {
    //     formData.append(key, value as string | Blob);
    //   }
    // });
    
    // Log des données à envoyer (sans le fichier)
    // const logData = { ...profileData };
    // if (logData.photo) {
    //   logData.photo = '[FILE]' as any;
    // }
    // console.log('📤 [API] Données de profil à envoyer:', logData);
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    
    if (!response.ok) {
      const errorData = await response.json();
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