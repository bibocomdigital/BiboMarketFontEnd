
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type VerificationScenario = 'success' | 'incorrect' | 'expired';

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer le type d'utilisateur depuis la navigation
  const userRole = location.state?.role || 'client';
  const userEmail = location.state?.email || '';
  
  console.log('🔄 [VERIFY] VerifyCode component initialized');
  console.log('👤 [VERIFY] User role:', userRole);
  console.log('📧 [VERIFY] User email:', userEmail || 'Not provided');
  
  useEffect(() => {
    if (!userEmail) {
      console.warn('⚠️ [VERIFY] No email provided, redirecting to register');
      toast({
        title: "Données manquantes",
        description: "L'email est requis pour la vérification",
        variant: "destructive"
      });
      
      // Redirect to register if no email
      navigate('/register');
    }
  }, [userEmail, navigate, toast]);
  
  const handleVerify = () => {
    if (code.length !== 6) {
      console.warn('⚠️ [VERIFY] Code incomplete:', code.length, 'digits provided');
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer les 6 caractères du code",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    setIsExpired(false);
    
    console.log('🔍 [VERIFY] Verifying code:', code, 'for email:', userEmail);
    
    toast({
      title: "Vérification en cours",
      description: "Nous vérifions votre code..."
    });
    
    // Simuler un délai d'API
    setTimeout(() => {
      // Dans une implémentation réelle, vous appelleriez votre API de vérification ici
      // try {
      //   const response = await fetch('/api/verify', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email: userEmail, verificationCode: code })
      //   });
      //   const data = await response.json();
      //   
      //   if (response.ok) {
      //     // Success case
      //   } else {
      //     // Error cases
      //   }
      // } catch (error) {
      //   // Network error
      // }
      
      // Pour la démonstration, simulons différents scénarios possibles
      
      // Uncomment one of these scenarios to test
      const scenario: VerificationScenario = 'success'; // Success case
      // const scenario: VerificationScenario = 'incorrect'; // Incorrect code
      // const scenario: VerificationScenario = 'expired'; // Expired code
      
      switch (scenario) {
        case 'success':
          console.log('✅ [VERIFY] Code verification successful');
          setSuccess(true);
          toast({
            title: "Code vérifié",
            description: "Votre compte a été vérifié avec succès!"
          });
          
          // Redirect after successful verification
          setTimeout(() => {
            console.log('🔄 [VERIFY] Redirecting to verification pending page');
            navigate('/verification-pending', { 
              state: { 
                role: userRole, 
                email: userEmail 
              } 
            });
          }, 1500);
          break;
          
        case 'incorrect':
          console.error('❌ [VERIFY] Incorrect verification code');
          setError("Code de vérification incorrect");
          toast({
            title: "Code incorrect",
            description: "Le code de vérification est incorrect",
            variant: "destructive"
          });
          break;
          
        case 'expired':
          console.error('⏰ [VERIFY] Verification code expired');
          setError("Code de vérification expiré");
          setIsExpired(true);
          toast({
            title: "Code expiré",
            description: "Votre code de vérification a expiré",
            variant: "destructive"
          });
          break;
      }
      
      setIsVerifying(false);
    }, 1500);
  };
  
  const handleResendCode = () => {
    console.log('🔄 [VERIFY] Resending verification code to:', userEmail);
    
    // Simulate sending a new code
    toast({
      title: "Code renvoyé",
      description: "Un nouveau code a été envoyé à votre adresse email"
    });
    
    // Reset error states
    setError(null);
    setIsExpired(false);
    setCode("");
  };
  
  const handleCodeChange = (value: string) => {
    console.log('🔑 [VERIFY] Code updated:', value);
    setCode(value);
    
    // Clear any error when user starts typing a new code
    if (error) {
      setError(null);
      setIsExpired(false);
    }
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
            
            {success ? (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-700">Code vérifié</h3>
                <p className="text-gray-600 text-center mt-2">
                  Votre compte a été vérifié avec succès!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <InputOTP 
                    maxLength={6} 
                    value={code} 
                    onChange={handleCodeChange}
                    className={error ? "border-red-300" : ""}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className={error ? "border-red-300" : ""} />
                      <InputOTPSlot index={1} className={error ? "border-red-300" : ""} />
                      <InputOTPSlot index={2} className={error ? "border-red-300" : ""} />
                      <InputOTPSlot index={3} className={error ? "border-red-300" : ""} />
                      <InputOTPSlot index={4} className={error ? "border-red-300" : ""} />
                      <InputOTPSlot index={5} className={error ? "border-red-300" : ""} />
                    </InputOTPGroup>
                  </InputOTP>
                  
                  {error && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle size={16} className="mr-1" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  
                  {isExpired ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                      <p className="text-sm text-amber-800">
                        Votre code a expiré. Cliquez sur "Renvoyer" pour obtenir un nouveau code.
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Vous n'avez pas reçu de code? 
                      <button 
                        className="text-bibocom-accent ml-1 hover:underline" 
                        onClick={handleResendCode}
                      >
                        Renvoyer
                      </button>
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleVerify} 
                  className="w-full bg-bibocom-primary text-white"
                  disabled={isVerifying || code.length !== 6}
                >
                  {isVerifying ? 'Vérification en cours...' : 'Vérifier'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
