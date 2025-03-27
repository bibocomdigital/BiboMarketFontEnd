import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Upload } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  phoneNumber: z.string().min(9, { message: 'Numéro de téléphone invalide' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
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

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ onClose, initialRole = 'client' }: { onClose?: () => void, initialRole?: 'client' | 'commercant' | 'fournisseur' }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
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

  const onSubmit = async (data: FormValues) => {
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
        title: "Inscription en cours",
        description: "Un email de vérification vous sera envoyé pour confirmer votre compte.",
      });
      
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
      const isValid = await form.trigger(['firstName', 'lastName', 'email', 'password', 'phoneNumber']);
      if (isValid) setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        {step === 1 && (
          <>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemple@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro de téléphone" {...field} />
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Créez un mot de passe" 
                        {...field} 
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Photo de profil</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-4">
                      {photoPreview && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                          <img 
                            src={photoPreview} 
                            alt="Photo de profil" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-center w-full">
                        <label 
                          htmlFor="photo-upload" 
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Cliquez pour ajouter</span> ou glissez et déposez
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                          </div>
                          <Input 
                            id="photo-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handlePhotoChange}
                            {...field}
                          />
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="button" onClick={nextStep} className="w-full bg-bibocom-primary text-white">
                Continuer
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Je m'inscris en tant que</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="client" />
                        </FormControl>
                        <FormLabel className="font-normal">Client</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="commercant" />
                        </FormControl>
                        <FormLabel className="font-normal">Commerçant</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fournisseur" />
                        </FormControl>
                        <FormLabel className="font-normal">Fournisseur</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre pays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre ville" {...field} />
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
                      <Input placeholder="Votre département" {...field} />
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
                    <Input placeholder="Votre commune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={prevStep} className="w-1/2">
                Retour
              </Button>
              <Button type="submit" className="w-1/2 bg-bibocom-primary text-white">
                S'inscrire
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => console.log('Google register')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Inscription avec Google
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default RegisterForm;
