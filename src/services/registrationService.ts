
import { RegisterFormValues } from "@/components/forms/RegisterForm";

// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (formData: FormData): Promise<{
  message: string;
  email: string;
}> => {
  try {
    console.log('🌐 [API] Envoi des données d\'inscription au backend', Object.fromEntries(formData.entries()));
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, il sera automatiquement défini avec le boundary pour FormData
    });

    console.log('🌐 [API] Statut de la réponse:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur d\'inscription:', errorData);
      
      // Vérifier si l'erreur est due à un email déjà existant
      if (errorData.message && errorData.message.includes('déjà enregistré')) {
        throw new Error('Cet email est déjà enregistré et vérifié.');
      }
      
      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    console.log('✅ [API] Inscription réussie:', data);
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
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}> => {
  try {
    console.log('🌐 [API] Vérification du code:', verificationCode, 'pour email:', email);
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationCode }),
    });

    console.log('🌐 [API] Statut de la réponse de vérification:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de vérification:', errorData);
      
      // Déterminer le type d'erreur pour personnaliser le message
      if (errorData.message && errorData.message.includes('expiré')) {
        throw new Error('Code de vérification expiré. Veuillez vous réinscrire.');
      } else if (errorData.message && errorData.message.includes('incorrect')) {
        throw new Error('Code de vérification incorrect. Veuillez réessayer.');
      }
      
      throw new Error(errorData.message || 'Erreur lors de la vérification du code');
    }

    const data = await response.json();
    console.log('✅ [API] Vérification réussie:', data);
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification du code:', error);
    throw error;
  }
};

/**
 * Vérifie si un email existe déjà
 */
export const checkEmailExists = async (email: string): Promise<{ exists: boolean }> => {
  try {
    console.log('🌐 [API] Vérification si l\'email existe:', email);
    const response = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🌐 [API] Statut de la réponse de vérification d\'email:', response.status);
    
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
