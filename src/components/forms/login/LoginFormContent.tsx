
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
    setIsLoading(true);
    try {
      console.log('Login data:', data);
      
      // Vérifier que email et password sont présents
      if (!data.email || !data.password) {
        throw new Error("Email et mot de passe requis");
      }
      
      // Call the login service
      const response = await login({
        email: data.email,
        password: data.password
      });
      
      // Show success toast
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // Close the modal if it exists
      if (onClose) onClose();
      
      // Redirect based on user role from the response
      setTimeout(() => {
        const role = response.user.role;
        if (role === 'commercant') {
          navigate('/merchant-dashboard');
        } else if (role === 'fournisseur') {
          navigate('/supplier-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
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
