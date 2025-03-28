
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/forms/RegisterForm';
import { UserRole } from '@/types/user';

const Register = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Decorative side */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-bibocom-accent/80 to-bibocom-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Rejoignez BibocomMarket</h1>
          <p className="text-xl text-white/90 max-w-md text-center mb-8">
            Inscrivez-vous et découvrez une nouvelle façon d'acheter, vendre ou fournir des produits.
          </p>
          
          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div 
              className={`p-6 rounded-xl cursor-pointer transition-all ${role === UserRole.CLIENT ? 'bg-white/20 shadow-lg scale-105' : 'bg-white/10 hover:bg-white/15'}`}
              onClick={() => setRole(UserRole.CLIENT)}
            >
              <h3 className="text-xl font-semibold mb-2">Client</h3>
              <p className="text-white/80">Trouvez les meilleurs produits et services en un seul endroit.</p>
            </div>
            
            <div 
              className={`p-6 rounded-xl cursor-pointer transition-all ${role === UserRole.MERCHANT ? 'bg-white/20 shadow-lg scale-105' : 'bg-white/10 hover:bg-white/15'}`}
              onClick={() => setRole(UserRole.MERCHANT)}
            >
              <h3 className="text-xl font-semibold mb-2">Commerçant</h3>
              <p className="text-white/80">Créez votre boutique en ligne et vendez à un public plus large.</p>
            </div>
            
            <div 
              className={`p-6 rounded-xl cursor-pointer transition-all ${role === UserRole.SUPPLIER ? 'bg-white/20 shadow-lg scale-105' : 'bg-white/10 hover:bg-white/15'}`}
              onClick={() => setRole(UserRole.SUPPLIER)}
            >
              <h3 className="text-xl font-semibold mb-2">Fournisseur</h3>
              <p className="text-white/80">Proposez vos services aux commerçants sur la plateforme.</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-bibocom-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-bibocom-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Registration form side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-2xl">
          <Link to="/" className="inline-flex items-center text-bibocom-primary hover:text-bibocom-accent mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-bibocom-primary">Inscription</h2>
              <p className="text-gray-500 mt-2">
                {role === UserRole.MERCHANT 
                  ? 'Créez votre compte commerçant' 
                  : role === UserRole.SUPPLIER 
                    ? 'Inscrivez-vous comme fournisseur'
                    : 'Rejoignez notre plateforme'}
              </p>
            </div>
            
            <RegisterForm initialRole={role} />
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Déjà inscrit? 
              <Link to="/login" className="text-bibocom-accent font-medium ml-2 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
