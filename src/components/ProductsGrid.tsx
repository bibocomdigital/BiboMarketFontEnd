import React, { useState, useEffect, useRef } from 'react';
import { getAllProducts, getProductCategories } from '../services/productService';
import { Loader, Heart, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsGrid = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  
  // États pour la modal et le produit sélectionné
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Références pour les intervalles des carrousels
  const carouselIntervals = useRef<{[key: number]: NodeJS.Timeout}>({});
  
  // Nouvel état pour suivre les images actuelles dans chaque carrousel
  const [currentImages, setCurrentImages] = useState<{[key: number]: number}>({});
  
  // Nouvel état pour gérer les likes (simulé)
  const [likes, setLikes] = useState<{[key: number]: boolean}>({});
  
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories...');
      try {
        const categoriesData = await getProductCategories();
        console.log('Categories loaded:', categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Could not load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      console.log('Fetching products...');
      try {
        const response = await getAllProducts(pagination.page, pagination.limit);
        console.log('Products loaded:', response);
        
        // Initialiser les images courantes pour chaque produit
        const initialCurrentImages: {[key: number]: number} = {};
        response.products.forEach((product: any) => {
          initialCurrentImages[product.id] = 0;
        });
        setCurrentImages(initialCurrentImages);
        
        setProducts(response.products);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Nettoyage des intervalles au démontage
    return () => {
      Object.values(carouselIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, [pagination.page, pagination.limit]);

  // Démarrer les carrousels automatiques après le chargement des produits
  useEffect(() => {
    if (!loading && products.length > 0) {
      products.forEach(product => {
        if (product.images && product.images.length > 1) {
          startCarousel(product.id);
        }
      });
    }
    
    return () => {
      // Nettoyer les intervalles au changement de produits
      Object.values(carouselIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, [loading, products]);

  // Démarrer le carrousel pour un produit spécifique
  const startCarousel = (productId: number) => {
    // Nettoyer tout intervalle existant pour ce produit
    if (carouselIntervals.current[productId]) {
      clearInterval(carouselIntervals.current[productId]);
    }
    
    // Créer un nouvel intervalle
    const product = products.find(p => p.id === productId);
    if (product && product.images && product.images.length > 1) {
      carouselIntervals.current[productId] = setInterval(() => {
        setCurrentImages(prev => ({
          ...prev,
          [productId]: (prev[productId] + 1) % product.images.length
        }));
      }, 3000); // Change image every 3 seconds
    }
  };

  // Arrêter le carrousel pour un produit spécifique
  const stopCarousel = (productId: number) => {
    if (carouselIntervals.current[productId]) {
      clearInterval(carouselIntervals.current[productId]);
      delete carouselIntervals.current[productId];
    }
  };

  // Navigation manuelle du carrousel
  const navigateCarousel = (productId: number, direction: 'prev' | 'next') => {
    const product = products.find(p => p.id === productId);
    if (product && product.images && product.images.length > 1) {
      // Stopper le carrousel automatique temporairement
      stopCarousel(productId);
      
      // Mettre à jour l'image
      setCurrentImages(prev => {
        const currentIndex = prev[productId] || 0;
        const imagesCount = product.images.length;
        let newIndex;
        
        if (direction === 'prev') {
          newIndex = (currentIndex - 1 + imagesCount) % imagesCount;
        } else {
          newIndex = (currentIndex + 1) % imagesCount;
        }
        
        return { ...prev, [productId]: newIndex };
      });
      
      // Redémarrer le carrousel après un délai
      setTimeout(() => startCarousel(productId), 5000);
    }
  };

  // Helper function to handle image URLs
  const getImageUrl = (product: any, imageIndex = 0) => {
    if (!product.images || !product.images.length || imageIndex >= product.images.length) {
      return null;
    }

    const imageInfo = product.images[imageIndex];
    let imageUrl = '';

    // Check different possible structures
    if (typeof imageInfo === 'string') {
      imageUrl = imageInfo;
    } else if (imageInfo && typeof imageInfo === 'object') {
      // IMPORTANT: Remove the leading slash from imageUrl
      imageUrl = (imageInfo.imageUrl || imageInfo.url || imageInfo.path || '').replace(/^\/uploads\//, '');
    }

    if (!imageUrl) {
      return null;
    }
    
    // Create full URL without double slashes
    const fullUrl = `${backendUrl}/uploads/${imageUrl}`;
    return fullUrl;
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev: any) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, productId: any) => {
    console.error(`Image loading failed for product ${productId}`);
    // Use a local image instead of external placeholder service
    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20fill%3D%22%23E0E0E0%22%20width%3D%22300%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%23757575%22%20font-family%3D%22Arial%2CVerdana%2CSans-serif%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%22150%22%20y%3D%22100%22%3EImage%20non%20disponible%3C%2Ftext%3E%3C%2Fsvg%3E';
  };
  
  // Toggle like for a product
  const toggleLike = (productId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setLikes(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };
  
  // Open modal with product details
  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Arrêter tous les carrousels quand la modal est ouverte
    Object.keys(carouselIntervals.current).forEach(id => {
      stopCarousel(Number(id));
    });
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // Redémarrer les carrousels quand la modal est fermée
    products.forEach(product => {
      if (product.images && product.images.length > 1) {
        startCarousel(product.id);
      }
    });
  };

  // Obtenir le nombre aléatoire de likes et de commentaires (simulé)
  const getLikesCount = (productId: number) => {
    // En production, ces données viendraient d'une API
    return Math.floor(Math.random() * 1000) + 10;
  };
  
  const getCommentsCount = (productId: number) => {
    // En production, ces données viendraient d'une API
    return Math.floor(Math.random() * 100) + 5;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter */}
    

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-green-500" size={32} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => openModal(product)}
              >
                {/* Product Image Carousel */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={getImageUrl(product, currentImages[product.id] || 0)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => handleImageError(e, product.id)}
                      />
                      
                      {/* Carousel Navigation */}
                      {product.images.length > 1 && (
                        <>
                          <button 
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateCarousel(product.id, 'prev');
                            }}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateCarousel(product.id, 'next');
                            }}
                          >
                            <ChevronRight size={20} />
                          </button>
                          
                          {/* Carousel Indicators */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                            {product.images.map((_: any, idx: number) => (
                              <span 
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${
                                  idx === (currentImages[product.id] || 0) 
                                    ? 'w-4 bg-white' 
                                    : 'w-1.5 bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-500 mb-3 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-gray-900">{product.price}</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <button 
                          onClick={(e) => toggleLike(product.id, e)}
                          className="mr-1"
                        >
                          <Heart 
                            size={18} 
                            className={`transition-colors ${likes[product.id] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                          />
                        </button>
                        <span className="text-xs text-gray-500">{getLikesCount(product.id)}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={18} className="text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{getCommentsCount(product.id)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
                className={`p-2 rounded-lg ${pagination.page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Prev
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPagination({ ...pagination, page: index + 1 })}
                  className={`w-10 h-10 rounded-lg ${pagination.page === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.totalPages}
                className={`p-2 rounded-lg ${pagination.page === pagination.totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Modal pour afficher les détails du produit */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Galerie d'images */}
              <div className="space-y-4">
                <div className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <img
                      src={getImageUrl(selectedProduct, currentImages[selectedProduct.id] || 0)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, selectedProduct.id)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                
                {/* Miniatures des images */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex overflow-x-auto space-x-2 pb-2">
                    {selectedProduct.images.map((image: any, idx: number) => (
                      <div 
                        key={idx}
                        className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${
                          idx === (currentImages[selectedProduct.id] || 0) 
                            ? 'border-blue-500' 
                            : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImages(prev => ({...prev, [selectedProduct.id]: idx}))}
                      >
                        <img
                          src={getImageUrl(selectedProduct, idx)}
                          alt={`${selectedProduct.name} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Détails du produit */}
              <div className="space-y-4">
                <div className="text-2xl font-bold text-gray-900">{selectedProduct.price}</div>
                <p className="text-gray-700">{selectedProduct.description}</p>
                
                {/* Interactions sociales */}
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <button 
                    onClick={() => toggleLike(selectedProduct.id)}
                    className="flex items-center space-x-1"
                  >
                    <Heart 
                      size={20} 
                      className={`transition-colors ${likes[selectedProduct.id] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                    />
                    <span className="text-sm">{getLikesCount(selectedProduct.id)} likes</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={20} className="text-gray-500" />
                    <span className="text-sm">{getCommentsCount(selectedProduct.id)} commentaires</span>
                  </div>
                </div>
                
                {/* Section des commentaires (simulée) */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Commentaires</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {/* Commentaires simulés */}
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-sm">Utilisateur {idx + 1}</div>
                          <p className="text-sm text-gray-600">
                            {idx === 0 ? "Super produit, je recommande !" : 
                             idx === 1 ? "Est-ce que ce produit est disponible en d'autres couleurs ?" :
                             "Livraison rapide, très satisfait de mon achat."}
                          </p>
                          <div className="text-xs text-gray-400 mt-1">il y a {idx + 1} jour{idx > 0 ? 's' : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Ajouter un commentaire */}
                  <div className="mt-4 flex">
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;