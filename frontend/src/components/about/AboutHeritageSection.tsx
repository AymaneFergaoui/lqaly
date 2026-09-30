import React from 'react';
import { ArrowRight } from 'lucide-react';
import heritageImage from '../../images/Heritage section.jpg';

const AboutHeritageSection: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Image with Border */}
          <div className="relative">
            {/* Inner border box */}
            <div className="border-2 border-[rgba(236,70,19,0.2)] rounded-xl p-4">
              {/* Image container with overlay */}
              <div className="relative h-[735px] bg-[rgba(242,239,233,0.3)] border border-[rgba(230,224,218,0.5)] rounded-lg overflow-hidden">
                <div className="absolute inset-4">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={heritageImage}
                      alt="Architectural detail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white mix-blend-saturation" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:pt-16">
            {/* Label */}
            <div className="mb-6">
              <p className="font-space-mono text-xs text-[#FC0903] uppercase tracking-[2.4px]">
                Notre Héritage
              </p>
            </div>

            {/* Headline */}
            <h2 className="mb-6">
              <span className="font-syne text-[40px] leading-[50px] text-[#221410] block font-semibold">
                Redéfinir le Paysage Immobilier avec
              </span>
              <span className="font-fraunces italic text-[40px] leading-[50px] text-[#FC0903] block">
                Une Meilleure Découverte
              </span>
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-6 mb-8">
              <p className="font-manrope font-extralight text-base leading-[26px] text-[#4b5563]">
                Fondée par des architectes et des experts en données, Lqaly est née d'une
                simple observation : la recherche d'un logement était devenue une transaction froide, perdant
                la résonance émotionnelle qui accompagne la découverte de son propre sanctuaire.
              </p>

              <p className="font-manrope font-extralight text-base leading-[26px] text-[#4b5563]">
                Nous avons décidé de combler le fossé entre les données froides et les espaces de vie chaleureux. En
                exploitant une IA avancée, nous ne nous contentons pas d'associer des mètres carrés ; nous faisons correspondre
                des styles de vie, une esthétique et les émotions intangibles qui transforment une maison en un véritable foyer.
              </p>
            </div>

            {/* Blockquote */}
            <blockquote className="border-l-4 border-[#FC0903] pl-6 mb-8">
              <p className="font-fraunces italic text-2xl leading-8 text-[#FC0903]">
                "Nous pensons que trouver un logement doit être inspirant,
                et non épuisant."
              </p>
            </blockquote>

            {/* Link */}
            <a 
              href="#team" 
              className="inline-flex items-center gap-2 border-b border-[#221410] pb-1 group hover:border-[#FC0903] transition-[border-color]"
            >
              <span className="font-space-mono text-sm text-[#221410] group-hover:text-[#FC0903] transition-[color]">
                Rencontrez les Architectes
              </span>

              <ArrowRight className="w-4 h-4 text-[#221410] group-hover:text-[#FC0903] transition-[color]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeritageSection;