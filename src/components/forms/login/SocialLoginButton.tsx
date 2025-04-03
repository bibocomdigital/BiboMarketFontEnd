
import React from 'react';
import { Facebook, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SocialLoginButtonProps = {
  provider: 'google' | 'facebook';
  onClose?: () => void;
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClose }) => {
  // Use window.location.origin to construct the backend URL if the VITE_API_URL is not set
  // This helps when your frontend and backend are on the same domain but different ports
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  
  const handleLogin = () => {
    // Close the login modal if it exists
    if (onClose) {
      onClose();
    }
    
    // Store the current URL for redirection after authentication
    localStorage.setItem('auth_redirect_url', window.location.origin + '/redirect');
    
    // Build the authentication URL
    let authUrl = '';
    
    if (provider === 'google') {
      // Direct redirection to Google OAuth
      authUrl = `${backendUrl}/api/auth/google`;
      console.log(`🔄 Redirecting to Google authentication:`, authUrl);
    } else {
      // For other providers like Facebook
      authUrl = `${backendUrl}/api/auth/${provider}`;
      console.log(`🔄 Redirecting to ${provider} authentication:`, authUrl);
    }
    
    // Redirect to the authentication API
    window.location.href = authUrl;
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
      onClick={handleLogin}
    >
      {provider === 'google' && (
        <>
          <svg viewBox="0 0 24 24" width="16" height="16" className="text-red-500">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </>
      )}
      {provider === 'facebook' && (
        <>
          <Facebook className="text-blue-600" size={16} />
          <span>Continuer avec Facebook</span>
        </>
      )}
    </Button>
  );
};

export default SocialLoginButton;
