
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ApiNotFound = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔍 API route not found, redirecting to home page');
    
    toast({
      title: "API Route non trouvée",
      description: "Redirection vers la page d'accueil...",
      variant: "destructive"
    });
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [navigate, toast]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">API Route Non Trouvée</h1>
        <p className="mb-4">
          L'API demandée n'est pas disponible. Cela peut être dû à une configuration incorrecte.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Assurez-vous que votre backend est correctement configuré pour gérer les requêtes d'authentification.
        </p>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500">Redirection vers la page d'accueil...</p>
      </div>
    </div>
  );
};

export default ApiNotFound;
