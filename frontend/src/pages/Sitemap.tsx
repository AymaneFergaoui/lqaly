import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';

const Sitemap: React.FC = () => {
  useSEO({
    title: 'Plan du Site — Lqaly',
    description: 'Explorez la structure du site Lqaly et accédez facilement à toutes nos pages.',
  });

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-8">Plan du Site</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-manrope">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4 border-b border-[#E6D5C3] pb-2">Pages Principales</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Accueil</Link>
              </li>
              <li>
                <Link to="/properties" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Propriétés</Link>
              </li>
              <li>
                <Link to="/about" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">À propos de nous</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4 border-b border-[#E6D5C3] pb-2">Espace Utilisateur</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Tableau de Bord</Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Mes Annonces</Link>
              </li>
              <li>
                <Link to="/add-property" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Ajouter une Propriété</Link>
              </li>
              <li>
                <Link to="/signin" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Se Connecter</Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Créer un Compte</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1C1B1A] mb-4 border-b border-[#E6D5C3] pb-2">Informations Légales</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Politique de Confidentialité</Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Conditions d'Utilisation</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-[#5A5856] hover:text-[#FC0903] transition-colors text-lg">Politique des Cookies</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
