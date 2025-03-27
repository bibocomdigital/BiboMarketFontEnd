
import React, { useState, useEffect } from 'react';
import Button from './ui-custom/Button';
import Badge from './ui-custom/Badge';
import AnimatedText from './ui-custom/AnimatedText';
import { ArrowRight, ShoppingBag, Users, Truck, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Hero = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?auto=format&fit=crop&q=80';
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement de l'inscription à la newsletter
    console.log("Email pour newsletter:", email);
    setEmail('');
    // Ici, vous pourriez ajouter une notification toast
  };

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-bibocom-light to-white pt-28">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-bibocom-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-bibocom-accent/20 rounded-full blur-3xl"></div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-6 sm:px-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Colonne gauche - Texte */}
          <div className="max-w-xl">
            <AnimatedText delay={100}>
              <Badge variant="secondary" size="md" className="mb-6">
                La révolution du e-commerce au Sénégal 🚀
              </Badge>
            </AnimatedText>
            
            <AnimatedText delay={200} variant="slide">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gradient">Votre écosystème</span> commercial du futur
              </h1>
            </AnimatedText>
            
            <AnimatedText delay={400}>
              <p className="text-bibocom-primary/80 text-lg mb-8">
                BIBOCOM MARKET réunit commerçants, clients et fournisseurs dans un espace unique. 
                Créez votre boutique en ligne, vendez vos produits et développez votre présence digitale au Sénégal.
              </p>
            </AnimatedText>
            
            <AnimatedText delay={600}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-12 max-w-md">
                <Input 
                  type="email" 
                  placeholder="Votre adresse email..." 
                  className="flex-grow" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  variant="primary"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Commencer
                </Button>
              </form>
            </AnimatedText>
            
            <AnimatedText delay={800}>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-1">
                  <Star className="text-bibocom-accent" size={18} fill="currentColor" />
                  <Star className="text-bibocom-accent" size={18} fill="currentColor" />
                  <Star className="text-bibocom-accent" size={18} fill="currentColor" />
                  <Star className="text-bibocom-accent" size={18} fill="currentColor" />
                  <Star className="text-bibocom-accent" size={18} fill="currentColor" />
                </div>
                <p className="text-sm text-bibocom-primary/70">Plus de <span className="font-semibold">2500+ clients</span> satisfaits</p>
              </div>
            </AnimatedText>
          </div>
          
          {/* Colonne droite - Image */}
          <div className="relative">
            <div className={`relative w-full h-[520px] rounded-2xl overflow-hidden transform transition-all duration-1000 shadow-xl ${isImageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-bibocom-primary/30 to-transparent rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?auto=format&fit=crop&q=80" 
                alt="Bibocom Market - La marketplace sénégalaise" 
                className="w-full h-full object-cover object-center rounded-2xl hover:scale-105 transition-transform duration-700"
                style={{ opacity: isImageLoaded ? 1 : 0, transition: 'opacity 1s ease-out' }}
              />
              
              {/* Éléments flottants */}
              <div className="absolute top-10 right-10 glass p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bibocom-accent rounded-full flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+5000</p>
                    <p className="text-xs text-bibocom-primary/70">Produits</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-10 glass p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bibocom-success rounded-full flex items-center justify-center">
                    <Users size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+2000</p>
                    <p className="text-xs text-bibocom-primary/70">Boutiques</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 glass p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bibocom-secondary rounded-full flex items-center justify-center">
                    <Truck size={18} className="text-bibocom-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">24h/48h</p>
                    <p className="text-xs text-bibocom-primary/70">Livraison</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Éléments décoratifs */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-bibocom-secondary/40 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-bibocom-accent/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
