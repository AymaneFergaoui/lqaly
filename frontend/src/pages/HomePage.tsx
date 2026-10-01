import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import AIIntelligenceSection from '../components/home/AIIntelligenceSection';
import CuratedListingsSection from '../components/home/CuratedListingsSection';
import ProcessSection from '../components/home/ProcessSection';
import TrustSignalsSection from '../components/home/TrustSignalsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  useSEO({
    title: 'Trouvez des Appartements et Villas au Maroc',
    description: 'Lqaly vous aide à trouver des appartements et des villas à Casablanca, Rabat, Marrakech et Tanger.',
    url: 'https://lqaly.com',
  });

  return (
    <div className="bg-[#F8F6F6] min-h-screen">
      <StructuredData
        type="speakable"
        data={{ cssSelector: ['h1', '[data-speakable]'] }}
      />
      <StructuredData
        type="howTo"
        data={{
          howToName: 'Comment acheter une propriété avec Lqaly',
          howToDescription: 'Étapes pour trouver et acheter votre maison idéale.',
          steps: [
            { name: 'Analyse du Profil', text: 'Nous analysons en profondeur vos préférences, votre style de vie et vos objectifs financiers pour créer un profil d\'acheteur complet.' },
            { name: 'Correspondance Intelligente', text: 'Les algorithmes scannent des milliers d\'annonces pour trouver les propriétés qui correspondent à vos critères uniques, en éliminant le superflu.' },
            { name: 'Visites Virtuelles & Aperçus', text: 'Découvrez des maisons à distance avec des visites 3D immersives et recevez des rapports détaillés sur les analyses du quartier.' },
            { name: 'Clôture Transparente', text: 'De l\'offre à la remise des clés, notre plateforme numérique gère les formalités administratives, les négociations et la logistique de clôture sans effort.' },
          ],
        }}
      />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* AI Intelligence Section */}
      {/* <AIIntelligenceSection /> */}

      {/* Curated Listings Section */}
      <CuratedListingsSection />

      {/* The Path to Your New Beginning Section */}
      <ProcessSection />

      {/* Redefining Real Estate Section */}
      <TrustSignalsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;