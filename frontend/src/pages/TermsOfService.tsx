import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';

const TermsOfService: React.FC = () => {
  useSEO({
    title: 'Conditions d\'Utilisation — Lqaly',
    description: 'Prenez connaissance de nos conditions d\'utilisation de la plateforme immobilière Lqaly.',
  });

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-8">Conditions d'Utilisation</h1>
        
        <div className="prose prose-lg text-[#5A5856] font-manrope">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">1. Acceptation des conditions</h2>
          <p>En accédant et en utilisant la plateforme Lqaly, vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">2. Description du service</h2>
          <p>Lqaly est une plateforme permettant la mise en relation entre acheteurs, vendeurs, locataires et propriétaires de biens immobiliers. Nous ne sommes pas une agence immobilière et n'intervenons pas dans les transactions finales.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">3. Compte utilisateur</h2>
          <p>Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte et mot de passe, ainsi que de toutes les activités qui s'y produisent.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">4. Contenu utilisateur</h2>
          <p>Vous êtes seul responsable du contenu que vous publiez sur Lqaly (annonces, photos, descriptions). Vous garantissez que ce contenu est exact, n'enfreint aucun droit d'auteur et respecte les lois en vigueur.</p>
          
          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">5. Comportement interdit</h2>
          <p>Il est interdit d'utiliser Lqaly pour :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Publier du contenu faux, trompeur ou diffamatoire</li>
            <li>Pratiquer du spam ou toute forme de sollicitation non sollicitée</li>
            <li>Tenter de compromettre la sécurité de la plateforme</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">6. Limitation de responsabilité</h2>
          <p>Lqaly ne garantit pas l'exactitude des annonces publiées par les utilisateurs. Nous ne pourrons être tenus responsables de tout dommage direct ou indirect lié à l'utilisation de la plateforme ou aux transactions effectuées suite à la mise en relation.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">7. Modification des conditions</h2>
          <p>Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Nous vous informerons de toute modification substantielle. L'utilisation continue de la plateforme constitue votre acceptation des nouvelles conditions.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
