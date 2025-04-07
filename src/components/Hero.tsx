import React, { useState, useEffect } from 'react';
import Button from './ui-custom/Button';
import Badge from './ui-custom/Badge';
import AnimatedText from './ui-custom/AnimatedText';
import { ArrowRight, ShoppingBag, Users, Truck, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Hero = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [email, setEmail] = useState('');

  // Images depuis le dossier public
 // Images depuis le dossier public
const images = [
  {
    src: "/images/saa1.jpeg",
    alt: "Groupe de femmes shopping"
  },
  {
    src: "/images/image2.jpeg",
    alt: "Trois femmes avec des sacs shopping"
  },
  {
    src: "/images/chaussures.jpeg",
    alt: "iPhone 14 Pro en violet"
  },
  {
    src: "/images/iphone1.jpeg",
    alt: "iPhone et Apple Watch"
  },
  {
    src: "/images/iphone2.jpeg",
    alt: "iPhone avec coque transparente"
  },
  {
    src: "/images/iphone3.jpeg",
    alt: "iPhone avec coque blanche"
  },
  {
    src: "/images/iphone4.jpeg",
    alt: "iPhone avec coque rose"
  },
  {
    src: "/images/iphone6.jpeg",
    alt: "iPhone 16 Pro Rose Pink"
  },
  {
    src: "/images/iphonne13.jpeg",
    alt: "iPhone 13 series"
  },
  {
    src: "/images/iphonne.jpeg",
    alt: "iPhone avec coque rouge"
  },
  {
    src: "/images/robes2.jpeg",
    alt: "Robe de soirée rouge"
  },
  {
    src: "/images/chau.jpeg",
    alt: "Robe élégante beige"
  },
  {
    src: "/images/sac2.jpeg",
    alt: "Robe jaune d'été"
  }
  ,
  {
    src: "/images/pullld.jpeg",
    alt: "Robe jaune d'été"
  }
  ,
  {
    src: "/images/chauss.jpeg",
    alt: "Robe jaune d'été"
  }
];
  useEffect(() => {
    // Carousel automatique
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement de l'inscription à la newsletter
    console.log("Email pour newsletter:", email);
    setEmail('');
  };

  return (
    <div className="relative min-h-[90vh] bg-white py-16 mt-8">
      <div className="container mx-auto px-6 sm:px-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Colonne gauche - Texte */}
          <div className="max-w-xl">
            <AnimatedText delay={100}>
              <Badge variant="secondary" size="md" className="mb-6 bg-purple-100 text-purple-700 rounded-full px-4 py-1">
                La révolution du e-commerce au Sénégal 🚀
              </Badge>
            </AnimatedText>
            
            <AnimatedText delay={200} variant="slide">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-800">
                <span>Votre écosystème</span>
                <span className="block">commercial du</span> 
                <span className="block text-bibocom-accent">futur</span>
              </h1>
            </AnimatedText>
            
            <AnimatedText delay={400}>
              <p className="text-slate-600 text-lg mb-8">
                BIBOCOM MARKET réunit commerçants, clients et fournisseurs dans un espace unique. 
                Créez votre boutique en ligne, vendez vos produits et développez votre présence digitale.
              </p>
            </AnimatedText>
            
            <AnimatedText delay={600}>
              <div className="bg-pink-600 text-white inline-block rounded-lg px-4 py-2 mb-6">
                <div className="font-bold">20% OFF</div>
                <div className="text-sm">première commande</div>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={700}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-md">
                <Input 
                  type="email" 
                  placeholder="Votre adresse email..." 
                  className="flex-grow border-2 border-gray-200 rounded-full" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  variant="primary"
                  className="bg-bibocom-accent hover:bg-bibocom-accent/90 text-white rounded-full whitespace-nowrap"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Commencer
                </Button>
              </form>
            </AnimatedText>
            
            <AnimatedText delay={800}>
              <div className="flex flex-wrap gap-6 items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-100 rounded-full p-2">
                    <ShoppingBag className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Produits</p>
                    <p className="font-bold text-slate-800">+5000</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Users className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Boutiques</p>
                    <p className="font-bold text-slate-800">+2000</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 rounded-full p-2">
                    <Truck className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Livraison</p>
                    <p className="font-bold text-slate-800">24h/48h</p>
                  </div>
                </div>
              </div>
            </AnimatedText>
          </div>
          
          {/* Colonne droite - Image et statistiques */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl h-[600px] overflow-hidden">
              {/* Image principale */}
              <div className="absolute right-0 h-full w-5/6 z-10">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === activeImage ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  </div>
                ))}
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute bottom-8 right-8 bg-white shadow-lg rounded-xl p-4 z-20">
                <div className="font-bold text-xl text-slate-800">254.12k</div>
                <div className="text-sm text-slate-500">Clients Satisfaits</div>
              </div>
              
              <div className="absolute top-8 right-32 bg-pink-600 text-white rounded-xl p-2 shadow-lg z-20">
                <div className="font-bold">-40%</div>
              </div>
              
              <div className="absolute bottom-32 left-0 bg-green-100 text-green-700 rounded-xl p-3 shadow-lg z-20">
                <div className="font-medium">Livraison gratuite</div>
              </div>
              
              {/* Indicateurs du carousel */}
              <div className="absolute bottom-4 left-4 flex space-x-2 z-30">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeImage ? 'bg-bibocom-accent w-6' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;