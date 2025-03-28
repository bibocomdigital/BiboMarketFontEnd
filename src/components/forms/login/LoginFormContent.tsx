
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import SocialLoginButton from './SocialLoginButton';
import { loginFormSchema, LoginFormValues } from './LoginFormTypes';
import { login } from '@/services/authService';

interface LoginFormContentProps {
  onClose?: () => void;
}

const LoginFormContent = ({ onClose }: LoginFormContentProps) => {
  const navigate = useNavigate();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('🚀 [LOGIN] Début de la soumission du formulaire de connexion');
    console.log('📝 [LOGIN] Données soumises:', { email: data.email, password: '********' });
    
    setIsLoading(true);
    try {
      console.log('🔄 [LOGIN] Tentative de connexion avec:', data.email);
      
      // Vérifier que email et password sont présents
      if (!data.email || !data.password) {
        console.error('❌ [LOGIN] Email ou mot de passe manquant');
        toast({
          title: "Erreur de connexion",
          description: "Email et mot de passe requis",
          variant: "destructive",
        });
        return;
      }
      
      // Call the login service
      console.log('🔄 [LOGIN] Appel du service de connexion...');
      const response = await login({
        email: data.email,
        password: data.password
      });
      
      console.log('✅ [LOGIN] Connexion réussie:', response);
      console.log('👤 [LOGIN] Rôle de l\'utilisateur (exact):', response.user.role);
      console.log('👤 [LOGIN] Rôle de l\'utilisateur (lowercase):', response.user.role.toLowerCase());
      console.log('👤 [LOGIN] Type de la valeur du rôle:', typeof response.user.role);
      
      // Show success toast
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // Close the modal if it exists
      if (onClose) {
        console.log('🔄 [LOGIN] Fermeture de la modale');
        onClose();
      }
      
      // Redirect based on user role from the response
      const role = response.user.role.toLowerCase(); // Convertir en minuscules pour s'assurer que la comparaison fonctionne
      console.log('🔄 [LOGIN] Redirection basée sur le rôle (en minuscules):', role);
      
      // Vérifier exactement les valeurs des rôles pour le debugging
      console.log('🔍 [LOGIN] Vérification du rôle exact pour la redirection:');
      console.log('🔍 [LOGIN] Est-ce "merchant"?', role === 'merchant');
      console.log('🔍 [LOGIN] Est-ce "commercant"?', role === 'commercant');
      console.log('🔍 [LOGIN] Est-ce "supplier"?', role === 'supplier');
      console.log('🔍 [LOGIN] Est-ce "fournisseur"?', role === 'fournisseur');
      console.log('🔍 [LOGIN] Est-ce "client"?', role === 'client');
      
      setTimeout(() => {
        // Implémentation robuste de la redirection qui gère les variations linguistiques des rôles
        if (role === 'merchant' || role === 'commercant') {
          console.log('🔄 [LOGIN] Redirection vers le tableau de bord commerçant');
          navigate('/merchant-dashboard');
        } else if (role === 'supplier' || role === 'fournisseur') {
          console.log('🔄 [LOGIN] Redirection vers le tableau de bord fournisseur');
          navigate('/supplier-dashboard');
        } else {
          console.log('🔄 [LOGIN] Redirection vers le tableau de bord client');
          navigate('/client-dashboard');
        }
      }, 500);
    } catch (error: any) {
      console.error('❌ [LOGIN] Erreur détaillée de connexion:', error);
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 [LOGIN] Fin du processus de connexion');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailInput form={form} />
          <PasswordInput form={form} />
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setForgotPasswordOpen(true)}
              className="text-sm text-bibocom-primary hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-bibocom-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
          
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
            </div>
          </div>
          
          <SocialLoginButton onClose={onClose} />
        </form>
      </Form>

      <ForgotPasswordDialog 
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
      />
    </>
  );
};

export default LoginFormContent;
