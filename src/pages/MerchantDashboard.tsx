
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Package, BarChart2, Users, PlusCircle, Settings, Menu, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getMyShop } from '@/services/shopService';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NoShop from '@/components/shop/NoShop';
import ShopOverview from '@/components/shop/ShopOverview';

const MerchantDashboard = () => {
  const { toast } = useToast();
  const [showEditShop, setShowEditShop] = useState(false);
  
  // Requête pour récupérer les informations de la boutique
  const { 
    data: shopData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['myShop'],
    queryFn: getMyShop,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Gestion de l'erreur si la boutique n'existe pas encore
  const hasShop = !isError && shopData;
  
  const handleShopCreated = () => {
    toast({
      title: 'Boutique créée avec succès',
      description: 'Votre boutique a été créée et est maintenant visible pour vos clients.',
    });
    refetch();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header avec menu */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-bibocom-primary">
              <span className="flex items-center">
                <Store className="mr-2 h-6 w-6" />
                BibocomMarket
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/mes-produits" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Mes Produits
            </Link>
            <Link to="/commandes-recues" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Commandes
            </Link>
            <Link to="/fournisseurs" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Fournisseurs
            </Link>
            <Link to="/statistiques" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Statistiques
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer group">
              <User size={20} className="text-gray-600 hidden md:block" />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mon profil
                </Link>
                <Link to="/boutique-parametres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Paramètres boutique
                </Link>
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Se déconnecter
                </Link>
              </div>
            </div>
            
            {/* Menu mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
                  <Menu size={20} className="text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col h-full py-6">
                  <div className="px-2 mb-6">
                    <Link to="/" className="text-xl font-bold text-bibocom-primary flex items-center">
                      <Store className="mr-2 h-6 w-6" />
                      BibocomMarket
                    </Link>
                  </div>
                  
                  <nav className="flex-1 space-y-4 px-2">
                    <Link to="/mes-produits" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <Package className="mr-3 h-5 w-5 text-bibocom-accent" />
                      Mes Produits
                    </Link>
                    <Link to="/commandes-recues" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <Package className="mr-3 h-5 w-5 text-green-500" />
                      Commandes
                    </Link>
                    <Link to="/fournisseurs" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <Users className="mr-3 h-5 w-5 text-blue-500" />
                      Fournisseurs
                    </Link>
                    <Link to="/statistiques" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <BarChart2 className="mr-3 h-5 w-5 text-purple-500" />
                      Statistiques
                    </Link>
                  </nav>
                  
                  <div className="border-t pt-4 mt-4 px-2">
                    <Link to="/profile" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <User className="mr-3 h-5 w-5" />
                      Mon profil
                    </Link>
                    <Link to="/boutique-parametres" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                      <Settings className="mr-3 h-5 w-5" />
                      Paramètres boutique
                    </Link>
                    <Link to="/login" className="flex items-center py-2 px-4 text-red-500 hover:bg-gray-100 rounded-md">
                      <LogOut className="mr-3 h-5 w-5" />
                      Se déconnecter
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Titre de la page */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bibocom-primary">Espace commerçant</h1>
            <p className="text-gray-600 mt-2">Gérez votre boutique et développez votre activité</p>
          </div>
          
          {/* État de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bibocom-primary"></div>
              <span className="ml-3 text-bibocom-primary">Chargement...</span>
            </div>
          )}
          
          {/* Affichage de la boutique ou du composant NoShop */}
          {!isLoading && (
            <>
              {hasShop ? (
                <ShopOverview 
                  shop={shopData}
                  products={shopData.products || []}
                  onEditClick={() => setShowEditShop(true)}
                />
              ) : (
                <NoShop onShopCreated={handleShopCreated} />
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 BibocomMarket. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MerchantDashboard;
