import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Package,
  BarChart2,
  Users,
  PlusCircle,
  Settings,
  Menu,
  Store,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getMyShop } from "@/services/shopService";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NoShop from "@/components/shop/NoShop";
import ShopOverview from "@/components/shop/ShopOverview";
import EditShopDialog from "@/components/shop/EditShopDialog";
import NotificationCenter from "@/components/notification/NotificationCenter "; // Importation du composant de notifications
// Importation du composant de messages
import { Alert, AlertDescription } from "@/components/ui/alert";
import { logout } from "@/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageCenter from "@/components/MessageCenter";

const MerchantDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEditShop, setShowEditShop] = useState(false);

  // Requête pour récupérer les informations de la boutique
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
    refetchInterval: false,
  });

  // Vérifier correctement si l'utilisateur a une boutique
  // Modification ici pour s'assurer que hasShop est correctement évalué
  const hasShop = !isError && shopData && shopData.id;

  // Pour débugger
  useEffect(() => {
    console.log("Shop data:", shopData);
    console.log("Has shop?", hasShop);
  }, [shopData, hasShop]);

  const handleShopCreated = () => {
    toast({
      title: "Boutique créée avec succès",
      description:
        "Votre boutique a été créée et est maintenant visible pour vos clients.",
    });

    console.log(
      "🔄 [MERCHANT] Rafraîchissement des données de la boutique après création"
    );
    // Forcer un refetch pour récupérer les nouvelles données
    setTimeout(() => {
      refetch();
    }, 1000); // Petit délai pour s'assurer que le backend a bien traité la création
  };

  const handleShopUpdated = () => {
    console.log(
      "🔄 [MERCHANT] Rafraîchissement des données de la boutique après mise à jour"
    );
    // Forcer un refetch pour récupérer les données mises à jour
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const handleLogout = () => {
    console.log("👋 [MERCHANT] Déconnexion de l'utilisateur");
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate("/login");
  };

  // Fonction pour naviguer vers WhatsApp clone
  const navigateToWhatsAppClone = () => {
    navigate("/whatsapp"); // ou l'URL de votre WhatsApp clone
  };

  // Log pour débugger
  useEffect(() => {
    if (isError) {
      console.log(
        "❌ [MERCHANT] Erreur lors de la récupération de la boutique:",
        error
      );
    }
    if (hasShop) {
      console.log("✅ [MERCHANT] Boutique trouvée:", shopData);
    } else {
      console.log("ℹ️ [MERCHANT] Aucune boutique trouvée pour ce marchand");
    }
  }, [isError, hasShop, shopData, error]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header avec menu */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/merchant-dashboard" className="text-2xl font-bold text-bibocom-primary">
              <span className="flex items-center">
                <Store className="mr-2 h-6 w-6" />
                BibocomMarket
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {hasShop && (
              <>
                <Link
                  to="/mes-produits"
                  className="text-gray-600 hover:text-bibocom-accent transition-colors"
                >
                  Mes Produits
                </Link>
                <Link
                  to="/commandes-recues"
                  className="text-gray-600 hover:text-bibocom-accent transition-colors"
                >
                  Commandes
                </Link>

                <Link
                  to="/statistiques"
                  className="text-gray-600 hover:text-bibocom-accent transition-colors"
                >
                  Statistiques
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Centre de notifications */}
            <NotificationCenter />
            <div className="relative">
              <MessageCenter onRedirect={navigateToWhatsAppClone} />
              {/* Dropdown messages */}
            </div>

            {/* User dropdown menu (uses shadcn dropdown) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
                  <User size={20} className="text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </DropdownMenuItem>
                {hasShop && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/boutique-parametres"
                      className="flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres boutique</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
                  <Menu size={20} className="text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col h-full py-6">
                  <div className="px-2 mb-6">
                    <Link
                      to="/"
                      className="text-xl font-bold text-bibocom-primary flex items-center"
                    >
                      <Store className="mr-2 h-6 w-6" />
                      BibocomMarket
                    </Link>
                  </div>

                  <nav className="flex-1 space-y-4 px-2">
                    {hasShop && (
                      <>
                        <Link
                          to="/mes-produits"
                          className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <Package className="mr-3 h-5 w-5 text-bibocom-accent" />
                          Mes Produits
                        </Link>
                        <Link
                          to="/commandes-recues"
                          className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <Package className="mr-3 h-5 w-5 text-green-500" />
                          Commandes
                        </Link>
                        <div className="px-4 py-2">
                          <MessageCenter onRedirect={navigateToWhatsAppClone} />
                        </div>
                        <Link
                          to="/statistiques"
                          className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <BarChart2 className="mr-3 h-5 w-5 text-purple-500" />
                          Statistiques
                        </Link>
                      </>
                    )}
                  </nav>

                  <div className="border-t pt-4 mt-4 px-2">
                    <Link
                      to="/profile"
                      className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Mon profil
                    </Link>
                    {hasShop && (
                      <Link
                        to="/boutique-parametres"
                        className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Paramètres boutique
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-2 px-4 text-red-500 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Titre de la page */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bibocom-primary">
              Espace commerçant
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez votre boutique et développez votre activité
            </p>

            {hasShop && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">
                  Vous gérez actuellement la boutique{" "}
                  <span className="font-semibold">{shopData.name}</span>. Les
                  commerçants ne peuvent gérer qu'une seule boutique à la fois.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* État de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bibocom-primary"></div>
              <span className="ml-3 text-bibocom-primary">Chargement...</span>
            </div>
          )}

          {/* Affichage de la boutique ou du composant NoShop */}
          {!isLoading && (
            <>
              {hasShop ? (
                <>
                  <ShopOverview
                    shop={shopData}
                    products={shopData.products || []}
                    onEditClick={() => setShowEditShop(true)}
                  />

                  {/* Modal d'édition de la boutique */}
                  {showEditShop && (
                    <EditShopDialog
                      shop={shopData}
                      open={showEditShop}
                      onOpenChange={setShowEditShop}
                      onShopUpdated={handleShopUpdated}
                    />
                  )}
                </>
              ) : (
                <NoShop onShopCreated={handleShopCreated} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 BibocomMarket. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MerchantDashboard;
