
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';

const VerificationPending = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer le type d'utilisateur depuis la navigation
  const userRole = location.state?.role || 'client';
  
  useEffect(() => {
    // Simuler un progrès de vérification
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 250);
    
    // Quand le progrès atteint 100%, rediriger vers la page appropriée
    const redirectTimer = setTimeout(() => {
      toast({
        title: "Vérification réussie",
        description: "Votre compte a été vérifié avec succès"
      });
      
      // Rediriger selon le rôle
      if (userRole === 'commercant') {
        navigate('/merchant-dashboard');
      } else if (userRole === 'fournisseur') {
        navigate('/supplier-dashboard'); 
      } else {
        navigate('/client-dashboard');
      }
    }, 5000); // 5 secondes
    
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, userRole, toast]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-bibocom-primary">Vérification en cours</h2>
              <p className="text-gray-500 mt-2">
                Veuillez patienter pendant que nous vérifions votre compte
              </p>
            </div>
            
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-right text-sm text-gray-500 mt-1">{progress}%</p>
            </div>
            
            <div className="py-4 text-center">
              <div className="animate-pulse">
                <div className="h-16 w-16 mx-auto rounded-full bg-bibocom-accent/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-bibocom-accent"></div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Nous préparons votre espace personnel...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
