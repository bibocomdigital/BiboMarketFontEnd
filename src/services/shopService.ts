/**
 * Service dédié à la gestion des boutiques côté frontend
 */

// Obtenir l'URL du backend depuis l'environnement ou utiliser la valeur par défaut
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Définition des constantes pour les rôles utilisateur
export enum UserRole {
  CLIENT = 'CLIENT',
  MERCHANT = 'MERCHANT',
  SUPPLIER = 'SUPPLIER'
}

// Types pour les boutiques
export interface ShopImage {
  id: number;
  url: string;
  productId: number;
}

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  shopId: number;
  createdAt: string;
  updatedAt: string;
  images: ShopImage[];
}

export interface Shop {
  id: number;
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  logo: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopWithProducts extends Shop {
  products: ShopProduct[];
}

/**
 * Vérifie si l'utilisateur actuellement connecté est un commerçant
 * @returns {boolean} true si l'utilisateur est un commerçant, sinon false
 */
export const isMerchant = (): boolean => {
  try {
    // Vérifier si l'utilisateur est connecté
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('❌ [SHOP] Aucun utilisateur connecté');
      return false;
    }
    
    // Récupérer les informations de l'utilisateur
    const user = JSON.parse(userStr);
    
    // Vérifier si l'utilisateur a le rôle commerçant
    if (user.role === UserRole.MERCHANT) {
      console.log('✅ [SHOP] L\'utilisateur est un commerçant');
      return true;
    }
    
    console.error(`❌ [SHOP] L'utilisateur a le rôle ${user.role}, mais le rôle requis est ${UserRole.MERCHANT}`);
    return false;
  } catch (error) {
    console.error('❌ [SHOP] Erreur lors de la vérification du rôle:', error);
    return false;
  }
};

/**
 * Récupère le token d'authentification stocké dans le localStorage
 * @returns {string|null} Le token d'authentification ou null s'il n'existe pas
 */
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ [SHOP] Aucun token d\'authentification trouvé');
  }
  return token;
};

/**
 * Récupère les informations de la boutique pour l'utilisateur connecté
 * @returns {Promise<ShopWithProducts>} Les informations de la boutique avec ses produits
 */
