
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
}

const ForgotPasswordDialog = ({ open, onOpenChange, resetEmail, setResetEmail }: ForgotPasswordDialogProps) => {
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Password reset requested for:', resetEmail);
      
      toast({
        title: "Demande envoyée",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-2">
            Mot de passe oublié
          </DialogTitle>
        </DialogHeader>
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
            />
            <p className="text-sm text-gray-500">
              Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Envoyer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
