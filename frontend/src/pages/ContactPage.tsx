import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import ContactHeroSection from '../components/contact/ContactHeroSection';
import ContactFormCard from '../components/contact/ContactFormCard';
import ContactInfoCards from '../components/contact/ContactInfoCards';
import ContactMapSection from '../components/contact/ContactMapSection';
import FAQSection from '../components/contact/FAQSection';
import OtherWaysSection from '../components/contact/OtherWaysSection';
import NewsletterBanner from '../components/contact/NewsletterBanner';

const FAQ_ITEMS = [
  {
    question: 'Comment fonctionne le processus de mise en relation de l\'IA ?',
    answer: 'Notre algorithme exclusif analyse plus de 50 points de données provenant de vos préférences et de votre style de vie pour vous suggérer des propriétés qui correspondent à vos besoins uniques, dévoilant souvent des options que vous auriez pu manquer.',
  },
  {
    question: 'Quelles régions couvrez-vous actuellement ?',
    answer: 'Nous couvrons actuellement les principales zones métropolitaines, notamment Casablanca, Rabat, Marrakech et Tanger. Nous nous étendons à d\'autres villes à travers le Maroc et mettrons à jour notre zone de couverture régulièrement.',
  },
  {
    question: 'Puis-je lister ma propriété exclusivement avec Lqaly ?',
    answer: 'Oui, nous proposons des accords de listing exclusifs avec des avantages marketing premium incluant des photographies professionnelles, des visites virtuelles, une optimisation de l\'annonce par l\'IA, et le soutien d\'un consultant dédié tout au long du processus de vente.',
  },
  {
    question: 'Comment planifier une visite virtuelle ?',
    answer: 'Vous pouvez planifier une visite virtuelle directement depuis la page de n\'importe quelle propriété en cliquant sur le bouton \'Planifier une visite virtuelle\'. Choisissez la date et l\'heure qui vous conviennent, et notre équipe vous enverra une confirmation avec le lien de visioconférence.',
  },
];

const ContactPage: React.FC = () => {
  useSEO({
    title: 'Nous Contacter',
    description: 'Entrez en contact avec Lqaly. Nous sommes là pour vous aider à trouver la propriété de vos rêves.',
    url: 'https://www.lqaly.com/contact',
  });

  return (
    <div className="bg-white min-h-screen">
      <StructuredData type="faqPage" data={{ faqs: FAQ_ITEMS }} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <ContactHeroSection />

      {/* Contact Form & Info Cards Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Contact Form (2/3 width) */}
            <div className="lg:col-span-2">
              <ContactFormCard />
            </div>

            {/* Right - Contact Info Cards (1/3 width) */}
            <div className="lg:col-span-1">
              <ContactInfoCards />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <ContactMapSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Other Ways to Connect */}
      <OtherWaysSection />

      {/* Newsletter Banner */}
      <NewsletterBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
