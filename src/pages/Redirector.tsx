
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
    
    // Vérifier si nous sommes sur un callback Google
    const isGoogleCallback = code && scope;
    const isGoogleCallbackPath = location.pathname.includes('/api/auth/google/callback');
    
    if (isGoogleCallback || isGoogleCallbackPath) {
      console.log('🔍 Callback Google détecté, recherche du token...');
      toast({
        title: "Authentification en cours",
        description: "Connexion avec Google en cours de traitement...",
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
      
      // Construire l'URL complète pour le backend
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      
      if (code && scope) {
        // Stocker les paramètres du callback
        localStorage.setItem('auth_code', code);
        localStorage.setItem('auth_scope', scope);
        
        // Construire l'URL complète pour le backend avec le callback complet
        const callbackUrl = `${backendUrl}/api/auth/google/callback?code=${code}&scope=${scope}`;
        console.log('🔄 Redirection vers le backend pour callback:', callbackUrl);
        
        // Rediriger vers le backend
        window.location.href = callbackUrl;
        return;
      }
      
      // Si nous sommes à ce point, nous n'avons pas de token et nous sommes dans un état indéterminé
      // Vérifier le localStorage une dernière fois
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
      
      // Attendre un peu et réessayer
      setTimeout(() => {
        const retryToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (retryToken) {
          console.log('🔑 Token trouvé après attente:', retryToken.substring(0, 15) + '...');
          toast({
            title: "Authentification réussie",
            description: "Vous allez être redirigé vers la page de complétion de profil.",
          });
          navigate(`/complete-profile?token=${retryToken}`);
        } else {
          console.log('❌ Aucun token trouvé après attente');
          setIsProcessing(false);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de récupérer votre token d'authentification.",
            variant: "destructive"
          });
          navigate('/');
        }
      }, 3000);
    } else if (location.pathname === '/redirect') {
      // Pour la route /redirect, vérifier si le token est dans l'URL ou localStorage
      if (urlToken) {
        console.log('🔄 Redirection: token détecté dans l\'URL');
        localStorage.setItem('token', urlToken);
        localStorage.setItem('auth_token', urlToken);
        navigate(`/complete-profile?token=${urlToken}`);
      } else {
        // Vérifier s'il y a un token dans localStorage
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (storedToken) {
          console.log('🔑 Token trouvé dans localStorage');
          navigate(`/complete-profile?token=${storedToken}`);
        } else {
          console.log('❌ Redirection: aucun token trouvé');
          setIsProcessing(false);
          toast({
            title: "Erreur de redirection",
            description: "Aucun token d'authentification trouvé.",
            variant: "destructive"
          });
          navigate('/');
        }
      }
    } else {
      // Route non reconnue
      console.log('⚠️ Route non reconnue dans Redirector:', location.pathname);
      setIsProcessing(false);
      toast({
        title: "Redirection",
        description: "Route non reconnue, redirection vers la page d'accueil.",
      });
      navigate('/');
    }
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
