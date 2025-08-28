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
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '@/services/authService';

type LoginFormContentProps = {
  initialEmail?: string;
  onClose?: () => void;
};

const LoginFormContent: React.FC<LoginFormContentProps> = ({ initialEmail = '', onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null); // ✅ Nouvel état pour les erreurs
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
      form.setValue('email', initialEmail);
    }
  }, [initialEmail, form]);

  // Effacer l'erreur quand l'utilisateur commence à retaper
  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) {
        setLoginError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await login({
        email: values.email,
        password: values.password
      });
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      // Débogage - Affichons le rôle reçu pour le tracer
      console.log('👤 [LOGIN] Rôle de l\'utilisateur:', response.user.role);
      console.log('👤 [LOGIN] Type du rôle reçu:', typeof response.user.role);
      
      // Correction: normaliser le rôle reçu pour la comparaison
      const userRole = response.user.role.toUpperCase();
      
      // TOUJOURS rediriger en fonction du rôle utilisateur, en ignorant le paramètre redirect
      if (userRole === 'MERCHANT' || userRole === 'COMMERCANT') {
        console.log('🔄 [LOGIN] Redirection vers le tableau de bord commerçant');
        navigate('/merchant-dashboard');
      } else if (userRole === 'SUPPLIER' || userRole === 'FOURNISSEUR') {
        console.log('🔄 [LOGIN] Redirection vers le tableau de bord fournisseur');
        navigate('/supplier-dashboard');
      } else {
        console.log('🔄 [LOGIN] Redirection vers le tableau de bord client');
        navigate('/client-dashboard');
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('❌ [LOGIN] Erreur de connexion:', error);
      
      // Afficher le vrai message d'erreur du serveur
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion";
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage, // ✅ Utiliser le vrai message d'erreur
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔍 DEBUG - Affichage permanent pour test */}
        <div style={{ 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca', 
          padding: '12px', 
          borderRadius: '6px',
          color: '#dc2626'
        }}>
          <strong>DEBUG:</strong> loginError = "{loginError}" | Est null: {loginError === null ? 'OUI' : 'NON'}
        </div>

        {/* ✅ Affichage de l'erreur de connexion - Version simple */}
        {loginError && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}
          >
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span>{loginError}</span>
            </div>
          </div>
        )}

        {/* 🔍 Bouton de test pour forcer une erreur */}
        <button 
          type="button"
          onClick={() => {
            console.log('🔍 Test - Forçage d\'une erreur');
            setLoginError('Test d\'erreur - cliquez sur connexion pour tester');
          }}
          style={{
            backgroundColor: '#fbbf24',
            color: '#92400e',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🔍 TEST - Forcer une erreur
        </button>

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
        <SocialLoginButton provider="google" />
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