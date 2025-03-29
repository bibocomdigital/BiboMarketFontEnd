
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  getUserProfile, 
  updateUserProfile, 
  logout, 
  getUser,
  ProfileData
} from '@/services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const localUser = getUser();
  const [userInfo, setUserInfo] = useState({
    firstName: localUser?.firstName || '',
    lastName: localUser?.lastName || '',
    email: localUser?.email || '',
    phone: localUser?.phoneNumber || '',
    address: `${localUser?.city || ''}, ${localUser?.country || ''}`,
    bio: '', // Nous n'avons pas ce champ dans l'API
    birthdate: '', // Nous n'avons pas ce champ dans l'API
    avatar: localUser?.photo || '',
  });

  const [editInfo, setEditInfo] = useState({ ...userInfo });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Chargement du profil utilisateur...');
        setIsLoading(true);
        const userData = await getUserProfile();
        console.log('Données de profil reçues:', userData);
        
        if (userData) {
          setUserInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || '',
            address: `${userData.city || ''}, ${userData.country || ''}`,
            bio: '', // Pas dans l'API
            birthdate: '', // Pas dans l'API
            avatar: userData.photo?.toString() || '', // Convert to string if it's a File
          });
          setEditInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || '',
            address: `${userData.city || ''}, ${userData.country || ''}`,
            bio: '', // Pas dans l'API
            birthdate: '', // Pas dans l'API
            avatar: userData.photo?.toString() || '', // Convert to string if it's a File
          });
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement du profil:', error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditInfo({ ...userInfo });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Début de la sauvegarde du profil...');
      
      const addressParts = editInfo.address.split(',').map(part => part.trim());
      const city = addressParts[0] || '';
      const country = addressParts[1] || '';
      
      const profileData: ProfileData = {
        firstName: editInfo.firstName,
        lastName: editInfo.lastName,
        email: editInfo.email,
        phoneNumber: editInfo.phone,
      };
      
      if (avatarFile) {
        profileData.photo = avatarFile;
      }
      
      console.log('Données de profil à envoyer:', profileData);
      
      const updatedUser = await updateUserProfile(profileData);
      console.log('Profil mis à jour avec succès:', updatedUser);
      
      setUserInfo({
        ...editInfo,
        avatar: avatarPreview || editInfo.avatar,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Impossible de mettre à jour votre profil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditInfo({ ...editInfo, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image sélectionnée",
        description: "N'oubliez pas d'enregistrer pour appliquer les changements.",
      });
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bibocom-light to-white pt-24 pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-bibocom-primary" />
            <span className="ml-2 text-lg text-bibocom-primary">Chargement du profil...</span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage 
                          src={avatarPreview || userInfo.avatar || undefined} 
                          alt={`${userInfo.firstName} ${userInfo.lastName}`} 
                        />
                        <AvatarFallback className="bg-bibocom-primary text-white text-2xl">
                          {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                          <button 
                            className="absolute bottom-0 right-0 bg-bibocom-primary rounded-full p-1.5 text-white shadow-md hover:bg-bibocom-accent transition-colors"
                            onClick={triggerFileInput}
                          >
                            <Camera size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="absolute bottom-0 right-0 bg-bibocom-primary rounded-full p-1.5 text-white shadow-md hover:bg-bibocom-accent transition-colors"
                          onClick={handleEdit}
                        >
                          <Camera size={16} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{userInfo.firstName} {userInfo.lastName}</h3>
                    <p className="text-gray-500">{userInfo.email}</p>
                  </div>

                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-bibocom-primary/10 text-bibocom-primary' : 'hover:bg-gray-100'}`}
                    >
                      <User className="mr-3" size={20} />
                      <span>Mon profil</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-bibocom-primary/10 text-bibocom-primary' : 'hover:bg-gray-100'}`}
                    >
                      <Settings className="mr-3" size={20} />
                      <span>Paramètres</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="mr-3" size={20} />
                      <span>Déconnexion</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-3/4">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-2xl">Mon profil</CardTitle>
                      <CardDescription>Consultez et modifiez vos informations personnelles</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        className="gap-1" 
                        onClick={handleEdit}
                      >
                        <Edit size={16} />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="gap-1" 
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X size={16} />
                          Annuler
                        </Button>
                        <Button 
                          className="gap-1" 
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Prénom</label>
                        {isEditing ? (
                          <Input 
                            name="firstName" 
                            value={editInfo.firstName} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Nom</label>
                        {isEditing ? (
                          <Input 
                            name="lastName" 
                            value={editInfo.lastName} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.lastName}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Mail size={16} /> Email
                        </label>
                        {isEditing ? (
                          <Input 
                            name="email" 
                            value={editInfo.email} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.email}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone size={16} /> Téléphone
                        </label>
                        {isEditing ? (
                          <Input 
                            name="phone" 
                            value={editInfo.phone} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.phone || "Non renseigné"}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar size={16} /> Date de naissance
                        </label>
                        {isEditing ? (
                          <Input 
                            name="birthdate" 
                            value={editInfo.birthdate} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.birthdate || "Non renseignée"}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin size={16} /> Adresse
                        </label>
                        {isEditing ? (
                          <Input 
                            name="address" 
                            value={editInfo.address} 
                            onChange={handleChange} 
                          />
                        ) : (
                          <p className="p-2 border rounded-md">{userInfo.address || "Non renseignée"}</p>
                        )}
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-medium">Biographie</label>
                        {isEditing ? (
                          <Textarea 
                            name="bio" 
                            value={editInfo.bio} 
                            onChange={handleChange} 
                            rows={4}
                          />
                        ) : (
                          <p className="p-2 border rounded-md min-h-[100px]">{userInfo.bio || "Aucune biographie renseignée."}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Paramètres</CardTitle>
                    <CardDescription>Gérez vos préférences et paramètres de compte</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="notifications">
                      <TabsList className="mb-6">
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Sécurité</TabsTrigger>
                        <TabsTrigger value="preferences">Préférences</TabsTrigger>
                      </TabsList>
                      <TabsContent value="notifications" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Préférences de notifications</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">Nouvelles commandes</p>
                                <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles commandes</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="order-email" className="rounded text-bibocom-primary" checked readOnly />
                                <label htmlFor="order-email" className="text-sm">Email</label>
                                
                                <input type="checkbox" id="order-sms" className="ml-4 rounded text-bibocom-primary" checked readOnly />
                                <label htmlFor="order-sms" className="text-sm">SMS</label>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">Promotions</p>
                                <p className="text-sm text-gray-500">Recevoir des offres et promotions spéciales</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="promo-email" className="rounded text-bibocom-primary" checked readOnly />
                                <label htmlFor="promo-email" className="text-sm">Email</label>
                                
                                <input type="checkbox" id="promo-sms" className="ml-4 rounded text-bibocom-primary" />
                                <label htmlFor="promo-sms" className="text-sm">SMS</label>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pb-2">
                              <div>
                                <p className="font-medium">Newsletter mensuelle</p>
                                <p className="text-sm text-gray-500">Recevoir notre newsletter mensuelle</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="newsletter" className="rounded text-bibocom-primary" checked readOnly />
                                <label htmlFor="newsletter" className="text-sm">Email</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="security" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Sécurité du compte</h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <p className="font-medium">Changer le mot de passe</p>
                              <div className="grid gap-4">
                                <div>
                                  <label className="text-sm">Mot de passe actuel</label>
                                  <Input type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                  <label className="text-sm">Nouveau mot de passe</label>
                                  <Input type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                  <label className="text-sm">Confirmer le nouveau mot de passe</label>
                                  <Input type="password" placeholder="••••••••" />
                                </div>
                                <Button className="w-full sm:w-auto">Mettre à jour le mot de passe</Button>
                              </div>
                            </div>
                            <div className="pt-4 border-t">
                              <p className="font-medium mb-2">Sessions actives</p>
                              <div className="space-y-2">
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">Chrome sur Windows</p>
                                      <p className="text-sm text-gray-500">Paris, France • Actif maintenant</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Session actuelle</p>
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">Safari sur iPhone</p>
                                      <p className="text-sm text-gray-500">Paris, France • Dernière activité il y a 2 heures</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Déconnecter</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="preferences" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Préférences de langue et région</h3>
                          <div className="grid gap-4">
                            <div>
                              <label className="text-sm font-medium">Langue</label>
                              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
                                <option>Français</option>
                                <option>English</option>
                                <option>Español</option>
                                <option>Deutsch</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fuseau horaire</label>
                              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
                                <option>Europe/Paris (UTC+01:00)</option>
                                <option>America/New_York (UTC-05:00)</option>
                                <option>Asia/Tokyo (UTC+09:00)</option>
                                <option>Australia/Sydney (UTC+10:00)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Format de date</label>
                              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                              </select>
                            </div>
                            <Button className="w-full sm:w-auto">Enregistrer les préférences</Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