export const getMyShop = async (): Promise<ShopWithProducts> => {
  try {
    console.log('🔄 [SHOP] Récupération de la boutique du commerçant');
    
    // Vérifier si l'utilisateur est un commerçant
    if (!isMerchant()) {
      throw new Error('Seuls les commerçants peuvent accéder à leur boutique');
    }
    
    // Récupérer le token d'authentification
    const token = getAuthToken();
    if (!token) {
      throw new Error('Vous devez être connecté pour accéder à votre boutique');
    }
    
    // Appeler l'API pour récupérer la boutique
    const response = await fetch(`${backendUrl}/api/shop/my-shop`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Vérifier si la réponse est au format texte ou JSON
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Erreur lors de la récupération de la boutique';
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      if (!response.ok) {
        errorMessage = data.message || errorMessage;
        console.error('❌ [SHOP] Erreur lors de la récupération de la boutique:', errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      const textResponse = await response.text();
      console.error('❌ [SHOP] Réponse non-JSON:', textResponse);
      throw new Error(errorMessage);
    }
    
    console.log('✅ [SHOP] Boutique récupérée avec succès:', data.shop.name);
    
    return {
      ...data.shop,
      products: data.products || []
    };
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle boutique pour l'utilisateur connecté
 * @param {Object} shopData Les données de la nouvelle boutique
 * @returns {Promise<Shop>} La boutique créée
 */
export const createShop = async (shopData: FormData): Promise<Shop> => {
  try {
    console.log('🔄 [SHOP] Création d\'une nouvelle boutique');
    
    // Vérifier si l'utilisateur est un commerçant
    if (!isMerchant()) {
      throw new Error('Seuls les commerçants peuvent créer une boutique');
    }
    
    // Récupérer le token d'authentification
    const token = getAuthToken();
    if (!token) {
      throw new Error('Vous devez être connecté pour créer une boutique');
    }
    
    // Log du contenu de FormData pour débugger
    console.log('📋 [SHOP] Contenu du FormData:');
    shopData.forEach((value, key) => {
      console.log(`   ${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
    });
    
    // Appeler l'API pour créer la boutique
    const response = await fetch(`${backendUrl}/api/shop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type car FormData le fait automatiquement avec la boundary
      },
      body: shopData
    });
    
    // Log de la réponse pour débugger
    console.log('🔄 [SHOP] Statut de la réponse:', response.status);
    
    // Récupérer le texte brut de la réponse
    const responseText = await response.text();
    console.log('🔄 [SHOP] Réponse brute:', responseText);
    
    // Essayer de parser la réponse comme du JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ [SHOP] Erreur lors du parsing de la réponse JSON:', e);
      throw new Error('Format de réponse invalide depuis le serveur');
    }
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      console.error('❌ [SHOP] Erreur lors de la création de la boutique:', data.message);
      throw new Error(data.message || 'Erreur lors de la création de la boutique');
    }
    
    console.log('✅ [SHOP] Boutique créée avec succès:', data.shop.name);
    
    return data.shop;
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Met à jour les informations d'une boutique existante
 * @param {number} shopId L'ID de la boutique à mettre à jour
 * @param {Object} shopData Les nouvelles données de la boutique
 * @returns {Promise<Shop>} La boutique mise à jour
 */
export const updateShop = async (shopId: number, shopData: FormData): Promise<Shop> => {
  try {
    console.log(`🔄 [SHOP] Mise à jour de la boutique ID ${shopId}`);
    
    // Vérifier si l'utilisateur est un commerçant
    if (!isMerchant()) {
      throw new Error('Seuls les commerçants peuvent mettre à jour une boutique');
    }
    
    // Récupérer le token d'authentification
    const token = getAuthToken();
    if (!token) {
      throw new Error('Vous devez être connecté pour mettre à jour une boutique');
    }
    
    // Appeler l'API pour mettre à jour la boutique (attention à l'URL: shop ou shops)
    const response = await fetch(`${backendUrl}/api/shop/${shopId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type car FormData le fait automatiquement avec la boundary
      },
      body: shopData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [SHOP] Erreur lors de la mise à jour de la boutique:', errorData.message);
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la boutique');
    }
    
    const data = await response.json();
    console.log('✅ [SHOP] Boutique mise à jour avec succès:', data.shop.name);
    
    return data.shop;
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Récupère une boutique spécifique par son ID
 * @param {number} shopId L'ID de la boutique à récupérer
 * @returns {Promise<ShopWithProducts>} Les informations de la boutique avec ses produits
 */
export const getShopById = async (shopId: number): Promise<ShopWithProducts> => {
  try {
    console.log(`🔄 [SHOP] Récupération de la boutique ID ${shopId}`);
    
    // Appeler l'API pour récupérer la boutique (attention à l'URL: shop ou shops)
    const response = await fetch(`${backendUrl}/api/shop/${shopId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [SHOP] Erreur lors de la récupération de la boutique:', errorData.message);
      throw new Error(errorData.message || 'Erreur lors de la récupération de la boutique');
    }
    
    const data = await response.json();
    console.log('✅ [SHOP] Boutique récupérée avec succès:', data.shop.name);
    
    return {
      ...data.shop,
      products: data.products || []
    };
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Récupère tous les produits d'une boutique
 * @param {number} shopId L'ID de la boutique
 * @returns {Promise<ShopProduct[]>} La liste des produits de la boutique
 */
export const getShopProducts = async (shopId: number): Promise<ShopProduct[]> => {
  try {
    console.log(`🔄 [SHOP] Récupération des produits de la boutique ID ${shopId}`);
    
    // Appeler l'API pour récupérer les produits de la boutique (attention à l'URL: shop ou shops)
    const response = await fetch(`${backendUrl}/api/shop/${shopId}/products`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [SHOP] Erreur lors de la récupération des produits:', errorData.message);
      throw new Error(errorData.message || 'Erreur lors de la récupération des produits');
    }
    
    const data = await response.json();
    console.log('✅ [SHOP] Produits récupérés avec succès:', data.products.length);
    
    return data.products;
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};
/**
 * Récupère toutes les boutiques disponibles
 * @returns {Promise<Shop[]>} La liste de toutes les boutiques
 */
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    console.log('🔄 [SHOP] Récupération de toutes les boutiques');
    
    // Utiliser l'URL du backend définie précédemment
    const response = await fetch(`${backendUrl}/api/shop`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [SHOP] Erreur lors de la récupération des boutiques:', errorData.message);
      throw new Error(errorData.message || 'Erreur lors de la récupération des boutiques');
    }
    
    const data = await response.json();
    console.log('✅ [SHOP] Boutiques récupérées avec succès:', data.shops.length);
    
    return data.shops;
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Supprime une boutique et tous ses produits
 * @param {number} shopId L'ID de la boutique à supprimer
 * @returns {Promise<void>}
 */
export const deleteShop = async (shopId: number): Promise<void> => {
  try {
    console.log(`🔄 [SHOP] Suppression de la boutique ID ${shopId}`);
    
    // Vérifier si l'utilisateur est un commerçant
    if (!isMerchant()) {
      throw new Error('Seuls les commerçants peuvent supprimer une boutique');
    }
    
    // Récupérer le token d'authentification
    const token = getAuthToken();
    if (!token) {
      throw new Error('Vous devez être connecté pour supprimer une boutique');
    }
    
    // Appeler l'API pour supprimer la boutique (attention à l'URL: shop ou shops)
    const response = await fetch(`${backendUrl}/api/shop/${shopId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [SHOP] Erreur lors de la suppression de la boutique:', errorData.message);
      throw new Error(errorData.message || 'Erreur lors de la suppression de la boutique');
    }
    
    console.log('✅ [SHOP] Boutique supprimée avec succès');
  } catch (error) {
    console.error('❌ [SHOP] Erreur:', error);
    throw error;
  }
};

/**
 * Utilitaire pour vérifier et afficher les informations de l'utilisateur
 * Utile pour déboguer les problèmes d'autorisation
 */
export const debugUserInfo = (): void => {
  try {
    console.log('🔍 [SHOP] Débogage des informations utilisateur');
    
    // Vérifier le token
    const token = localStorage.getItem('token');
    console.log('🔑 [SHOP] Token présent:', !!token);
    if (token) {
      console.log('🔑 [SHOP] Aperçu du token:', token.substring(0, 20) + '...');
      
      // Décodage basique du JWT (sans vérification)
      try {
        const [header, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        console.log('🔑 [SHOP] Contenu du token:', decodedPayload);
      } catch (e) {
        console.error('❌ [SHOP] Impossible de décoder le token:', e);
      }
    }
    
    // Vérifier les informations utilisateur
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('👤 [SHOP] Informations utilisateur:', {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      });
      
      if (user.role === UserRole.MERCHANT) {
        console.log('✅ [SHOP] L\'utilisateur a le rôle requis: MERCHANT');
      } else {
        console.log('❌ [SHOP] L\'utilisateur n\'a pas le rôle requis. Actuel:', user.role, 'Requis:', UserRole.MERCHANT);
      }
    } else {
      console.log('❌ [SHOP] Aucune information utilisateur trouvée dans localStorage');
    }
  } catch (error) {
    console.error('❌ [SHOP] Erreur lors du débogage:', error);
  }
};