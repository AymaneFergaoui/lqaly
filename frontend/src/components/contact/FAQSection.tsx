import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Comment fonctionne le processus de mise en relation par IA ?",
      answer: "Notre algorithme analyse plus de 50 points de données à partir de vos préférences et de votre style de vie pour vous suggérer des propriétés qui correspondent à vos besoins uniques, vous faisant souvent découvrir des options que vous auriez pu manquer."
    },
    {
      id: 2,
      question: "Quelles zones couvrez-vous actuellement ?",
      answer: "Nous couvrons actuellement les principales villes du Maroc telles que Casablanca, Rabat, Marrakech et Tanger. Nous étendons régulièrement notre couverture à d'autres régions."
    },
    {
      id: 3,
      question: "Puis-je lister ma propriété en exclusivité avec Lqaly ?",
      answer: "Oui, nous proposons des accords de référencement exclusifs avec des avantages marketing premium, notamment des photographies professionnelles, des visites virtuelles, une optimisation de l'annonce par IA et un conseiller dédié tout au long du processus de vente."
    },
    {
      id: 4,
      question: "Comment puis-je planifier une visite virtuelle ?",
      answer: "Vous pouvez planifier une visite virtuelle directement depuis la page de l'annonce en cliquant sur le bouton 'Planifier une visite virtuelle'. Choisissez la date et l'heure de votre choix, et notre équipe vous enverra une confirmation avec le lien pour la visioconférence."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-3">
            <span className="font-space-mono text-xs text-[#FC0903] uppercase tracking-widest">
              Centre d'Aide
            </span>
          </div>
          <h2 className="font-syne font-bold text-4xl text-[#221410] mb-4">
            Questions Fréquentes
          </h2>
          <p className="font-manrope text-lg text-[#4B5563] leading-relaxed max-w-[640px] mx-auto">
            Trouvez des réponses rapides à vos questions les plus urgentes concernant l'achat, la vente et le partenariat avec Lqaly.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[800px] mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id}
              className="bg-[#F9F7F2] border border-[#E6E0DA] rounded-xl overflow-hidden transition-all"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center gap-4 p-6 text-left hover:bg-[#F2EFE9] transition-[background-color]"
              >
                {/* Number Badge */}
                <div className="w-8 h-8 bg-[#F9F7F2] border border-[#E6E0DA] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-syne font-bold text-sm text-[#FC0903]">
                    {String(faq.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="flex-1 font-syne font-bold text-lg text-[#221410]">
                  {faq.question}
                </h3>

                {/* Expand/Collapse Icon */}
                <span className={`material-icons text-[#FC0903] transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  expand_more
                </span>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-6 pl-[72px]">
                  <p className="font-manrope font-extralight text-sm text-[#4B5563] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Questions Link */}
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 font-manrope font-bold text-base text-[#FC0903] hover:text-[#C05621] transition-[color] group"
          >
            <span>Voir toute la Base de Connaissances</span>
            <span className="material-icons text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;