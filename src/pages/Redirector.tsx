
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    console.log('📍 Redirector activé avec URL:', location.pathname, location.search);
    
    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const scope = params.get('scope');
    const urlToken = params.get('token');
    
    // Debug info
    console.log('🔍 Paramètres URL:', {
      code: code ? `${code.substring(0, 10)}...` : 'null',
      scope: scope || 'null',
      token: urlToken ? `${urlToken.substring(0, 10)}...` : 'null'
    });
    
    // Si nous avons un token dans l'URL, l'utiliser directement
    if (urlToken) {
      console.log('🔑 Token trouvé dans l\'URL:', urlToken.substring(0, 15) + '...');
      localStorage.setItem('token', urlToken);
      localStorage.setItem('auth_token', urlToken);
      
      toast({
        title: "Authentification réussie",
        description: "Vous allez être redirigé vers la page de complétion de profil.",
      });
      
      navigate(`/complete-profile?token=${urlToken}`);
      return;
    }
    
    // Vérifier le localStorage pour un token récent
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      console.log('🔑 Token trouvé dans localStorage:', token.substring(0, 15) + '...');
      toast({
        title: "Authentification réussie",
        description: "Vous allez être redirigé vers la page de complétion de profil.",
      });
      navigate(`/complete-profile?token=${token}`);
      return;
    }
    
    // Si pas de token, essayer de gérer le cas d'une redirection après auth Google
    if (code && scope) {
      console.log('🔍 Code et scope Google détectés, redirection vers l\'API...');
      
      // Rediriger vers l'API pour finaliser l'authentification
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const redirectUrl = `${backendUrl}/api/auth/google/callback?code=${code}&scope=${scope}`;
      
      console.log('🔄 Redirection vers le backend:', redirectUrl);
      
      // Store current origin for callback
      localStorage.setItem('auth_redirect_url', window.location.origin + '/redirect');
      
      // Redirect to backend
      window.location.href = redirectUrl;
      return;
    }
    
    // Si aucun cas précédent, vérifier à nouveau le localStorage après un court délai
    setTimeout(() => {
      const retryToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (retryToken) {
        console.log('🔑 Token trouvé après attente:', retryToken.substring(0, 15) + '...');
        navigate(`/complete-profile?token=${retryToken}`);
      } else {
        console.log('❌ Aucun token trouvé - redirection vers l\'accueil');
        setIsProcessing(false);
        toast({
          title: "Problème d'authentification",
          description: "Impossible de récupérer votre token d'authentification.",
          variant: "destructive"
        });
        navigate('/');
      }
    }, 2000);
  }, [navigate, location, toast]);
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-lg">Redirection en cours...</p>
        <p className="text-sm text-gray-500 mt-2">Traitement de votre authentification...</p>
        {!isProcessing && (
          <p className="text-amber-600 mt-4">
            Aucun token d'authentification trouvé. Si le problème persiste, contactez l'administrateur.
          </p>
        )}
      </div>
    </div>
  );
};

export default Redirector;
