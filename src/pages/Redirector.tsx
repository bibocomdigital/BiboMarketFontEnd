
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      console.log('🔄 Redirection: token détecté, redirection vers la page de complétion de profil');
      navigate(`/complete-profile?token=${token}`);
    } else {
      console.log('❌ Redirection: aucun token trouvé, redirection vers la page d\'accueil');
      navigate('/');
    }
  }, [navigate, location]);
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-lg">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default Redirector;
