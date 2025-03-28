
import { RegisterFormValues } from "@/components/forms/RegisterForm";

// Configuration de l'API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (formData: FormData): Promise<{
  message: string;
  email: string;
}> => {
  try {
    console.log('🌐 [API] Envoi des données d\'inscription au backend');
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, il sera automatiquement défini avec le boundary pour FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur d\'inscription:', errorData);
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur de vérification:', errorData);
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [API] Erreur lors de la vérification de l\'email:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la vérification de l\'email');
    }

    const data = await response.json();
    console.log('✅ [API] Vérification de l\'email réussie:', data);
    return data;
  } catch (error) {
    console.error('❌ [API] Erreur lors de la vérification de l\'email:', error);
    throw error;
  }
};
