
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterStep1 from './register/RegisterStep1';
import RegisterStep2 from './register/RegisterStep2';
import { Country, getDefaultCountry } from '@/data/countries';
import { UserRole } from '@/types/user';
import { checkEmailExists, registerUser } from '@/services/authService';

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  phoneNumber: z.string().min(9, { message: 'Numéro de téléphone invalide' }),
  password: z.string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    .refine(password => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
      
      return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    }, { message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial' }),
  confirmPassword: z.string().min(1, { message: 'Veuillez confirmer votre mot de passe' }),
  country: z.string().min(2, { message: 'Veuillez entrer un pays valide' }),
  city: z.string().min(2, { message: 'Veuillez entrer une ville valide' }),
  department: z.string().min(2, { message: 'Veuillez entrer un département valide' }),
  commune: z.string().min(2, { message: 'Veuillez entrer une commune valide' }),
  photo: z.any().optional(),
  role: z.nativeEnum(UserRole, {
    required_error: 'Veuillez sélectionner un rôle',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = UserRole.CLIENT }: { onClose?: () => void, initialRole?: UserRole }) => {
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      if (roleParam === 'client') {
        form.setValue('role', UserRole.CLIENT);
      } else if (roleParam === 'commercant' || roleParam === 'merchant') {
        form.setValue('role', UserRole.MERCHANT);
      } else if (roleParam === 'fournisseur' || roleParam === 'supplier') {
        form.setValue('role', UserRole.SUPPLIER);
      }
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
      country: selectedCountry.name,
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

  const handleCheckEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const response = await checkEmailExists(email);
      setEmailExists(response.exists);
      
      if (response.exists) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré. Essayez de vous connecter.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'email. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const email = form.watch('email');
    const debounceTimer = setTimeout(() => {
      if (email && email.includes('@')) {
        handleCheckEmailExists(email);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [form.watch('email')]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille de l'image ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier invalide",
          description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const { firstName, lastName, email, phoneNumber, password, confirmPassword } = form.getValues();
      const errors = [];
      
      if (!firstName) errors.push('Le prénom est requis');
      if (!lastName) errors.push('Le nom est requis');
      if (!email) errors.push('L\'email est requis');
      if (!phoneNumber) errors.push('Le numéro de téléphone est requis');
      if (phoneNumber && phoneNumber.length < 9) errors.push('Le numéro de téléphone doit contenir au moins 9 chiffres');
      if (!password) errors.push('Le mot de passe est requis');
      if (password !== confirmPassword) errors.push('Les mots de passe ne correspondent pas');
      
      if (errors.length > 0) {
        toast({
          title: "Formulaire incomplet",
          description: errors[0],
          variant: "destructive",
        });
        return;
      }
      
      if (emailExists) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré et vérifié.",
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    form.setValue('country', country.name);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('📝 [REGISTER] Début du processus d\'inscription', data.email);
    console.log('📝 [REGISTER] Rôle sélectionné:', data.role);
    
    let phoneWithCountryCode = data.phoneNumber;
    if (data.phoneNumber && selectedCountry && !data.phoneNumber.includes(selectedCountry.dialCode)) {
      phoneWithCountryCode = `${selectedCountry.dialCode} ${data.phoneNumber}`;
    }
    
    if (!data.city || !data.department || !data.commune) {
      console.log('❌ [REGISTER] Informations de localisation manquantes');
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir toutes les informations de localisation",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('🔄 [REGISTER] Envoi des données d\'inscription en cours...');
    
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else if (key === 'phoneNumber') {
          formData.append('phoneNumber', phoneWithCountryCode);
        } else if (key !== 'photo' && key !== 'confirmPassword') {
          formData.append(key, String(value));
        }
      });

      let backendRole;
      switch (data.role) {
        case UserRole.CLIENT:
          backendRole = "CLIENT";
          break;
        case UserRole.MERCHANT:
          backendRole = "MERCHANT";
          break;
        case UserRole.SUPPLIER:
          backendRole = "SUPPLIER";
          break;
      }

      formData.set('role', backendRole);
      console.log('👤 [REGISTER] Rôle envoyé au backend:', backendRole);

      const response = await registerUser(formData);
      console.log('✅ [REGISTER] Inscription réussie!', response);
      
      toast({
        title: "Inscription réussie",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
      console.log('🔄 [REGISTER] Préparation de la redirection vers la page de vérification...');
      console.log('📧 [REGISTER] Email:', data.email);
      console.log('🔑 [REGISTER] Mot de passe préservé pour l\'auto-connexion');
      console.log('👤 [REGISTER] Rôle:', data.role);
      
      // Ajout d'un délai plus long avant la redirection
      setTimeout(() => {
        console.log('⏱️ [REGISTER] Délai de redirection démarré (2.5s)');
        
        // Gestion de la redirection 
        if (onClose) {
          console.log('🔄 [REGISTER] Fermeture de la modal d\'inscription');
          onClose();
        }
        
        // Utilisation de window.location pour une redirection plus robuste
        console.log('🔄 [REGISTER] Redirection vers /verify-code avec les informations nécessaires');
        
        navigate('/verify-code', { 
          state: { 
            role: data.role,
            email: data.email,
            password: data.password
          },
          replace: true // Remplacer l'entrée d'historique actuelle
        });
        
        console.log('✅ [REGISTER] Redirection vers /verify-code effectuée!');
      }, 2500); // Augmenté à 2.5 secondes pour garantir que tout est bien traité
      
    } catch (error: any) {
      console.error('❌ [REGISTER] Erreur lors de l\'inscription:', error);
      
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message) {
        if (error.message.includes('déjà enregistré')) {
          errorMessage = "Cet email est déjà enregistré et vérifié.";
        } else if (error.message.includes('réseau')) {
          errorMessage = "Problème de connexion au serveur. Vérifiez votre connexion Internet.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('❌ [REGISTER] Message d\'erreur affiché:', errorMessage);
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('🔄 [REGISTER] Fin du processus d\'inscription');
    }
  };

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
            selectedCountry={selectedCountry}
          />
        );
      case 2:
        return (
          <RegisterStep2 
            form={form} 
            prevStep={prevStep} 
            isSubmitting={isSubmitting}
            onCountryChange={handleCountryChange}
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
