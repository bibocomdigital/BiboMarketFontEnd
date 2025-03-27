
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from '@/components/forms/LoginForm';
import RegisterForm from '@/components/forms/RegisterForm';

type AuthModalProps = {
  type: 'login' | 'register';
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ type, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-2">
            {type === 'login' ? 'Connexion' : 'Inscription'}
          </DialogTitle>
        </DialogHeader>
        
        {type === 'login' ? (
          <LoginForm onClose={onClose} />
        ) : (
          <RegisterForm onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
