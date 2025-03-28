
import { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '../RegisterForm';
import { Country, getDefaultCountry } from '@/data/countries';

interface PhoneInputProps {
  form: UseFormReturn<RegisterFormValues>;
  selectedCountry?: Country;
}

const PhoneInput = ({ form, selectedCountry = getDefaultCountry() }: PhoneInputProps) => {
  const [dialCode, setDialCode] = useState(selectedCountry.dialCode);
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');
  
  console.log('📱 [REGISTER] PhoneInput initialized with dial code:', dialCode);

  // Mettre à jour l'indicatif lorsque le pays change
  useEffect(() => {
    if (selectedCountry) {
      console.log('📱 [REGISTER] Updating dial code to:', selectedCountry.dialCode);
      setDialCode(selectedCountry.dialCode);
      
      // Mettre à jour le numéro complet dans le formulaire
      updateFullPhoneNumber(phoneWithoutCode, selectedCountry.dialCode);
    }
  }, [selectedCountry]);

  const updateFullPhoneNumber = (phoneNumber: string, code: string) => {
    const fullPhoneNumber = phoneNumber ? `${code} ${phoneNumber}` : '';
    console.log('📱 [REGISTER] Setting full phone number:', fullPhoneNumber);
    form.setValue('phoneNumber', fullPhoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('📱 [REGISTER] Phone number changed:', value);
    setPhoneWithoutCode(value);
    updateFullPhoneNumber(value, dialCode);
  };

  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl>
            <div className="relative flex">
              <div className="flex items-center justify-center min-w-[80px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3">
                <span className="mr-1">{selectedCountry.flag}</span>
                <span className="text-gray-700">{dialCode}</span>
              </div>
              <Input 
                className="rounded-l-none"
                placeholder="Votre numéro sans l'indicatif" 
                onChange={handlePhoneChange}
                value={phoneWithoutCode}
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;
