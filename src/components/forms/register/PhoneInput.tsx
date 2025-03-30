
import { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Country, getDefaultCountry } from '@/data/countries';

// Extended to accommodate CompleteProfileFormValues as well
interface PhoneInputProps {
  form: UseFormReturn<any>; // Accept any form type
  selectedCountry?: Country;
}

const PhoneInput = ({ form, selectedCountry = getDefaultCountry() }: PhoneInputProps) => {
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');
  
  console.log('📱 [REGISTER] PhoneInput initialized with country:', selectedCountry.name);

  // Update when country changes
  useEffect(() => {
    if (selectedCountry) {
      console.log('📱 [REGISTER] Country changed to:', selectedCountry.name);
      
      // Update the full phone number in the form
      updateFullPhoneNumber(phoneWithoutCode);
    }
  }, [selectedCountry]);

  const updateFullPhoneNumber = (phoneNumber: string) => {
    // We only register the number without the prefix
    console.log('📱 [REGISTER] Setting phone number:', phoneNumber);
    form.setValue('phoneNumber', phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('📱 [REGISTER] Phone number changed:', value);
    setPhoneWithoutCode(value);
    updateFullPhoneNumber(value);
  };

  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="Votre numéro de téléphone" 
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
