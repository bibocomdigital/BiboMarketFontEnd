
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
