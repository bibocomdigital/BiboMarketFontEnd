import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Store, 
  MapPin, 
  Phone, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Shop, getAllShops } from '../services/shopService';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const ShopsListingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États de filtrage et pagination
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Configuration pagination
  const itemsPerPage = 20;
  
  // États de filtres avancés
  const [filters, setFilters] = useState({
    sortBy: 'name', // 'name', 'date', 'merchant'
    sortOrder: 'asc' as 'asc' | 'desc',
    hasProducts: 'all', // 'all', 'yes', 'no'
  });

  // Charger toutes les boutiques
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const fetchedShops = await getAllShops();
        setShops(fetchedShops);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des boutiques:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filtrer et trier les boutiques
  useEffect(() => {
    let filtered = [...shops];

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(term) ||
        shop.description?.toLowerCase().includes(term) ||
        shop.address?.toLowerCase().includes(term) ||
        shop.user?.firstName?.toLowerCase().includes(term) ||
        shop.user?.lastName?.toLowerCase().includes(term)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (filters.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'merchant':
          const merchantA = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim();
          const merchantB = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim();
          compareValue = merchantA.localeCompare(merchantB);
          break;
        case 'date':
          compareValue = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
        default:
          compareValue = 0;
      }
      
      return filters.sortOrder === 'desc' ? -compareValue : compareValue;
    });

    setFilteredShops(filtered);
    
    // Réinitialiser à la page 1 si filtrage
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [shops, searchTerm, filters]);

  // Mise à jour des URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  // Calcul de la pagination
  const paginationInfo: PaginationInfo = {
    currentPage,
    totalItems: filteredShops.length,
    itemsPerPage,
    totalPages: Math.ceil(filteredShops.length / itemsPerPage)
  };

  // Boutiques pour la page actuelle
  const currentShops = filteredShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion de la recherche
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigation vers détails boutique
  const handleShopClick = (shopId: number) => {
    navigate(`/boutique/${shopId}`);
  };

  // Génération des pages pour la pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(paginationInfo.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des boutiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">❌ Erreur</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Toutes nos boutiques</h1>
              <p className="text-gray-600 mt-1">
                Découvrez {filteredShops.length} boutique{filteredShops.length !== 1 ? 's' : ''} disponible{filteredShops.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Toggle vue grille/liste */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List size={16} />
                </button>
              </div>
              
              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} />
                Filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filtres */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Recherche */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nom, marchand, adresse..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tri */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="name">Nom de boutique</option>
                  <option value="merchant">Nom du marchand</option>
                  <option value="date">Date de création</option>
                </select>
              </div>

              {/* Ordre */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="asc">Croissant (A-Z)</option>
                  <option value="desc">Décroissant (Z-A)</option>
                </select>
              </div>

              {/* Reset filtres */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ sortBy: 'name', sortOrder: 'asc', hasProducts: 'all' });
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Résultats */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredShops.length} résultat{filteredShops.length !== 1 ? 's' : ''} trouvé{filteredShops.length !== 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
              </p>
            </div>

            {/* Liste des boutiques */}
            {currentShops.length === 0 ? (
              <div className="text-center py-12">
                <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune boutique trouvée</h3>
                <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <>
                {/* Vue grille */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {currentShops.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => handleShopClick(shop.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="p-6">
                          {/* Logo */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 group-hover:scale-105 transition-transform">
                              {shop.logo ? (
                                <img 
                                  src={`${backendUrl}/uploads/${shop.logo.split('/').pop()}`} 
                                  alt={shop.name}
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Store className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Infos */}
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                              {shop.name}
                            </h3>
                            
                            {shop.user && (
                              <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                                <User size={14} className="mr-1" />
                                {shop.user.firstName} {shop.user.lastName}
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {shop.description}
                            </p>
                            
                            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                              <MapPin size={14} className="mr-1" />
                              {shop.address}
                            </div>
                            
                            <div className="flex items-center justify-center text-sm text-gray-500">
                              <Phone size={14} className="mr-1" />
                              {shop.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vue liste */}
                {viewMode === 'list' && (
                  <div className="space-y-4 mb-8">
                    {currentShops.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => handleShopClick(shop.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group p-6"
                      >
                        <div className="flex items-center gap-4">
                          {/* Logo */}
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:scale-105 transition-transform flex-shrink-0">
                            {shop.logo ? (
                              <img 
                                src={`${backendUrl}/uploads/${shop.logo.split('/').pop()}`} 
                                alt={shop.name}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Store className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Infos */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                              {shop.name}
                            </h3>
                            
                            {shop.user && (
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <User size={14} className="mr-1" />
                                {shop.user.firstName} {shop.user.lastName}
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                              {shop.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {shop.address}
                              </div>
                              <div className="flex items-center">
                                <Phone size={14} className="mr-1" />
                                {shop.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {paginationInfo.totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                      Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, paginationInfo.totalItems)} sur {paginationInfo.totalItems} boutiques
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Bouton précédent */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {/* Numéros de page */}
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg ${
                            page === currentPage
                              ? 'bg-orange-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {/* Bouton suivant */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === paginationInfo.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                )}
              </>

            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ShopsListingPage;