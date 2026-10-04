import React from 'react';
import teamImage from '../../images/Team section.jpg';
import { ShieldCheck, HeadphonesIcon, BadgeCent } from 'lucide-react';

const TrustSignalsSection: React.FC = () => {
  return (
    <section className="bg-background py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-[24px] font-bold text-foreground mb-10 text-center">Pourquoi choisir Lqaly</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative rounded-[24px] overflow-hidden shadow-sm">
            <img
              src={teamImage}
              alt="Lqaly Team"
              className="w-full h-auto object-cover rounded-[24px]"
            />
          </div>

          {/* Right - Features */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-card border border-border rounded-[12px] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-foreground mb-1">Annonces Vérifiées Uniquement</h4>
                <p className="text-[14px] text-muted-foreground">
                  Chaque propriété sur notre plateforme est physiquement vérifiée par notre équipe pour
                  vous garantir que ce que vous voyez correspond à la réalité.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-card border border-border rounded-[12px] flex items-center justify-center shrink-0">
                <HeadphonesIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-foreground mb-1">Support 24/7</h4>
                <p className="text-[14px] text-muted-foreground">
                  Notre équipe dédiée est toujours disponible pour répondre à vos questions,
                  planifier des visites et vous fournir des conseils d'experts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-card border border-border rounded-[12px] flex items-center justify-center shrink-0">
                <BadgeCent className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-foreground mb-1">Tarification Transparente</h4>
                <p className="text-[14px] text-muted-foreground">
                  Pas de frais cachés. Nous fournissons des répartitions de coûts claires et initiales pour que
                  vous puissiez budgétiser en toute confiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;
