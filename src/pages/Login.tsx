
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginFormContent from '@/components/forms/login/LoginFormContent';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const location = useLocation();
  const { toast } = useToast();
  const verificationSuccessful = location.state?.verificationSuccessful || false;
  const verifiedEmail = location.state?.email || '';
  
  console.log('🔄 [LOGIN] Initialisation du composant Login');
  console.log('✅ [LOGIN] Vérification réussie:', verificationSuccessful);
  console.log('📧 [LOGIN] Email vérifié:', verifiedEmail);
  
  useEffect(() => {
    if (verificationSuccessful) {
      console.log('✅ [LOGIN] Utilisateur redirigé après une vérification réussie');
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
      });
    }
  }, [verificationSuccessful, toast]);
  
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
          
          {verificationSuccessful && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-green-800">Inscription réussie!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter
                  {verifiedEmail ? ` avec ${verifiedEmail}` : ''}.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-bibocom-primary">Connexion</h2>
              <p className="text-gray-500 mt-2">Accédez à votre compte BibocomMarket</p>
            </div>
            
            <LoginFormContent initialEmail={verifiedEmail} />
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
