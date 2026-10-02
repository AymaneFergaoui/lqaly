import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-[#F0EBE5] border-y border-[rgba(212,117,91,0.05)] py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-0 md:divide-x divide-[rgba(212,117,91,0.1)]">
          <div className="text-center">
            <div className="font-space-mono font-bold text-4xl text-[#FC0903] mb-2">15+</div>
            <div className="font-syne font-medium text-sm text-[#6b7280] uppercase tracking-wider">Propriétés Disponibles</div>
          </div>
          <div className="text-center">
            <div className="font-space-mono font-bold text-4xl text-[#FC0903] mb-2">100%</div>
            <div className="font-syne font-medium text-sm text-[#6b7280] uppercase tracking-wider">Engagement Client</div>
          </div>
          <div className="text-center">
            <div className="font-space-mono font-bold text-4xl text-[#FC0903] mb-2">3+</div>
            <div className="font-syne font-medium text-sm text-[#6b7280] uppercase tracking-wider">Villes Couvertes</div>
          </div>
          <div className="text-center">
            <div className="font-space-mono font-bold text-4xl text-[#FC0903] mb-2">24/7</div>
            <div className="font-syne font-medium text-sm text-[#6b7280] uppercase tracking-wider">Disponibilité</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
