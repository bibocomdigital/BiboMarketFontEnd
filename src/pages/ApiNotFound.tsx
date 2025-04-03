
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ApiNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔍 API route not found:', location.pathname);
    console.log('🔄 Checking if this is a Google auth route');
    
    // Si c'est une route d'authentification Google, on redirige vers le backend
    if (location.pathname.includes('/api/auth/google')) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const redirectUrl = `${backendUrl}${location.pathname}${location.search}`;
      
      console.log('🔄 Redirection de la route Google Auth vers le backend:', redirectUrl);
      toast({
        title: "Redirection vers le backend",
        description: "Redirection vers le serveur d'authentification...",
      });
      
      // Redirection directe vers le backend
      window.location.href = redirectUrl;
      return;
    }
    
    // Pour les autres routes API non trouvées
    toast({
      title: "API Route non trouvée",
      description: "Redirection vers la page d'accueil...",
      variant: "destructive"
    });
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [navigate, toast, location]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Traitement de la Requête</h1>
        <p className="mb-4">
          {location.pathname.includes('/api/auth/google') 
            ? "Redirection vers le serveur d'authentification..."
            : "L'API demandée n'est pas disponible. Cela peut être dû à une configuration incorrecte."}
        </p>
        <p className="text-sm text-gray-600 mb-6">
          {location.pathname.includes('/api/auth/google')
            ? "Veuillez patienter pendant que nous traitons votre demande d'authentification."
            : "Assurez-vous que votre backend est correctement configuré pour gérer les requêtes d'authentification."}
        </p>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500">
          {location.pathname.includes('/api/auth/google')
            ? "Redirection vers le service d'authentification..."
            : "Redirection vers la page d'accueil..."}
        </p>
      </div>
    </div>
  );
};

export default ApiNotFound;
