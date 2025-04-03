
/**
 * Service dédié à la gestion des boutiques côté frontend
 */

// Obtenir l'URL du backend depuis l'environnement ou utiliser la valeur par défaut
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
 * Récupère les informations de la boutique pour l'utilisateur connecté
 * @returns {Promise<ShopWithProducts>} Les informations de la boutique avec ses produits
 */
export const getMyShop = async (): Promise<ShopWithProducts> => {
  try {
    console.log('🔄 [SHOP] Récupération de la boutique du commerçant');
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ [SHOP] Authentification requise');
      throw new Error('Vous devez être connecté pour accéder à votre boutique');
    }
    
    // Appeler l'API pour récupérer la boutique
    const response = await fetch(`${backendUrl}/api/shops/my-shop`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
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
 * Crée une nouvelle boutique pour l'utilisateur connecté
 * @param {Object} shopData Les données de la nouvelle boutique
 * @returns {Promise<Shop>} La boutique créée
 */
export const createShop = async (shopData: FormData): Promise<Shop> => {
  try {
    console.log('🔄 [SHOP] Création d\'une nouvelle boutique');
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ [SHOP] Authentification requise');
      throw new Error('Vous devez être connecté pour créer une boutique');
    }
    
    // Log du contenu de FormData pour débugger
    console.log('📋 [SHOP] Contenu du FormData:');
    for (let pair of shopData.entries()) {
      console.log(`   ${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`);
    }
    
    // Appeler l'API pour créer la boutique
    const response = await fetch(`${backendUrl}/api/shops`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type car FormData le fait automatiquement avec la boundary
      },
      body: shopData
    });
    
    // Log de la réponse pour débugger
    console.log('🔄 [SHOP] Statut de la réponse:', response.status);
    
    const responseText = await response.text();
    console.log('🔄 [SHOP] Réponse brute:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ [SHOP] Erreur lors du parsing de la réponse JSON:', e);
      throw new Error('Format de réponse invalide depuis le serveur');
    }
    
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
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ [SHOP] Authentification requise');
      throw new Error('Vous devez être connecté pour mettre à jour une boutique');
    }
    
    // Appeler l'API pour mettre à jour la boutique
    const response = await fetch(`${backendUrl}/api/shops/${shopId}`, {
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
    
    // Appeler l'API pour récupérer la boutique
    const response = await fetch(`${backendUrl}/api/shops/${shopId}`);
    
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
    
    // Appeler l'API pour récupérer les produits de la boutique
    const response = await fetch(`${backendUrl}/api/shops/${shopId}/products`);
    
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
 * Supprime une boutique et tous ses produits
 * @param {number} shopId L'ID de la boutique à supprimer
 * @returns {Promise<void>}
 */
export const deleteShop = async (shopId: number): Promise<void> => {
  try {
    console.log(`🔄 [SHOP] Suppression de la boutique ID ${shopId}`);
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ [SHOP] Authentification requise');
      throw new Error('Vous devez être connecté pour supprimer une boutique');
    }
    
    // Appeler l'API pour supprimer la boutique
    const response = await fetch(`${backendUrl}/api/shops/${shopId}`, {
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
