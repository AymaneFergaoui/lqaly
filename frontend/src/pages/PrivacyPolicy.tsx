import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';

const PrivacyPolicy: React.FC = () => {
  useSEO({
    title: 'Politique de Confidentialité — Lqaly',
    description: 'Consultez la politique de confidentialité de Lqaly pour en savoir plus sur la gestion et la protection de vos données personnelles.',
  });

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-8">Politique de Confidentialité</h1>
        
        <div className="prose prose-lg text-[#5A5856] font-manrope">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">1. Introduction</h2>
          <p>Bienvenue sur Lqaly. Nous accordons une grande importance à la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous recueillons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">2. Informations que nous recueillons</h2>
          <p>Nous pouvons recueillir des informations personnelles vous concernant, telles que :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Votre nom et prénom</li>
            <li>Votre adresse e-mail et numéro de téléphone</li>
            <li>Vos données de navigation sur notre site (cookies)</li>
            <li>Les informations que vous fournissez lors de la création d'une annonce</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">3. Utilisation de vos informations</h2>
          <p>Nous utilisons les informations recueillies pour :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Vous fournir, gérer et maintenir nos services</li>
            <li>Améliorer, personnaliser et développer notre plateforme</li>
            <li>Communiquer avec vous, y compris pour le service client</li>
            <li>Vous envoyer des e-mails marketing si vous y avez consenti</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">4. Partage de vos informations</h2>
          <p>Nous ne vendons pas, ne louons pas et ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Avec votre consentement</li>
            <li>Pour se conformer à des obligations légales</li>
            <li>Avec des prestataires de services tiers qui nous aident à exploiter notre plateforme (ex. hébergement, analytique)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">5. Vos droits</h2>
          <p>Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en nous contactant directement.</p>

          <h2 className="text-2xl font-bold text-[#1C1B1A] mt-8 mb-4">6. Contact</h2>
          <p>Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse suivante : <strong>contact@lqaly.com</strong></p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
