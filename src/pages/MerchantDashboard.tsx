
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Package, BarChart2, Users, PlusCircle, Settings } from 'lucide-react';

const MerchantDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header avec menu */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-bibocom-primary">BibocomMarket</Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
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
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer group">
              <User size={20} className="text-gray-600" />
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
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bibocom-primary">Bienvenue sur votre espace commerçant</h1>
            <p className="text-gray-600 mt-2">Gérez votre boutique et développez votre activité</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Produits</h3>
                <div className="bg-bibocom-accent/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Package className="text-bibocom-accent" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Produits en vente</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Commandes</h3>
                <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Package className="text-green-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Commandes en attente</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Ventes</h3>
                <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <BarChart2 className="text-blue-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold">0 FCFA</p>
              <p className="text-gray-500 text-sm">Ventes ce mois</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Clients</h3>
                <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Clients fidèles</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/ajouter-produit" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-bibocom-accent/10 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <PlusCircle className="text-bibocom-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Ajouter un produit</h3>
                    <p className="text-sm text-gray-500">Créez et publiez un nouveau produit</p>
                  </div>
                </Link>
                
                <Link to="/gerer-commandes" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <Package className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Gérer les commandes</h3>
                    <p className="text-sm text-gray-500">Voir et traiter les commandes</p>
                  </div>
                </Link>
                
                <Link to="/modifier-boutique" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Modifier ma boutique</h3>
                    <p className="text-sm text-gray-500">Personnalisez votre boutique</p>
                  </div>
                </Link>
                
                <Link to="/contacter-support" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <Users className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Contacter le support</h3>
                    <p className="text-sm text-gray-500">Besoin d'aide? Contactez-nous</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Mon compte</h2>
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                <h3 className="font-medium">Boutique</h3>
                <p className="text-sm text-gray-500">Commerçant</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <Link to="/profile" className="block py-2 text-bibocom-accent hover:underline">
                  Modifier mon profil
                </Link>
                <Link to="/boutique-parametres" className="block py-2 text-bibocom-accent hover:underline">
                  Paramètres boutique
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

export default MerchantDashboard;
