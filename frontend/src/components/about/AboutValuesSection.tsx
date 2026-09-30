import React from 'react';
import { Lightbulb, Eye, Award } from 'lucide-react';

const AboutValuesSection: React.FC = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous remettons en question le statu quo de l\'immobilier en alliant un service traditionnel à une technologie de pointe pour redéfinir ce qui est possible.'
    },
    {
      icon: Eye,
      title: 'Transparence',
      description: 'Pas de données cachées, pas d\'historiques obscurs. Nous croyons en une clarté totale, vous permettant de prendre des décisions en toute confiance.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'De la première recherche à la signature finale, nous concevons une expérience d\'une qualité irréprochable et d\'une élégance raffinée.'
    }
  ];

  return (
    <section className="bg-[#F8F6F6] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="font-space-mono text-xs text-[#FC0903] uppercase tracking-[1.2px] mb-4">
            Notre Philosophie
          </div>
          <h2 className="font-syne text-4xl text-[#221410]">
            Guidés par un But
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white border border-[#E6E0DA] rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-[rgba(236,70,19,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-[#FC0903]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-syne text-xl text-[#221410] mb-4">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-manrope font-extralight text-sm leading-[22.75px] text-[#4b5563]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;