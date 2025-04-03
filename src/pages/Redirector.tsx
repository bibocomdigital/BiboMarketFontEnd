
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('📍 Redirector activé avec URL:', location.pathname, location.search);
    
    // Vérifier si nous sommes sur un callback Google (contient code= et scope=)
    const isGoogleCallback = location.search.includes('code=') && location.search.includes('scope=');
    
    if (isGoogleCallback) {
      console.log('🔍 Callback Google détecté, recherche du token...');
      
      // Simuler une attente pour le traitement du backend
      setTimeout(() => {
        // Récupérer le token JWT depuis localStorage (qui aurait été placé par le backend)
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        if (token) {
          console.log('🔑 Token trouvé, redirection vers la page de complétion de profil');
          navigate(`/complete-profile?token=${token}`);
        } else {
          console.log('⏳ Attente du token...');
          // Si le token n'est pas encore disponible, attendre encore un peu
          setTimeout(() => {
            const retryToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (retryToken) {
              console.log('🔑 Token trouvé après attente, redirection');
              navigate(`/complete-profile?token=${retryToken}`);
            } else {
              console.log('❌ Aucun token trouvé après attente, redirection vers la page d\'accueil');
              navigate('/');
            }
          }, 2000);
        }
      }, 1000);
    } else {
      // Comportement standard (comme avant)
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        console.log('🔄 Redirection: token détecté dans l\'URL, redirection vers la page de complétion de profil');
        navigate(`/complete-profile?token=${token}`);
      } else {
        console.log('❌ Redirection: aucun token trouvé dans l\'URL, redirection vers la page d\'accueil');
        navigate('/');
      }
    }
  }, [navigate, location]);
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-lg">Redirection en cours...</p>
        <p className="text-sm text-gray-500 mt-2">Traitement de votre authentification...</p>
      </div>
    </div>
  );
};

export default Redirector;
