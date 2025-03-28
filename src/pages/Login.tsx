
import React from 'react';
import { Link } from 'react-router-dom';
import LoginFormContent from '@/components/forms/login/LoginFormContent';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Decorative side */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-bibocom-primary to-bibocom-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bienvenue sur BibocomMarket</h1>
          <p className="text-xl text-white/90 max-w-md text-center">
            La première marketplace qui réunit commerçants, clients et fournisseurs dans un écosystème complet.
          </p>
          
          <div className="mt-12 flex flex-col gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <blockquote className="text-lg italic text-white/90">
                "BibocomMarket a transformé ma façon de gérer mon commerce. Une plateforme incontournable!"
              </blockquote>
              <p className="mt-4 font-medium">— Amadou N., Commerçant</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bibocom-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bibocom-secondary/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Login form side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-bibocom-primary hover:text-bibocom-accent mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-bibocom-primary">Connexion</h2>
              <p className="text-gray-500 mt-2">Accédez à votre compte BibocomMarket</p>
            </div>
            
            <LoginFormContent />
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Pas encore de compte? 
              <Link to="/register" className="text-bibocom-accent font-medium ml-2 hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
