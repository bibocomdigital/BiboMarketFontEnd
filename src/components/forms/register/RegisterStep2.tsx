
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';
import { RegisterFormValues } from '../RegisterForm';

interface RegisterStep2Props {
  form: UseFormReturn<RegisterFormValues>;
  prevStep: () => void;
  isSubmitting?: boolean;
}

const RegisterStep2 = ({ form, prevStep, isSubmitting = false }: RegisterStep2Props) => {
  
  // Ajoutons quelques logs pour déboguer
  console.log('🔄 [REGISTER] Rendering RegisterStep2 component');
  console.log('👤 [REGISTER] Current form values for step 2:', form.getValues());
  
  return (
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
              <div className="relative">
                <Input placeholder="Votre pays" {...field} />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
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
                <div className="relative">
                  <Input placeholder="Votre ville" {...field} />
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
                  <Input placeholder="Votre département" {...field} />
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
                <Input placeholder="Votre commune" {...field} />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={prevStep} className="w-1/2">
          Retour
        </Button>
        <Button 
          type="submit" 
          className="w-1/2 bg-bibocom-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </div>
    </>
  );
};

export default RegisterStep2;
