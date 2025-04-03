
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
    
    // Vérifier si nous sommes sur un callback Google (contient code= et scope=)
    const isGoogleCallback = code && scope;
    const isGoogleCallbackPath = location.pathname.includes('/api/auth/google/callback');
    
    if (isGoogleCallback || isGoogleCallbackPath) {
      console.log('🔍 Callback Google détecté, recherche du token...');
      toast({
        title: "Authentification en cours",
        description: "Connexion avec Google en cours de traitement...",
      });
      
      // Stocker les paramètres du callback dans localStorage pour que le backend puisse les récupérer
      if (code) {
        localStorage.setItem('auth_code', code);
        console.log('💾 Code d\'authentification sauvegardé:', code);
      }
      if (scope) {
        localStorage.setItem('auth_scope', scope);
        console.log('💾 Scope d\'authentification sauvegardé:', scope);
      }
      
      // En développement: rediriger directement vers l'API backend
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      
      // Si nous sommes en mode développement, nous pouvons rediriger vers l'API backend
      if (import.meta.env.DEV) {
        // Construire l'URL complète pour le backend avec les paramètres
        const fullBackendCallbackUrl = `${backendUrl}/api/auth/google/callback${location.search}`;
        console.log('🔄 Redirection vers le backend:', fullBackendCallbackUrl);
        
        // Rediriger l'utilisateur vers le backend pour traiter l'authentification
        window.location.href = fullBackendCallbackUrl;
        return;
      }
      
      // Pour la production, attendre que le backend place le token
      setTimeout(() => {
        // Récupérer le token JWT depuis localStorage (qui aurait été placé par le backend)
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        if (token) {
          console.log('🔑 Token trouvé, redirection vers la page de complétion de profil');
          toast({
            title: "Authentification réussie",
            description: "Vous allez être redirigé vers la page de complétion de profil.",
          });
          navigate(`/complete-profile?token=${token}`);
        } else {
          console.log('⏳ Attente du token...');
          toast({
            title: "Authentification en cours",
            description: "Veuillez patienter...",
          });
          // Si le token n'est pas encore disponible, attendre encore un peu
          setTimeout(() => {
            const retryToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (retryToken) {
              console.log('🔑 Token trouvé après attente, redirection');
              toast({
                title: "Authentification réussie",
                description: "Vous allez être redirigé vers la page de complétion de profil.",
              });
              navigate(`/complete-profile?token=${retryToken}`);
            } else {
              console.log('❌ Aucun token trouvé après attente, redirection vers la page d\'accueil');
              setIsProcessing(false);
              toast({
                title: "Erreur d'authentification",
                description: "Impossible de récupérer votre token d'authentification.",
                variant: "destructive"
              });
              navigate('/');
            }
          }, 3000);
        }
      }, 2000);
    } else if (location.pathname.startsWith('/api/auth/google')) {
      // Traitement direct de la route /api/auth/google
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      console.log('🔄 Redirection de l\'authentification Google vers le backend:', `${backendUrl}${location.pathname}${location.search}`);
      
      // Rediriger directement vers le backend
      window.location.href = `${backendUrl}${location.pathname}${location.search}`;
      return;
    } else if (location.pathname === '/redirect') {
      // Pour la route /redirect, vérifier si le token est dans l'URL ou localStorage
      if (urlToken) {
        console.log('🔄 Redirection: token détecté dans l\'URL, redirection vers la page de complétion de profil');
        navigate(`/complete-profile?token=${urlToken}`);
      } else {
        // Vérifier s'il y a un token dans localStorage (cas où le backend redirige sans paramètre)
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (storedToken) {
          console.log('🔑 Token trouvé dans localStorage, redirection vers la page de complétion de profil');
          navigate(`/complete-profile?token=${storedToken}`);
        } else {
          console.log('❌ Redirection: aucun token trouvé, redirection vers la page d\'accueil');
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
      console.log('⚠️ Route non reconnue dans Redirector, redirection vers l\'accueil');
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
