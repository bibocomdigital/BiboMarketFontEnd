
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterStep1 from './register/RegisterStep1';
import RegisterStep2 from './register/RegisterStep2';
import { registerUser as apiRegisterUser, UserRole } from '@/services/authService';
import { Country, getDefaultCountry } from '@/data/countries';

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
  // Utiliser les valeurs de l'enum UserRole
  role: z.nativeEnum(UserRole, {
    required_error: 'Veuillez sélectionner un rôle',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = UserRole.CLIENT }: { onClose?: () => void, initialRole?: UserRole }) => {
  // Utiliser l'URL pour stocker l'étape actuelle
  const location = useLocation();
  const navigate = useNavigate();

  // État local de l'étape, initialisé à partir de l'URL ou à 1 par défaut
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get('registerStep');
    return stepParam ? parseInt(stepParam, 10) : 1;
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const { toast } = useToast();
  
  // Logs pour débogage
  console.log('🔄 [REGISTER] RegisterForm component initialized');
  console.log('👤 [REGISTER] Initial role:', initialRole);
  console.log('🔢 [REGISTER] Current step from URL:', currentStep);

  // Fonction pour mettre à jour l'étape et persister dans l'URL
  const updateStep = (step: number) => {
    console.log('🔄 [REGISTER] Updating step to:', step);
    
    // Mettre à jour l'URL sans recharger la page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('registerStep', step.toString());
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
    
    // Mettre à jour l'état local
    setCurrentStep(step);
  };

  // Surveiller les changements dans l'URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get('registerStep');
    
    if (stepParam) {
      const stepValue = parseInt(stepParam, 10);
      if (stepValue !== currentStep) {
        console.log('🔄 [REGISTER] Step changed in URL to:', stepValue);
        setCurrentStep(stepValue);
      }
    }
  }, [location.search]);
  
  // Check URL for role parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam && Object.values(UserRole).includes(roleParam as UserRole)) {
      console.log('🔄 [REGISTER] Setting role from URL params:', roleParam);
      form.setValue('role', roleParam as UserRole);
    }
  }, [location]);

  // Persister les données du formulaire entre les rendus
  useEffect(() => {
    // Récupérer les données stockées localement si elles existent
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log('🔄 [REGISTER] Loaded saved form data');
        
        // Remplir le formulaire avec les données sauvegardées
        Object.entries(parsedData).forEach(([key, value]) => {
          if (key !== 'photo' && key !== 'confirmPassword') {
            form.setValue(key as any, value as any);
          }
        });
        
        // Si une photo était présente
        if (parsedData.photoPreview) {
          setPhotoPreview(parsedData.photoPreview);
        }
      } catch (error) {
        console.error('❌ [REGISTER] Error loading saved form data:', error);
      }
    }
    
    // Nettoyer localStorage au démontage du composant
    return () => {
      // Ne pas supprimer les données à moins que le formulaire soit soumis ou explicitement abandonné
    };
  }, []);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      country: getDefaultCountry().name,
      city: '',
      department: '',
      commune: '',
      photo: undefined,
      role: initialRole,
    },
  });

  // Sauvegarder les données du formulaire lorsqu'elles changent
  useEffect(() => {
    const subscription = form.watch((data) => {
      // Exclure les données sensibles comme les mots de passe et les fichiers
      const dataToSave = { ...data };
      delete dataToSave.password;
      delete dataToSave.confirmPassword;
      delete dataToSave.photo;
      
      // Sauvegarder dans localStorage
      localStorage.setItem('registerFormData', JSON.stringify({
        ...dataToSave,
        photoPreview // Sauvegarder également la prévisualisation de la photo
      }));
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, photoPreview]);

  useEffect(() => {
    console.log('🔄 [REGISTER] Setting form role to:', initialRole);
    form.setValue('role', initialRole);
  }, [initialRole, form]);

  // Gérer le changement de pays
  const handleCountryChange = (country: Country) => {
    console.log('🌍 [REGISTER] Country changed in parent component:', country.name);
    setSelectedCountry(country);
  };

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

  const nextStep = () => {
    console.log('👉 [REGISTER] nextStep called, current step is', currentStep);
    
    if (currentStep === 1) {
      // Récupérer les valeurs du formulaire et les afficher pour déboguer
      const values = form.getValues();
      console.log('🔍 [DEBUG] Valeurs actuelles du formulaire:', {
        ...values,
        password: values.password ? '******' : 'non renseigné',
        confirmPassword: values.confirmPassword ? '******' : 'non renseigné'
      });
      
      // Validate first step fields
      const { firstName, lastName, email, phoneNumber, password, confirmPassword } = values;
      const errors = [];
      
      if (!firstName) {
        console.log('🔍 [DEBUG] Erreur: prénom manquant');
        errors.push('Le prénom est requis');
      }
      if (!lastName) {
        console.log('🔍 [DEBUG] Erreur: nom manquant');
        errors.push('Le nom est requis');
      }
      if (!email) {
        console.log('🔍 [DEBUG] Erreur: email manquant');
        errors.push('L\'email est requis');
      }
      if (!password) {
        console.log('🔍 [DEBUG] Erreur: mot de passe manquant');
        errors.push('Le mot de passe est requis');
      }
      if (password !== confirmPassword) {
        console.log('🔍 [DEBUG] Erreur: les mots de passe ne correspondent pas');
        errors.push('Les mots de passe ne correspondent pas');
      }
      
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
      updateStep(2); // Utiliser updateStep au lieu de setCurrentStep
    }
  };

  const prevStep = () => {
    console.log('👈 [REGISTER] prevStep called, current step is', currentStep);
    
    if (currentStep > 1) {
      console.log('🔙 [REGISTER] Moving back to step', currentStep - 1);
      updateStep(currentStep - 1); // Utiliser updateStep au lieu de setCurrentStep
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
      
      // Log every field that will be sent to the server
      console.log('📋 [REGISTER] Preparing FormData with fields:');
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          console.log(`📎 [REGISTER] Adding file to FormData: ${key}=${value.name} (${value.size} bytes)`);
          formData.append('photo', value);
        } else if (key !== 'photo' && key !== 'confirmPassword') {
          console.log(`📝 [REGISTER] Adding field to FormData: ${key}=${key === 'password' ? '[HIDDEN]' : value}`);
          formData.append(key, String(value));
        }
      });

      // Make sure role is explicitly added to the FormData
      console.log(`👤 [REGISTER] Explicitly adding role to FormData: ${data.role}`);
      formData.append('role', data.role);
      
      // Debug: Log all FormData entries
      console.log('📤 [REGISTER] Final FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`   ${pair[0]} = ${pair[0] === 'password' ? '[HIDDEN]' : (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])}`);
      }

      // Appeler votre service API pour l'inscription
      console.log('🔄 [REGISTER] Sending registration data to API');
      const result = await apiRegisterUser(formData);
      
      console.log('✅ [REGISTER] Registration successful:', result);
      
      toast({
        title: "Inscription réussie",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
      // Nettoyer les données sauvegardées
      localStorage.removeItem('registerFormData');
      
      // Nettoyer le paramètre d'étape de l'URL
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('registerStep');
      window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
      
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

  // Render different steps
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
        return (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <h3 className="font-bold">Étape inconnue : {currentStep}</h3>
            <p>Il semble y avoir un problème avec l'étape du formulaire.</p>
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => updateStep(1)}
              >
                Retour à l'étape 1
              </Button>
            </div>
          </div>
        );
    }
  };

  // Handler spécifique pour prévenir le comportement par défaut du formulaire
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher le comportement par défaut
    console.log('🔄 [REGISTER] Form submit event captured and prevented from refreshing');
    form.handleSubmit(onSubmit)(e); // Passer l'événement à handleSubmit
  };

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {renderStep()}
        
        {/* Indicateur d'étape (pour débogage) */}
        <div className="mt-4 pt-2 text-center border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Étape {currentStep} sur 2
          </p>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
