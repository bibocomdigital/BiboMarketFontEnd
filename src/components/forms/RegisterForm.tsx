
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import RegisterStep1 from './register/RegisterStep1';
import RegisterStep2 from './register/RegisterStep2';
import { useNavigate, useLocation } from 'react-router-dom';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  phoneNumber: z.string().min(9, { message: 'Numéro de téléphone invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  country: z.string().min(2, { message: 'Veuillez entrer un pays valide' }),
  city: z.string().min(2, { message: 'Veuillez entrer une ville valide' }),
  department: z.string().min(2, { message: 'Veuillez entrer un département valide' }),
  commune: z.string().min(2, { message: 'Veuillez entrer une commune valide' }),
  photo: z.any().optional(),
  role: z.enum(['client', 'commercant', 'fournisseur'], {
    required_error: 'Veuillez sélectionner un rôle',
  }),
});

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = 'client' }: { onClose?: () => void, initialRole?: 'client' | 'commercant' | 'fournisseur' }) => {
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check URL for role parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'client' || roleParam === 'commercant' || roleParam === 'fournisseur')) {
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
      country: 'Sénégal',
      city: '',
      department: '',
      commune: '',
      photo: undefined,
      role: initialRole,
    },
  });

  useEffect(() => {
    form.setValue('role', initialRole);
  }, [initialRole, form]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else if (key !== 'photo') {
          formData.append(key, String(value));
        }
      });

      console.log('Register data:', data);
      
      toast({
        title: "Inscription réussie",
        description: "Un email de vérification vous sera envoyé pour confirmer votre compte.",
      });
      
      // Navigate to home page after successful registration
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'photo']);
      if (isValid) setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 ? (
          <RegisterStep1
            form={form}
            photoPreview={photoPreview}
            handlePhotoChange={handlePhotoChange}
            nextStep={nextStep}
          />
        ) : (
          <RegisterStep2
            form={form}
            prevStep={prevStep}
          />
        )}
      </form>
    </Form>
  );
};

export default RegisterForm;
