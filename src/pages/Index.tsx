
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Footer from '@/components/Footer';

const Index = () => {
  // Smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorLink = target.closest('a[href^="#"]');
      
      if (anchorLink) {
        e.preventDefault();
        const targetId = anchorLink.getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bibocom-light">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <UserTypes />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
