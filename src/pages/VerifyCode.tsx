
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserRole, mapStringToUserRole } from '@/types/user';
import { verifyCode } from '@/services/registrationService';

// Définition du type pour le scénario de vérification
type VerificationScenario = 'success' | 'incorrect' | 'expired' | 'error';

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<VerificationScenario | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer l'email et le rôle depuis la navigation
  const userEmail = location.state?.email || '';
  const userRoleString = location.state?.role || 'CLIENT';
  const userRole = mapStringToUserRole(userRoleString);
  
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
  
  const handleVerify = async () => {
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
    setErrorType(null);
    
    console.log('🔍 [VERIFY] Vérification du code:', code, 'pour email:', userEmail);
    
    toast({
      title: "Vérification en cours",
      description: "Nous vérifions votre code..."
    });
    
    try {
      const response = await verifyCode(userEmail, code);
      
      console.log('✅ [VERIFY] Code verification successful:', response);
      setSuccess(true);
      toast({
        title: "Code vérifié",
        description: "Votre compte a été vérifié avec succès!"
      });
      
      // Redirect to login after successful verification
      setTimeout(() => {
        console.log('🔄 [VERIFY] Redirecting to login page');
        navigate('/login', { 
          state: { 
            verificationSuccessful: true,
            email: userEmail
          } 
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ [VERIFY] Verification error:', error);
      
      // Détecter le type d'erreur basé sur le message
      if (error.message.includes('expiré')) {
        console.error('⏰ [VERIFY] Verification code expired');
        setError("Code de vérification expiré. Veuillez vous réinscrire.");
        setErrorType('expired');
        toast({
          title: "Code expiré",
          description: "Votre code de vérification a expiré",
          variant: "destructive"
        });
      } else if (error.message.includes('incorrect')) {
        console.error('❌ [VERIFY] Incorrect verification code');
        setError("Code de vérification incorrect. Veuillez réessayer.");
        setErrorType('incorrect');
        toast({
          title: "Code incorrect",
          description: "Le code de vérification est incorrect",
          variant: "destructive"
        });
      } else {
        console.error('❌ [VERIFY] General verification error');
        setError("Une erreur est survenue lors de la vérification");
        setErrorType('error');
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification",
          variant: "destructive"
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendCode = async () => {
    console.log('🔄 [VERIFY] Resending verification code to:', userEmail);
    
    try {
      // Pour une implémentation complète, nous devrions avoir un endpoint pour demander un nouveau code
      // Pour l'instant, nous utilisons un simple toast de confirmation
      toast({
        title: "Code renvoyé",
        description: "Un nouveau code a été envoyé à votre adresse email"
      });
      
      // Reset error states
      setError(null);
      setErrorType(null);
      setCode("");
    } catch (error) {
      console.error('❌ [VERIFY] Error resending code:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer un nouveau code. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  const handleReturnToRegister = () => {
    console.log('🔄 [VERIFY] Returning to registration page');
    navigate('/register');
  };
  
  const handleCodeChange = (value: string) => {
    console.log('🔑 [VERIFY] Code updated:', value);
    setCode(value);
    
    // Clear any error when user starts typing a new code
    if (error) {
      setError(null);
      setErrorType(null);
    }
    
    // Si le code a 6 caractères, vérifier automatiquement
    if (value.length === 6) {
      console.log('🔍 [VERIFY] Code complete, auto-verifying...');
      setTimeout(() => {
        if (!isVerifying && !success) {
          handleVerify();
        }
      }, 500);
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
                <p className="text-gray-600 text-center mt-2">
                  Vous allez être redirigé vers la page de connexion...
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
                  
                  {errorType === 'expired' ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                      <p className="text-sm text-amber-800">
                        Votre code a expiré. Cliquez sur "Retourner à l'inscription" pour vous réinscrire.
                      </p>
                      <Button 
                        className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white" 
                        onClick={handleReturnToRegister}
                      >
                        Retourner à l'inscription
                      </Button>
                    </div>
                  ) : errorType === 'incorrect' ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                      <p className="text-sm text-amber-800">
                        Code incorrect. Vous pouvez réessayer ou demander un nouveau code.
                      </p>
                      <Button 
                        className="w-full mt-2 flex items-center justify-center"
                        variant="outline" 
                        onClick={handleResendCode}
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Demander un nouveau code
                      </Button>
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
