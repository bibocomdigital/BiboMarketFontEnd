import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterStep1 from './register/RegisterStep1';
import RegisterStep2 from './register/RegisterStep2';

// Schéma Zod avec validation améliorée
const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  phoneNumber: z.string().min(9, { message: 'Numéro de téléphone invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string().min(1, { message: 'Veuillez confirmer votre mot de passe' }),
  country: z.string().min(2, { message: 'Veuillez entrer un pays valide' }),
  city: z.string().min(2, { message: 'Veuillez entrer une ville valide' }),
  department: z.string().min(2, { message: 'Veuillez entrer un département valide' }),
  commune: z.string().min(2, { message: 'Veuillez entrer une commune valide' }),
  photo: z.any().optional(),
  role: z.enum(['client', 'commercant', 'fournisseur'], {
    required_error: 'Veuillez sélectionner un rôle',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = 'client' }: { onClose?: () => void, initialRole?: 'client' | 'commercant' | 'fournisseur' }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [verificationState, setVerificationState] = useState<{
    isVerifying: boolean;
    code: string;
    error: string | null;
    success: boolean;
    isExpired: boolean;
  }>({
    isVerifying: false,
    code: '',
    error: null,
    success: false,
    isExpired: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🔄 [REGISTER] RegisterForm component initialized');
  console.log('👤 [REGISTER] Initial role:', initialRole);
  
  // Check URL for role parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'client' || roleParam === 'commercant' || roleParam === 'fournisseur')) {
      console.log('🔄 [REGISTER] Setting role from URL params:', roleParam);
      form.setValue('role', roleParam);
    }
  }, [location]);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      country: 'Sénégal',
      city: '',
      department: '',
      commune: '',
      photo: undefined,
      role: initialRole,
    },
  });

  useEffect(() => {
    console.log('🔄 [REGISTER] Setting form role to:', initialRole);
    form.setValue('role', initialRole);
  }, [initialRole, form]);

  // Check if email exists whenever it changes
  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    console.log('🔍 [REGISTER] Checking if email exists:', email);
    try {
      // Simulate API call to check email
      // In a real implementation, you would call your API
      // const response = await fetch('/api/check-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // const data = await response.json();
      // setEmailExists(data.exists);
      
      // For demo purposes, we'll just log
      console.log('📧 [REGISTER] Email check completed for:', email);
      // setEmailExists(false); // Set to true to test the UI
    } catch (error) {
      console.error('❌ [REGISTER] Error checking email:', error);
    }
  };

  useEffect(() => {
    const email = form.watch('email');
    const debounceTimer = setTimeout(() => {
      if (email) checkEmailExists(email);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [form.watch('email')]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('🖼️ [REGISTER] Photo selected:', file.name, 'Size:', file.size, 'bytes');
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('🖼️ [REGISTER] Photo preview created');
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (currentStep === 1) {
      // Validation de l'étape 1
      const { firstName, lastName, email, phoneNumber, password, confirmPassword } = form.getValues();
      const errors = [];
      
      if (!firstName) errors.push('Le prénom est requis');
      if (!lastName) errors.push('Le nom est requis');
      if (!email) errors.push('L\'email est requis');
      if (!password) errors.push('Le mot de passe est requis');
      if (password !== confirmPassword) errors.push('Les mots de passe ne correspondent pas');
      
      if (errors.length > 0) {
        console.warn('⚠️ [REGISTER] Step 1 validation failed:', errors);
        toast({
          title: "Formulaire incomplet",
          description: errors[0],
          variant: "destructive",
        });
        return;
      }
      
      if (emailExists) {
        console.warn('⚠️ [REGISTER] Email already exists, cannot proceed');
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré et vérifié.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ [REGISTER] Step 1 validation passed, moving to step 2');
      setCurrentStep(2); // Passer à l'étape 2
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      console.log('🔙 [REGISTER] Moving back to step', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVerificationCodeChange = (code: string) => {
    console.log('🔑 [REGISTER] Verification code changed:', code);
    setVerificationState(prev => ({ ...prev, code, error: null }));
  };

  const verifyCode = async () => {
    const { email } = form.getValues();
    const { code } = verificationState;
    
    if (!code || code.length !== 6) {
      console.warn('⚠️ [REGISTER] Invalid verification code format');
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer les 6 caractères du code",
        variant: "destructive"
      });
      return;
    }
    
    console.log('🔍 [REGISTER] Verifying code for email:', email);
    setVerificationState(prev => ({ ...prev, isVerifying: true, error: null }));
    
    try {
      // Simulate API call to verify the code
      // In a real implementation, you would call your API
      // const response = await fetch('/api/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, verificationCode: code })
      // });
      
      // const data = await response.json();
      // if (response.ok) {
      //   setVerificationState(prev => ({ ...prev, success: true, error: null }));
      // } else {
      //   setVerificationState(prev => ({ 
      //     ...prev, 
      //     error: data.message,
      //     isExpired: data.message.includes('expiré')
      //   }));
      // }
      
      // For demo purposes, we'll simulate different responses
      const simulatedResponses = [
        { ok: true, message: 'Vérification réussie' },
        { ok: false, message: 'Code de vérification incorrect' },
        { ok: false, message: 'Code de vérification expiré. Veuillez vous réinscrire.' }
      ];
      
      // Uncomment one of these to test different scenarios
      const simulatedResponse = simulatedResponses[0]; // Success case
      // const simulatedResponse = simulatedResponses[1]; // Incorrect code case
      // const simulatedResponse = simulatedResponses[2]; // Expired code case
      
      if (simulatedResponse.ok) {
        console.log('✅ [REGISTER] Verification successful');
        setVerificationState(prev => ({ ...prev, success: true, error: null }));
        
        setTimeout(() => {
          toast({
            title: "Vérification réussie",
            description: "Votre compte a été vérifié avec succès!",
          });
          
          navigate('/login', { state: { verifiedEmail: email } });
        }, 1500);
      } else {
        console.error('❌ [REGISTER] Verification failed:', simulatedResponse.message);
        setVerificationState(prev => ({ 
          ...prev, 
          error: simulatedResponse.message,
          isExpired: simulatedResponse.message.includes('expiré')
        }));
      }
    } catch (error) {
      console.error('❌ [REGISTER] Error during verification:', error);
      setVerificationState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Une erreur est survenue"
      }));
    } finally {
      setVerificationState(prev => ({ ...prev, isVerifying: false }));
    }
  };

  const resendVerificationCode = async () => {
    const { email } = form.getValues();
    
    console.log('🔄 [REGISTER] Resending verification code to:', email);
    
    try {
      // Simulate API call to resend verification code
      // const response = await fetch('/api/resend-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // For demo purposes
      console.log('✉️ [REGISTER] New verification code sent to:', email);
      toast({
        title: "Code renvoyé",
        description: "Un nouveau code a été envoyé à votre adresse email",
      });
    } catch (error) {
      console.error('❌ [REGISTER] Error resending verification code:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer un nouveau code de vérification",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('📝 [REGISTER] Form submitted with data:', {
      ...data,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]',
      photo: data.photo instanceof File ? `File: ${data.photo.name}` : data.photo
    });
    
    // Let's add a log to explicitly check if role is included in the form data
    console.log('👤 [REGISTER] Role value at submission:', data.role);
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          console.log(`📎 [REGISTER] Adding file to FormData: ${value.name} (${value.size} bytes)`);
          formData.append('photo', value);
        } else if (key !== 'photo' && key !== 'confirmPassword') {
          console.log(`📝 [REGISTER] Adding field to FormData: ${key}=${key === 'password' ? '[HIDDEN]' : value}`);
          formData.append(key, String(value));
        }
      });

      // Make sure role is explicitly added to the FormData
      console.log(`👤 [REGISTER] Explicitly adding role to FormData: ${data.role}`);
      formData.append('role', data.role);

      // Simulate an API call
      console.log('🔄 [REGISTER] Simulating API registration call');
      
      // In a real implementation, you would call your API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      
      console.log('✅ [REGISTER] Registration successful');
      
      toast({
        title: "Inscription réussie",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
      // Navigate to verification page
      console.log('🔄 [REGISTER] Navigating to verification page');
      navigate('/verify-code', { 
        state: { 
          role: data.role,
          email: data.email
        } 
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error('❌ [REGISTER] Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher les étapes du formulaire en fonction de l'étape courante
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegisterStep1 
            form={form} 
            photoPreview={photoPreview} 
            handlePhotoChange={handlePhotoChange} 
            nextStep={nextStep}
            emailExists={emailExists}
          />
        );
      case 2:
        return (
          <RegisterStep2 
            form={form} 
            prevStep={prevStep} 
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderStep()}
      </form>
    </Form>
  );
};

export default RegisterForm;
