
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { AtSign } from 'lucide-react';

export interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>((props, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <AtSign className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="email"
        className="pl-10"
        placeholder="exemple@email.com"
        ref={ref}
        {...props}
      />
    </div>
  );
});

EmailInput.displayName = 'EmailInput';

export default EmailInput;
