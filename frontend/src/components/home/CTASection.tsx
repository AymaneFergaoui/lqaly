import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="bg-primary rounded-[24px] overflow-hidden relative shadow-md">
          {/* Background Gradient / Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E0B0F] via-[#7A1B26] to-[#E8384F] opacity-90" />
          
          <div className="relative z-10 py-16 px-8 text-center max-w-2xl mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4 leading-tight">
              Prêt à Trouver la Maison de vos Rêves ?
            </h2>
            <p className="text-[16px] text-white/90 mb-8">
              Rejoignez des milliers de propriétaires satisfaits qui ont trouvé leur propriété idéale avec Lqaly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center justify-center">
                Commencer
              </Link>
              <Link to="/contact" className="border border-white text-white font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                Planifier une Démo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
