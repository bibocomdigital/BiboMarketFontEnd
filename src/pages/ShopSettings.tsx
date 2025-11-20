import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  ArrowLeft,
  Settings,
  Store,
  Clock,
  Truck,
  CreditCard,
  BarChart3,
  Package,
  Bell,
  Save,
  UploadCloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getMyShop, updateShop } from '@/services/shopService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const shopFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  phoneNumber: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 caractères"),
});

const ShopSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Fetch shop data
  const {
    data: shopData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myShop"],
    queryFn: getMyShop,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof shopFormSchema>>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phoneNumber: '',
    },
  });

  // Update form when shop data loads
  useEffect(() => {
    if (shopData) {
      form.reset({
        name: shopData.name || '',
        description: shopData.description || '',
        address: shopData.address || '',
        phoneNumber: shopData.phoneNumber || '',
      });

      // Set logo preview
      if (shopData.logo) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        setLogoPreview(`${backendUrl}/uploads/${shopData.logo.split('/').pop()}`);
      }
    }
  }, [shopData, form]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image valide",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 2MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setLogoFile(file);
  };

  const onSubmit = async (values: z.infer<typeof shopFormSchema>) => {
    if (!shopData) return;

    setIsSubmitting(true);
    try {
      console.log("🔄 [SHOP SETTINGS] Updating shop settings");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('address', values.address);
      formData.append('phoneNumber', values.phoneNumber);

      // Add logo file if changed
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      await updateShop(shopData.id, formData as any);

      console.log("✅ [SHOP SETTINGS] Shop updated successfully");

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de votre boutique ont été mis à jour avec succès",
      });

      // Refetch shop data
      refetch();

      // Clean up object URLs
      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }
    } catch (error) {
      console.error("❌ [SHOP SETTINGS] Error updating shop:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bibocom-primary"></div>
      </div>
    );
  }

  if (isError || !shopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">
            Impossible de charger les paramètres de votre boutique.
          </p>
          <Button onClick={() => navigate('/merchant-dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/merchant-dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Paramètres boutique
                </h1>
                <p className="text-sm text-gray-600">
                  Gérez les paramètres de {shopData.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Commerce
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Livraison
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informations générales
                </CardTitle>
                <CardDescription>
                  Modifiez les informations de base de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-20 h-20 border-2 border-gray-200">
                        {logoPreview ? (
                          <AvatarImage src={logoPreview} alt="Logo de la boutique" />
                        ) : (
                          <AvatarFallback className="bg-bibocom-primary text-white text-2xl">
                            {shopData.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div>
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <UploadCloud className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Changer le logo</span>
                            <input
                              id="logo-upload"
                              name="logo"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleLogoChange}
                            />
                          </div>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Formats recommandés : JPG, PNG. Taille maximale : 2MB
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de la boutique</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom de votre boutique" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="Numéro de téléphone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (optionnel)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@exemple.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                              <Input placeholder="Adresse de votre boutique" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre boutique"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horaires d'ouverture
                </CardTitle>
                <CardDescription>
                  Définissez vos horaires d'ouverture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cette fonctionnalité sera bientôt disponible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Politiques de vente</CardTitle>
                <CardDescription>
                  Définissez vos conditions de vente et politiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cette fonctionnalité sera bientôt disponible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Settings */}
          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Options de livraison
                </CardTitle>
                <CardDescription>
                  Configurez vos méthodes de livraison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cette fonctionnalité sera bientôt disponible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques de vente
                </CardTitle>
                <CardDescription>
                  Consultez les performances de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {shopData.products?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600">Produits</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-600">Ventes ce mois</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-purple-600">Clients</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Préférences de notifications
                </CardTitle>
                <CardDescription>
                  Gérez vos notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cette fonctionnalité sera bientôt disponible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ShopSettings;
