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
import { Country, getDefaultCountry } from '@/data/countries';
import { UserRole } from '@/types/user';

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
  
  console.log('🔄 [REGISTER] RegisterForm component initialized');
  console.log('👤 [REGISTER] Initial role:', initialRole);
  console.log('🌍 [REGISTER] Initial country:', selectedCountry.name);
  
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
      country: selectedCountry.name,
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

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    console.log('🔍 [REGISTER] Checking if email exists:', email);
    try {
      const mockCheckEmail = () => {
        return new Promise<{exists: boolean}>((resolve) => {
          setTimeout(() => {
            resolve({ exists: false });
          }, 500);
        });
      };
      
      const response = await mockCheckEmail();
      console.log('📧 [REGISTER] Email check response:', response);
      
      setEmailExists(response.exists);
      
      if (response.exists) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré. Essayez de vous connecter.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ [REGISTER] Error checking email:', error);
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
        checkEmailExists(email);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [form.watch('email')]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('🖼️ [REGISTER] Photo selected:', file.name, 'Size:', file.size, 'bytes');
      
      if (file.size > 2 * 1024 * 1024) {
        console.error('❌ [REGISTER] File size too large:', file.size);
        toast({
          title: "Fichier trop volumineux",
          description: "La taille de l'image ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        console.error('❌ [REGISTER] Invalid file type:', file.type);
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
        console.log('🖼️ [REGISTER] Photo preview created');
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
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      console.log('🔙 [REGISTER] Moving back to step', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCountryChange = (countryName: string) => {
    console.log('🌍 [REGISTER] Country changed in parent component:', countryName);
    const countries = [getDefaultCountry()];
    const country = countries.find(c => c.name === countryName) || getDefaultCountry();
    setSelectedCountry(country);
    form.setValue('country', country.name);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('📝 [REGISTER] Form submitted with data:', {
      ...data,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]',
      photo: data.photo instanceof File ? `File: ${data.photo.name}` : data.photo
    });
    
    let phoneWithCountryCode = data.phoneNumber;
    if (data.phoneNumber && selectedCountry && !data.phoneNumber.includes(selectedCountry.dialCode)) {
      phoneWithCountryCode = `${selectedCountry.dialCode} ${data.phoneNumber}`;
      console.log('📱 [REGISTER] Adding country code to phone:', phoneWithCountryCode);
    }
    
    console.log('👤 [REGISTER] Role value at submission:', data.role);
    
    if (!data.city || !data.department || !data.commune) {
      console.error('❌ [REGISTER] Missing location data');
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir toutes les informations de localisation",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          console.log(`📎 [REGISTER] Adding file to FormData: ${value.name} (${value.size} bytes)`);
          formData.append('photo', value);
        } else if (key === 'phoneNumber') {
          console.log(`📱 [REGISTER] Adding phone with country code:`, phoneWithCountryCode);
          formData.append('phoneNumber', phoneWithCountryCode);
        } else if (key !== 'photo' && key !== 'confirmPassword') {
          console.log(`📝 [REGISTER] Adding field to FormData: ${key}=${key === 'password' ? '[HIDDEN]' : value}`);
          formData.append(key, String(value));
        }
      });

      console.log(`👤 [REGISTER] Explicitly adding role to FormData: ${data.role}`);
      formData.append('role', data.role);

      console.log('🔄 [REGISTER] Simulating API registration call');
      
      const mockRegister = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: "Inscription réussie",
              user: {
                id: 123,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
              }
            });
          }, 1500);
        });
      };
      
      const response = await mockRegister();
      console.log('✅ [REGISTER] Registration successful:', response);
      
      toast({
        title: "Inscription réussie",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
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
