import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

const CareersPage: React.FC = () => {
  useSEO({
    title: 'Carrières — Lqaly',
    description: 'Rejoignez l\'équipe Lqaly.',
  });

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full flex flex-col items-center justify-center text-center">
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-4">Carrières chez Lqaly</h1>
        <p className="text-[#5A5856] font-manrope text-lg mb-8">Nous sommes toujours à la recherche de talents. Consultez cette page plus tard pour nos offres d'emploi.</p>
        <Link to="/" className="bg-[#FC0903] text-white px-6 py-3 rounded-lg font-manrope font-bold hover:bg-[#C05621] transition-all">Retour à l'accueil</Link>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
