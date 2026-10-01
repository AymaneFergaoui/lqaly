import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';

const CookiePolicy: React.FC = () => {
  useSEO({
    title: 'Politique des Cookies — Lqaly',
    description: 'En savoir plus sur la façon dont Lqaly utilise les cookies pour améliorer votre expérience utilisateur.',
  });

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-8">Politique des Cookies</h1>
        
        <div className="prose prose-lg text-[#5A5856] font-manrope">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
          <p>Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences (telles que la connexion, la langue, la taille de la police et d'autres préférences d'affichage) pendant une période donnée.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">2. Comment utilisons-nous les cookies ?</h2>
          <p>Lqaly utilise les cookies pour :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Assurer le fonctionnement technique et sécurisé de la plateforme (cookies essentiels)</li>
            <li>Analyser la manière dont nos visiteurs utilisent le site pour en améliorer les performances et l'ergonomie (cookies analytiques)</li>
            <li>Mémoriser vos préférences de recherche et de navigation pour personnaliser votre expérience</li>
            <li>Fournir des publicités pertinentes sur d'autres sites (le cas échéant)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">3. Quels types de cookies utilisons-nous ?</h2>
          
          <h3 className="text-xl font-bold text-[#1C1B1A] mt-6 mb-2">Cookies Essentiels</h3>
          <p>Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés. Ils sont généralement établis en tant que réponse à des actions que vous avez effectuées, comme la connexion à votre compte ou le remplissage de formulaires.</p>
          
          <h3 className="text-xl font-bold text-[#1C1B1A] mt-6 mb-2">Cookies Analytiques</h3>
          <p>Ils nous aident à comprendre comment les visiteurs interagissent avec le site en collectant et en signalant des informations de manière anonyme. Cela nous permet d'améliorer l'expérience utilisateur.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">4. Gérer vos préférences de cookies</h2>
          <p>Vous pouvez contrôler et gérer les cookies de différentes manières. La plupart des navigateurs web vous permettent de configurer vos préférences, de bloquer tous les cookies ou de supprimer les cookies déjà stockés. Veuillez noter que la suppression ou le blocage des cookies essentiels peut affecter certaines fonctionnalités de notre site.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">5. Contact</h2>
          <p>Si vous avez des questions concernant notre utilisation des cookies, vous pouvez nous contacter à l'adresse suivante : <strong>contact@lqaly.com</strong></p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
