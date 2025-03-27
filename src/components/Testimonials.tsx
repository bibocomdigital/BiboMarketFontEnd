
import React from 'react';
import AnimatedText from './ui-custom/AnimatedText';
import Badge from './ui-custom/Badge';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: "Aminata Diallo",
    role: "Commerçante",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    content: "Depuis que j'ai rejoint BIBOCOM MARKET, mes ventes ont augmenté de 40%. La plateforme est intuitive et mes clients apprécient la facilité d'achat.",
    stars: 5
  },
  {
    name: "Moussa Sow",
    role: "Client",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "Je trouve tout ce dont j'ai besoin en quelques clics. Les commerçants sont fiables et la livraison est rapide. Je recommande à tous mes amis !",
    stars: 5
  },
  {
    name: "Fatou Ndiaye",
    role: "Fournisseur",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=200",
    content: "La plateforme m'a permis de développer mon réseau de commerçants. Je reçois régulièrement des commandes et le paiement est sécurisé.",
    stars: 4
  },
  {
    name: "Ibrahim Diop",
    role: "Commerçant",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    content: "Ma boutique virtuelle attire des clients que je n'aurais jamais pu atteindre autrement. Le support technique est également très réactif.",
    stars: 5
  },
  {
    name: "Aïssatou Bah",
    role: "Cliente",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    content: "J'adore faire mes achats sur BIBOCOM. L'interface est belle et je peux facilement communiquer avec les vendeurs avant d'acheter.",
    stars: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-bibocom-light/50 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="text-center mb-16">
          <AnimatedText delay={100}>
            <Badge variant="accent" className="mb-4">
              Témoignages
            </Badge>
          </AnimatedText>
          
          <AnimatedText delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent <span className="text-gradient">nos utilisateurs</span>
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={300}>
            <p className="text-bibocom-primary/80 max-w-2xl mx-auto">
              Découvrez les expériences de nos utilisateurs satisfaits qui ont transformé leur façon d'acheter et de vendre en ligne.
            </p>
          </AnimatedText>
        </div>
        
        <AnimatedText delay={400}>
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="py-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="h-full glass-card p-6 flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-bibocom-primary">{testimonial.name}</h4>
                        <p className="text-sm text-bibocom-primary/70">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < testimonial.stars ? "text-bibocom-accent fill-bibocom-accent" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    
                    <div className="relative flex-grow">
                      <Quote className="absolute -top-1 -left-1 w-8 h-8 text-bibocom-secondary/30 rotate-180" />
                      <p className="text-bibocom-primary/80 mt-2 italic relative z-10">
                        "{testimonial.content}"
                      </p>
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
        </AnimatedText>
      </div>
    </section>
  );
};

export default Testimonials;
