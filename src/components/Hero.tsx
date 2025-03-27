
import React, { useState, useEffect } from 'react';
import Button from './ui-custom/Button';
import Badge from './ui-custom/Badge';
import AnimatedText from './ui-custom/AnimatedText';
import { ArrowRight, ShoppingBag, Users, Truck } from 'lucide-react';

const Hero = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80';
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-bibocom-light to-white pt-28">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-6 sm:px-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-xl">
            <AnimatedText delay={100}>
              <Badge variant="secondary" size="md" className="mb-6">
                La révolution du e-commerce au Sénégal
              </Badge>
            </AnimatedText>
            
            <AnimatedText delay={200} variant="slide">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gradient">Votre écosystème</span> commercial numérique
              </h1>
            </AnimatedText>
            
            <AnimatedText delay={400}>
              <p className="text-bibocom-primary/80 text-lg mb-8">
                BIBOCOM MARKET regroupe commerçants, clients et fournisseurs dans un espace unique. 
                Créez votre boutique en ligne, vendez vos produits et développez votre business digital.
              </p>
            </AnimatedText>
            
            <AnimatedText delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  variant="primary"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Commencer maintenant
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  Découvrir plus
                </Button>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={800}>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-bibocom-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="text-bibocom-primary" size={20} />
                  </div>
                  <p className="text-sm font-medium">Commerçants</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-bibocom-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="text-bibocom-accent" size={20} />
                  </div>
                  <p className="text-sm font-medium">Clients</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-bibocom-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="text-bibocom-success" size={20} />
                  </div>
                  <p className="text-sm font-medium">Fournisseurs</p>
                </div>
              </div>
            </AnimatedText>
          </div>
          
          {/* Right Column - Image */}
          <div className="relative">
            <div className={`relative w-full h-[480px] rounded-2xl overflow-hidden transform transition-all duration-1000 ${isImageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-bibocom-primary/20 to-transparent rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80" 
                alt="Bibocom Market - Vêtements à la mode" 
                className="w-full h-full object-cover object-center rounded-2xl"
                style={{ opacity: isImageLoaded ? 1 : 0, transition: 'opacity 1s ease-out' }}
              />
              
              {/* Floating elements */}
              <div className="absolute top-10 right-10 glass p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bibocom-accent rounded-full flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+5000</p>
                    <p className="text-xs text-bibocom-primary/70">Vêtements</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-10 glass p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bibocom-secondary rounded-full flex items-center justify-center">
                    <Users size={18} className="text-bibocom-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+2000</p>
                    <p className="text-xs text-bibocom-primary/70">Boutiques de mode</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-bibocom-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-bibocom-secondary/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
