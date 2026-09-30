import React from 'react';

const AIIntelligenceSection: React.FC = () => {
  return (
    <section className="bg-[#F8F6F6] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="font-space-mono text-sm text-[#FC0903] uppercase tracking-widest mb-4">Pourquoi Choisir l'IA ?</div>
          <h2 className="font-fraunces text-5xl text-[#111827] mb-6">Intelligence Immobilière Propulsée par l'IA</h2>
          <p className="font-manrope font-light text-lg text-[#4b5563] max-w-[740px] mx-auto">
            Nous exploitons des algorithmes avancés pour vous donner un avantage concurrentiel sur le marché, transformant les données en votre maison de rêve.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#FC0903]" aria-hidden="true">query_stats</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4">Analyse du Marché en Direct</h3>
            <p className="font-manrope text-base text-[#6b7280] leading-relaxed">
              Des flux de données en temps réel provenant de toutes les principales sources d'annonces, agrégeant des perles rares avant qu'elles ne soient connues du grand public.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#FC0903]" aria-hidden="true">psychology</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4">Aperçus IA Experts</h3>
            <p className="font-manrope text-base text-[#6b7280] leading-relaxed">
              Analyses prédictives sur l'appréciation de la valeur et le potentiel d'investissement, adaptées à vos objectifs financiers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#FC0903]" aria-hidden="true">location_city</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4">Meilleures Suggestions de Quartier</h3>
            <p className="font-manrope text-base text-[#6b7280] leading-relaxed">
              Correspondance de quartier basée sur vos habitudes de vie, vos préférences de trajet et les commodités locales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIIntelligenceSection;
