
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import SocialLoginButton from './SocialLoginButton';
import { LoginFormSchema } from './LoginFormTypes';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type LoginFormContentProps = {
  initialEmail?: string;
  onClose?: () => void;
};

const LoginFormContent: React.FC<LoginFormContentProps> = ({ initialEmail = '', onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: initialEmail,
      password: '',
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (initialEmail) {
      console.log('📧 [LOGIN] Setting initial email:', initialEmail);
      form.setValue('email', initialEmail);
    }
  }, [initialEmail, form]);

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    console.log('📝 [LOGIN] Form submitted with data:', {
      email: values.email,
      password: '[HIDDEN]',
    });
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'une requête d'authentification
      console.log('🔄 [LOGIN] Sending authentication request...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ [LOGIN] Authentication successful');
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      // Redirect to appropriate dashboard based on user role
      console.log('🔄 [LOGIN] Redirecting to dashboard...');
      navigate('/client-dashboard');
      
      if (onClose) {
        console.log('🔄 [LOGIN] Closing dialog...');
        onClose();
      }
    } catch (error) {
      console.error('❌ [LOGIN] Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <EmailInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Se souvenir de moi</FormLabel>
              </FormItem>
            )}
          />
          <button
            type="button"
            className="text-sm text-bibocom-accent hover:underline"
            onClick={() => {
              console.log('🔄 [LOGIN] Opening forgot password dialog...');
              setResetEmail(form.getValues().email);
              setShowForgotPassword(true);
            }}
          >
            Mot de passe oublié?
          </button>
        </div>
        <Button
          type="submit"
          className="w-full bg-bibocom-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou connectez-vous avec</span>
          </div>
        </div>
        <SocialLoginButton />
      </form>
      <ForgotPasswordDialog 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword} 
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
      />
    </Form>
  );
};

export default LoginFormContent;
