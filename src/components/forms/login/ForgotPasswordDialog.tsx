
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
}

const ForgotPasswordDialog = ({ open, onOpenChange, resetEmail, setResetEmail }: ForgotPasswordDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Password reset requested for:', resetEmail);
      
      // Simuler un délai pour l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Demande envoyée",
        description: "Si un compte existe avec cet email, vous recevrez un code de réinitialisation.",
      });
      
      setStep('code');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Verification code submitted:', verificationCode);
      
      // Simuler un délai pour la vérification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Pour la démonstration, on considère que le code est valide
      toast({
        title: "Code vérifié",
        description: "Votre mot de passe a été réinitialisé avec succès.",
      });
      
      onOpenChange(false);
      
      // Redirection vers la page de profil avec un délai
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Le code de vérification est invalide",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when dialog closes
    setStep('email');
    setVerificationCode('');
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-2">
            {step === 'email' ? 'Mot de passe oublié' : 'Vérification du code'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'email' ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="reset-email">Email</FormLabel>
              <Input 
                id="reset-email" 
                placeholder="Votre adresse email" 
                type="email" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                Nous vous enverrons un code pour réinitialiser votre mot de passe.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="verification-code">Code de vérification</FormLabel>
              <Input 
                id="verification-code" 
                placeholder="Entrez le code reçu par email" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                Entrez le code que nous avons envoyé à {resetEmail}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Vérification...
                  </>
                ) : (
                  "Vérifier"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
