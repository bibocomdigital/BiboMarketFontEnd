import React, { useState, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Store, MapPin, Info } from 'lucide-react';
import { Shop, getAllShops } from '../services/shopService';
import { useNavigate } from 'react-router-dom';

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const fetchedShops = await getAllShops();
        setShops(fetchedShops);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Fonction pour naviguer vers les détails de la boutique
  const handleShowShopDetails = (shopId: number) => {
    navigate(`/boutique/${shopId}`);
  };

  // Simplified animated text wrapper
  const AnimatedText = ({ children, delay }: { children: React.ReactNode, delay?: number }) => (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );

  // Simplified badge
  const Badge = ({ children, variant }: { children: React.ReactNode, variant?: string }) => (
    <span className={`px-3 py-1 rounded-full text-sm 
      ${variant === 'accent' ? 'bg-bibocom-accent/10 text-bibocom-accent' : 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-bibocom-light/50 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-10 text-center">
          <p className="text-bibocom-primary">Chargement des boutiques...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-bibocom-light/50 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-10 text-center">
          <p className="text-red-500">Erreur : {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-bibocom-light/50 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="text-center mb-16">
          <AnimatedText delay={100}>
            <Badge variant="accent" className="mb-4">
              Nos Boutiques
            </Badge>
          </AnimatedText>
          
          <AnimatedText delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Découvrez <span className="text-gradient">nos commerçants</span>
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={300}>
            <p className="text-bibocom-primary/80 max-w-2xl mx-auto">
              Explorez une variété de boutiques locales offrant des produits uniques et de qualité.
            </p>
          </AnimatedText>
        </div>
        
        <AnimatedText delay={400}>
          {shops.length === 0 ? (
            <div className="text-center text-bibocom-primary/70">
              Aucune boutique disponible pour le moment.
            </div>
          ) : (
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="py-4">
                {shops.map((shop) => (
                  <CarouselItem key={shop.id} className="sm:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="h-full glass-card p-6 flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 group relative">
                      {/* Bouton de détails de la boutique */}
                      <button 
                        onClick={() => handleShowShopDetails(shop.id)}
                        className="absolute top-2 right-2 z-10 bg-bibocom-primary/10 hover:bg-bibocom-primary/20 p-2 rounded-full transition-colors"
                        title="Voir les détails de la boutique"
                      >
                        <Info size={20} className="text-bibocom-primary" />
                      </button>

                      {/* Shop Logo */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-bibocom-light shadow-md group-hover:scale-105 transition-transform duration-300">
                          {shop.logo ? (
                            <img 
                              src={shop.logo || '/placeholder-shop.jpg'} 
                              alt={`Logo de ${shop.name}`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-bibocom-light flex items-center justify-center">
                              <Store className="w-16 h-16 text-bibocom-primary/70" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Shop Details */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <h4 className="font-semibold text-xl text-bibocom-primary mr-2">
                            {shop.name}
                          </h4>
                        </div>
                        
                        <p className="text-bibocom-primary/80 mb-3 line-clamp-3 italic">
                          {shop.description}
                        </p>
                        
                        <div className="flex items-center justify-center text-sm text-bibocom-primary/70">
                          <MapPin size={16} className="mr-2" />
                          {shop.address}
                        </div>
                        
                        <div className="mt-3 text-sm text-bibocom-primary/70">
                          <span>📞 {shop.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-2">
                <CarouselPrevious className="relative static left-0 translate-y-0 h-10 w-10" />
                <CarouselNext className="relative static right-0 translate-y-0 h-10 w-10" />
              </div>
            </Carousel>
          )}
        </AnimatedText>
      </div>
    </section>
  );
};

export default Shops;