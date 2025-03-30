import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole, USER_ROLE_LABELS } from '@/types/user';
import CountrySelect from '@/components/forms/register/CountrySelect';
import { Country } from '@/data/countries';
import { MapPin, UserCheck } from 'lucide-react';
import PhoneInput from '@/components/forms/register/PhoneInput';

// Schéma de validation pour le formulaire
const CompleteProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phoneNumber: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  country: z.string().min(2, "Veuillez sélectionner un pays"),
  city: z.string().min(2, "Veuillez entrer une ville"),
  department: z.string().min(2, "Veuillez entrer un département"),
  commune: z.string().min(2, "Veuillez entrer une commune"),
  role: z.nativeEnum(UserRole, {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

type CompleteProfileFormValues = z.infer<typeof CompleteProfileSchema>;

const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(CompleteProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      country: '',
      city: '',
      department: '',
      commune: '',
      role: UserRole.CLIENT,
    },
  });

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      console.log('🔑 [COMPLETE_PROFILE] Token récupéré de l\'URL');
      setToken(urlToken);
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', urlToken);
      
      // Vérifier le token et préremplir les données utilisateur disponibles
      fetchUserData(urlToken);
    } else {
      console.warn('⚠️ [COMPLETE_PROFILE] Aucun token trouvé dans l\'URL');
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous connecter à nouveau",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [location, navigate, toast]);

  const fetchUserData = async (authToken: string) => {
    try {
      // URL de l'API pour récupérer les données du profil
      const profileUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api/auth/profile`
        : 'http://localhost:3000/api/auth/profile';
      
      const response = await fetch(profileUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Échec de récupération des données utilisateur');
      }
      
      const data = await response.json();
      console.log('👤 [COMPLETE_PROFILE] Données utilisateur récupérées:', data);
      
      // Préremplir le formulaire avec les données existantes
      if (data.user) {
        const user = data.user;
        
        form.setValue('firstName', user.firstName || '');
        form.setValue('lastName', user.lastName || '');
        form.setValue('phoneNumber', user.phoneNumber || '');
        form.setValue('country', user.country || '');
        form.setValue('city', user.city || '');
        form.setValue('department', user.department || '');
        form.setValue('commune', user.commune || '');
        form.setValue('role', user.role || UserRole.CLIENT);
      }
    } catch (error) {
      console.error('🔴 [COMPLETE_PROFILE] Erreur lors de la récupération des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos informations. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const onCountryChange = (country: Country) => {
    form.setValue('country', country.name);
  };

  const onSubmit = async (values: CompleteProfileFormValues) => {
    if (!token) {
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous connecter à nouveau",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    console.log('📝 [COMPLETE_PROFILE] Soumission du formulaire:', values);
    
    try {
      // URL de l'API pour mettre à jour le profil
      const updateProfileUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api/auth/profile1`
        : 'http://localhost:3000/api/auth/profile1';
      
      const response = await fetch(updateProfileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error('Échec de mise à jour du profil');
      }
      
      const data = await response.json();
      console.log('✅ [COMPLETE_PROFILE] Profil mis à jour avec succès:', data);
      
      toast({
        title: "Profil complété",
        description: "Votre profil a été mis à jour avec succès",
      });
      
      // Rediriger vers le tableau de bord approprié en fonction du rôle
      if (values.role === UserRole.MERCHANT) {
        navigate('/merchant-dashboard');
      } else if (values.role === UserRole.SUPPLIER) {
        navigate('/supplier-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (error) {
      console.error('🔴 [COMPLETE_PROFILE] Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Compléter votre profil
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Merci de compléter vos informations pour finaliser votre inscription
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <PhoneInput form={form} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Je m'inscris en tant que*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          console.log('🔄 [COMPLETE_PROFILE] Role changed to:', value);
                          field.onChange(value);
                          form.setValue('role', value as UserRole);
                        }}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {Object.values(UserRole).map((role) => (
                          <FormItem key={role} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={role} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {USER_ROLE_LABELS[role as UserRole]}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      * Veuillez sélectionner un rôle pour continuer
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CountrySelect form={form} onCountryChange={onCountryChange} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Votre ville" 
                            {...field} 
                          />
                          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Votre département" 
                            {...field} 
                          />
                          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="commune"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commune</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Votre commune" 
                          {...field} 
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-bibocom-primary text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserCheck className="mr-2" size={20} />
                    Compléter mon profil
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
