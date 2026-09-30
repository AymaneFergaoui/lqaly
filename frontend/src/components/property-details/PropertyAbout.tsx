import React from 'react';

interface PropertyAboutProps {
  description?: string;
}

const PropertyAbout: React.FC<PropertyAboutProps> = ({ 
  description = `Découvrez l'apogée du luxe urbain aux Skyline Towers. Cette résidence T5 méticuleusement conçue offre un mélange harmonieux d'architecture contemporaine et de vie haut de gamme. La propriété dispose d'un vaste espace de vie avec des fenêtres du sol au plafond, un parquet en chêne de première qualité et une intégration de domotique dernier cri.

La suite parentale est un véritable sanctuaire avec un grand dressing et une salle de bain attenante dotée de marbre italien importé. Les trois autres chambres sont généreusement proportionnées, chacune bénéficiant d'une lumière naturelle abondante grâce à leurs fenêtres toute hauteur. La cuisine moderne comprend des appareils électroménagers haut de gamme et des placards sur mesure de conception italienne. Cette maison est pensée pour les modes de vie les plus exigeants.` 
}) => {
  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FC0903] rounded-full" />
        <h2 className="font-syne text-2xl text-[#0F172A]">
          À propos de la propriété
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-4">
        {description.split('\n\n').map((paragraph, index) => (
          <p 
            key={index}
            className="font-manrope font-extralight text-base text-[#64748B] leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PropertyAbout;