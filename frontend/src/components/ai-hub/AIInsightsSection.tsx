import React from 'react';
import { Brain, TrendingUp, Coffee, Award } from 'lucide-react';

const AIInsightsSection: React.FC = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Analyse des Tendances Temporelles',
      description: 'Nous analysons les mouvements de prix historiques, les fluctuations saisonnières et les cycles du marché pour prédire les meilleures fenêtres d\'achat et l\'appréciation future.'
    },
    {
      icon: Coffee,
      title: 'Intelligence du Style de Vie',
      description: 'Des temps de trajet aux cafés, des écoles à la vie nocturne—notre IA associe vos besoins en matière de style de vie aux caractéristiques du quartier.'
    },
    {
      icon: Award,
      title: 'Recommandations d\'Experts',
      description: 'Nos algorithmes combinent les données du marché avec l\'expertise architecturale, identifiant les joyaux cachés avant qu\'ils n\'atteignent le grand public.'
    }
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Icon */}
          <div className="w-16 h-16 bg-[rgba(236,70,19,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-[#FC0903]" strokeWidth={1.5} />
          </div>

          <h2 className="font-syne text-4xl text-[#221410] mb-4">
            Aperçus Intelligents
          </h2>
          <p className="font-manrope font-extralight text-lg text-[#4b5563] max-w-[700px] mx-auto">
            Notre IA ne se contente pas d'associer des propriétés—elle comprend vos rêves, analyse le marché et anticipe vos besoins futurs.
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="bg-[#F8F6F6] border border-[#E6E0DA] rounded-xl p-8 hover:shadow-xl transition-all group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[rgba(236,70,19,0.1)] rounded-full flex items-center justify-center mb-6 group-hover:bg-[rgba(236,70,19,0.15)] transition-[background-color]">
                <insight.icon className="w-6 h-6 text-[#FC0903]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-syne text-xl text-[#221410] mb-4">
                {insight.title}
              </h3>

              {/* Description */}
              <p className="font-manrope font-extralight text-sm leading-relaxed text-[#4b5563]">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIInsightsSection;