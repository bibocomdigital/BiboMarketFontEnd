
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
  role: z.nativeEnum(UserRole, {
    required_error: 'Veuillez sélectionner un rôle',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = UserRole.CLIENT }: { onClose?: () => void, initialRole?: UserRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get('registerStep');
    return stepParam ? parseInt(stepParam, 10) : 1;
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [formData, setFormData] = useState<FormData | null>(null);
  const { toast } = useToast();
  
  console.log('🔄 [REGISTER] RegisterForm component initialized');
  console.log('👤 [REGISTER] Initial role:', initialRole);
  console.log('🔢 [REGISTER] Current step from URL:', currentStep);

  // Initialiser le formulaire avec les valeurs par défaut
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

  const updateStep = (step: number) => {
    console.log('🔄 [REGISTER] Updating step to:', step);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('registerStep', step.toString());
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
    
    setCurrentStep(step);
  };

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
  
  // Gestion du paramètre de rôle dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam) {
      console.log('🔄 [REGISTER] Role param from URL:', roleParam);
      
      let roleValue: UserRole;
      
      // Mapper la valeur du paramètre vers un rôle UserRole
      if (roleParam.toLowerCase() === 'client') {
        roleValue = UserRole.CLIENT;
      } else if (roleParam.toLowerCase() === 'commercant' || roleParam.toLowerCase() === 'merchant') {
        roleValue = UserRole.MERCHANT;
      } else if (roleParam.toLowerCase() === 'fournisseur' || roleParam.toLowerCase() === 'supplier') {
        roleValue = UserRole.SUPPLIER;
      } else {
        roleValue = initialRole;
      }
      
      console.log('🔄 [REGISTER] Setting role from URL params to:', roleValue);
      form.setValue('role', roleValue);
    }
  }, [location.search]);

  // Charger les données sauvegardées du formulaire
  useEffect(() => {
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log('🔄 [REGISTER] Loaded saved form data');
        
        Object.entries(parsedData).forEach(([key, value]) => {
          if (key !== 'photo' && key !== 'confirmPassword') {
            form.setValue(key as any, value as any);
          }
        });
        
        if (parsedData.photoPreview) {
          setPhotoPreview(parsedData.photoPreview);
        }
      } catch (error) {
        console.error('❌ [REGISTER] Error loading saved form data:', error);
      }
    }
  }, []);
  
  // Sauvegarder les données du formulaire
  useEffect(() => {
    const subscription = form.watch((data) => {
      const dataToSave = { ...data };
      delete dataToSave.password;
      delete dataToSave.confirmPassword;
      delete dataToSave.photo;
      
      localStorage.setItem('registerFormData', JSON.stringify({
        ...dataToSave,
        photoPreview
      }));
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, photoPreview]);

  // S'assurer que le rôle initial est correctement défini
  useEffect(() => {
    console.log('🔄 [REGISTER] Setting form role to:', initialRole);
    form.setValue('role', initialRole);
  }, [initialRole, form]);

  const handleCountryChange = (country: Country) => {
    console.log('🌍 [REGISTER] Country changed in parent component:', country.name);
    setSelectedCountry(country);
  };

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    console.log('🔍 [REGISTER] Checking if email exists:', email);
    try {
      console.log('📧 [REGISTER] Email check completed for:', email);
      // setEmailExists(false);
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
      const values = form.getValues();
      console.log('🔍 [DEBUG] Valeurs actuelles du formulaire:', {
        ...values,
        password: values.password ? '******' : 'non renseigné',
        confirmPassword: values.confirmPassword ? '******' : 'non renseigné'
      });
      
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
      updateStep(2);
    }
  };

  const prevStep = () => {
    console.log('👈 [REGISTER] prevStep called, current step is', currentStep);
    
    if (currentStep > 1) {
      console.log('🔙 [REGISTER] Moving back to step', currentStep - 1);
      updateStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔄 [REGISTER] Form submit event captured and prevented from refreshing');
    form.handleSubmit(onSubmit)(e);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('📝 [REGISTER] Form submitted with data:', {
      ...data,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]',
      photo: data.photo instanceof File ? `File: ${data.photo.name}` : data.photo
    });
    
    console.log('👤 [REGISTER] Role value at submission:', data.role);
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
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

      console.log(`👤 [REGISTER] Explicitly adding role to FormData: ${data.role}`);
      formData.append('role', data.role);
      
      console.log('📤 [REGISTER] Final FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`   ${pair[0]} = ${pair[0] === 'password' ? '[HIDDEN]' : (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])}`);
      }

      console.log('🔄 [REGISTER] Sending registration data to API');
      const result = await apiRegisterUser(formData);
      
      console.log('✅ [REGISTER] Registration successful:', result);
      
      toast({
        title: "Inscription réussie",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
      localStorage.removeItem('registerFormData');
      
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('registerStep');
      window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
      
      navigate('/verify-code', { 
        state: { 
          role: data.role,
          email: data.email,
          password: data.password // Transmettre le mot de passe pour la connexion automatique
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

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {renderStep()}
        
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
