
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Upload, User, Mail, Lock } from 'lucide-react';
import { RegisterFormValues } from '../RegisterForm';
import PhoneInput from './PhoneInput';
import { Country, getDefaultCountry } from '@/data/countries';

interface RegisterStep1Props {
  form: UseFormReturn<RegisterFormValues>;
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  emailExists: boolean;
  selectedCountry: Country;
}

const RegisterStep1 = ({ 
  form, 
  photoPreview, 
  handlePhotoChange, 
  nextStep, 
  emailExists,
  selectedCountry = getDefaultCountry()
}: RegisterStep1Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  console.log('📝 [REGISTER] Rendering RegisterStep1 component');
  console.log('👤 [REGISTER] Current form values:', form.getValues());
  console.log('📧 [REGISTER] Email exists status:', emailExists);
  console.log('🌍 [REGISTER] Selected country:', selectedCountry.name);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNextStep = () => {
    console.log('👉 [REGISTER] Next button clicked, attempting to navigate to step 2');
    
    // Validation supplémentaire avant de passer à l'étape suivante
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = form.getValues();
    
    if (!firstName || firstName.length < 2) {
      console.error('❌ [REGISTER] First name validation failed');
      form.setError('firstName', { 
        type: 'manual', 
        message: 'Le prénom doit contenir au moins 2 caractères' 
      });
      return;
    }
    
    if (!lastName || lastName.length < 2) {
      console.error('❌ [REGISTER] Last name validation failed');
      form.setError('lastName', { 
        type: 'manual', 
        message: 'Le nom doit contenir au moins 2 caractères' 
      });
      return;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('❌ [REGISTER] Email validation failed');
      form.setError('email', { 
        type: 'manual', 
        message: 'Veuillez entrer une adresse email valide' 
      });
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 9) {
      console.error('❌ [REGISTER] Phone number validation failed');
      form.setError('phoneNumber', { 
        type: 'manual', 
        message: 'Numéro de téléphone invalide' 
      });
      return;
    }
    
    if (!password || password.length < 6) {
      console.error('❌ [REGISTER] Password validation failed');
      form.setError('password', { 
        type: 'manual', 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
      return;
    }
    
    if (password !== confirmPassword) {
      console.error('❌ [REGISTER] Password confirmation failed');
      form.setError('confirmPassword', { 
        type: 'manual', 
        message: 'Les mots de passe ne correspondent pas' 
      });
      return;
    }

    console.log('✅ [REGISTER] Step 1 validation passed');
    nextStep();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="Votre prénom" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      console.log('👤 [REGISTER] First name changed:', e.target.value);
                    }}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
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
                <div className="relative">
                  <Input 
                    placeholder="Votre nom" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      console.log('👤 [REGISTER] Last name changed:', e.target.value);
                    }}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
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
              <div className="relative">
                <Input 
                  placeholder="exemple@email.com" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    console.log('📧 [REGISTER] Email changed:', e.target.value);
                  }}
                  className={emailExists ? "border-red-500 focus:border-red-500" : ""}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </FormControl>
            {emailExists && (
              <p className="text-sm font-medium text-destructive mt-1">
                Cet email est déjà enregistré et vérifié.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <PhoneInput form={form} selectedCountry={selectedCountry} />
      
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
                  onChange={(e) => {
                    field.onChange(e);
                    console.log('🔒 [REGISTER] Password changed:', '*'.repeat(e.target.value.length));
                  }}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirmez votre mot de passe" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    console.log('🔒 [REGISTER] Confirm password changed:', '*'.repeat(e.target.value.length));
                  }}
                />
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                      onChange={(e) => {
                        handlePhotoChange(e);
                        console.log('🖼️ [REGISTER] Photo selected:', e.target.files?.[0]?.name);
                      }}
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
        <Button 
          type="button" 
          onClick={handleNextStep} 
          className="w-full bg-bibocom-primary text-white"
        >
          Continuer
        </Button>
      </div>

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
        onClick={() => console.log('🔄 [REGISTER] Google register clicked')}
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
  );
};

export default RegisterStep1;
