import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-background border-y border-border py-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-[34px] font-bold text-primary mb-1">15K+</div>
            <div className="text-[14px] text-muted-foreground uppercase tracking-wide">Propriétés Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-[34px] font-bold text-primary mb-1">100%</div>
            <div className="text-[14px] text-muted-foreground uppercase tracking-wide">Vérifiées</div>
          </div>
          <div className="text-center">
            <div className="text-[34px] font-bold text-primary mb-1">15+</div>
            <div className="text-[14px] text-muted-foreground uppercase tracking-wide">Villes Couvertes</div>
          </div>
          <div className="text-center">
            <div className="text-[34px] font-bold text-primary mb-1">24/7</div>
            <div className="text-[14px] text-muted-foreground uppercase tracking-wide">Support Client</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
