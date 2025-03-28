
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer le type d'utilisateur depuis la navigation
  const userRole = location.state?.role || 'client';
  const userEmail = location.state?.email || '';
  
  const handleVerify = () => {
    if (code.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer les 6 caractères du code",
        variant: "destructive"
      });
      return;
    }
    
    // Simuler une vérification réussie
    toast({
      title: "Vérification en cours",
      description: "Nous vérifions votre code..."
    });
    
    // Rediriger vers la page d'attente
    setTimeout(() => {
      navigate('/verification-pending', { state: { role: userRole, email: userEmail } });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <Link to="/register" className="inline-flex items-center text-bibocom-primary hover:text-bibocom-accent mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Retour à l'inscription
          </Link>
          
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-bibocom-primary">Vérification</h2>
              <p className="text-gray-500 mt-2">
                Veuillez entrer le code à 6 caractères que nous avons envoyé à 
                <span className="font-medium block mt-1">{userEmail || "votre email"}</span>
              </p>
            </div>
            
            <div className="mb-8">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Vous n'avez pas reçu de code? 
                <button 
                  className="text-bibocom-accent ml-1 hover:underline" 
                  onClick={() => toast({
                    title: "Code renvoyé",
                    description: "Un nouveau code a été envoyé à votre adresse email"
                  })}
                >
                  Renvoyer
                </button>
              </p>
            </div>
            
            <Button 
              onClick={handleVerify} 
              className="w-full bg-bibocom-primary text-white"
            >
              Vérifier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
