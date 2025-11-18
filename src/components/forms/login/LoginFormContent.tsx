import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import SocialLoginButton from "./SocialLoginButton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import PhoneInput from "../register/PhoneInput";

type LoginFormContentProps = {
  initialEmail?: string;
  onClose?: () => void;
};

// Schéma de validation pour email ou téléphone
const LoginFormSchema = z.object({
  login: z.string().min(1, "L'email ou le téléphone est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().default(true),
});

const LoginFormContent: React.FC<LoginFormContentProps> = ({
  initialEmail = "",
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      login: initialEmail,
      password: "",
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (initialEmail) {
      form.setValue("login", initialEmail);
      // Déterminer le type en fonction de l'input initial
      const isPhone = /^[\+]?[1-9][\d]{0,15}$/.test(
        initialEmail.replace(/\D/g, "")
      );
      setLoginType(isPhone ? "phone" : "email");
    }
  }, [initialEmail, form]);

  // Effacer l'erreur quand l'utilisateur commence à retaper
  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) {
        setLoginError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  const toggleLoginType = () => {
    setLoginType(loginType === "email" ? "phone" : "email");
    form.setValue("login", ""); // Réinitialiser la valeur quand on change le type
  };

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setIsSubmitting(true);

    try {
      // Préparer les données selon le format attendu par le backend
      const loginData = {
        password: values.password,
        email: "",
        phoneNumber: "",
      };

      // Ajouter email OU phoneNumber selon le type de connexion
      if (loginType === "email") {
        loginData.email = values.login;
        loginData.phoneNumber = undefined;
      } else {
        loginData.phoneNumber = values.login; // Déjà formaté avec le code pays par PhoneInput
        loginData.email = undefined;
      }

      console.log("📤 [LOGIN] Données envoyées:", loginData);

      const response = await login(loginData);


      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      const userRole = response.user.role.toUpperCase();

      if (userRole === "MERCHANT" || userRole === "COMMERCANT") {
        console.log(
          "🔄 [LOGIN] Redirection vers le tableau de bord commerçant"
        );
        navigate("/merchant-dashboard");
      } else if (userRole === "SUPPLIER" || userRole === "FOURNISSEUR") {
        console.log(
          "🔄 [LOGIN] Redirection vers le tableau de bord fournisseur"
        );
        navigate("/supplier-dashboard");
      } else {
        console.log("🔄 [LOGIN] Redirection vers le tableau de bord client");
        navigate("/client-dashboard");
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("❌ [LOGIN] Erreur de connexion:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la connexion";

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Champ de connexion dynamique */}
        <FormField
          control={form.control}
          name="login" // Champ unique pour email ou téléphone
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {loginType === "email" ? "Email" : "Téléphone"}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  {loginType === "phone" ? (
                    // PhoneInput avec sélecteur de pays
                    <PhoneInput
                      form={form}
                      field={field} // Passe le field ici
                    />
                  ) : (
                    // Input email standard
                    <div className="relative">
                      <Input
                        {...field}
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                      />
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  )}

                  {/* Bouton pour changer le type de connexion */}
                  <button
                    type="button"
                    onClick={toggleLoginType}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bibocom-accent hover:text-bibocom-primary text-sm font-medium"
                  >
                    {loginType === "email"
                      ? "Utiliser le téléphone"
                      : "Utiliser l'email"}
                  </button>
                </div>
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
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Se souvenir de moi
                </FormLabel>
              </FormItem>
            )}
          />
          <button
            type="button"
            className="text-sm text-bibocom-accent hover:underline"
            onClick={() => {
              const currentLogin = form.getValues().login;
              // Si c'est un email valide, l'utiliser pour la réinitialisation
              if (currentLogin.includes("@")) {
                setResetEmail(currentLogin);
              } else {
                setResetEmail(""); // Réinitialiser si c'est un téléphone
              }
              setShowForgotPassword(true);
            }}
          >
            Mot de passe oublié?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-bibocom-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Ou connectez-vous avec
            </span>
          </div>
        </div>
        <SocialLoginButton provider="google" />
      </form>
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
      />
    </Form>
  );
};
export default LoginFormContent;
