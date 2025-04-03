
import React from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

type SocialLoginButtonProps = {
  provider: 'google' | 'facebook';
  onClose?: () => void;
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClose }) => {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  
  const handleLogin = () => {
    // Fermer la modal de connexion si elle existe
    if (onClose) {
      onClose();
    }
    
    // Enregistrer l'URL actuelle pour la redirection après authentification
    localStorage.setItem('auth_redirect_url', window.location.origin + '/redirect');
    
    // Pour Google, rediriger directement vers l'API d'authentification
    const authUrl = `${backendUrl}/api/auth/${provider}`;
    
    console.log(`🔄 Redirection vers l'authentification ${provider}:`, authUrl);
    
    // Redirection vers l'API d'authentification
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
          <FaGoogle className="text-red-500" />
          <span>Google</span>
        </>
      )}
      {provider === 'facebook' && (
        <>
          <FaFacebook className="text-blue-600" />
          <span>Facebook</span>
        </>
      )}
    </Button>
  );
};

export default SocialLoginButton;
