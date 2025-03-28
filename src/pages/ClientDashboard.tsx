
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, ShoppingBag, Heart, Clock, Settings } from 'lucide-react';

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header avec menu */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-bibocom-primary">BibocomMarket</Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/boutiques" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Boutiques
            </Link>
            <Link to="/produits" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Produits
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              Catégories
            </Link>
            <Link to="/apropos" className="text-gray-600 hover:text-bibocom-accent transition-colors">
              À propos
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer group">
              <User size={20} className="text-gray-600" />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mon profil
                </Link>
                <Link to="/commandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mes commandes
                </Link>
                <Link to="/favoris" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mes favoris
                </Link>
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Se déconnecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bibocom-primary">Bienvenue sur votre espace client</h1>
            <p className="text-gray-600 mt-2">Découvrez nos produits et services adaptés à vos besoins</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-bibocom-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="text-bibocom-accent" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mes commandes</h3>
              <p className="text-gray-600 mb-4">Consultez et suivez vos commandes en cours</p>
              <Link to="/commandes" className="text-bibocom-accent font-medium hover:underline">
                Voir mes commandes
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mes favoris</h3>
              <p className="text-gray-600 mb-4">Retrouvez tous vos produits préférés</p>
              <Link to="/favoris" className="text-bibocom-accent font-medium hover:underline">
                Voir mes favoris
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-blue-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Historique</h3>
              <p className="text-gray-600 mb-4">Consultez votre historique d'achats</p>
              <Link to="/historique" className="text-bibocom-accent font-medium hover:underline">
                Voir mon historique
              </Link>
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Paramètres de compte</h2>
              <Settings className="text-gray-400" size={20} />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <Link to="/profile" className="block py-2 text-bibocom-accent hover:underline">
                Modifier mon profil
              </Link>
              <Link to="/preferences" className="block py-2 text-bibocom-accent hover:underline">
                Préférences de notification
              </Link>
              <Link to="/securite" className="block py-2 text-bibocom-accent hover:underline">
                Sécurité du compte
              </Link>
              <Link to="/login" className="block py-2 text-red-500 hover:underline flex items-center">
                <LogOut size={16} className="mr-2" />
                Se déconnecter
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 BibocomMarket. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
