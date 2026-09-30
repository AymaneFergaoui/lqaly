import React from 'react';

const ProcessSection: React.FC = () => {
  return (
    <section className="bg-[#F0EBE5] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left - Sticky Content */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="font-space-mono text-sm text-[#FC0903] uppercase tracking-widest mb-6">Processus</div>
              <h2 className="font-fraunces text-5xl text-[#111827] mb-6 leading-tight">
                Le Chemin vers Votre<br />
                <span className="italic text-[#FC0903]">Nouveau Départ</span>
              </h2>
              <p className="font-manrope font-light text-lg text-[#4b5563] mb-8 leading-relaxed">
                Nous avons simplifié le parcours complexe de l'achat d'une maison en quatre étapes fluides assistées par l'IA.
              </p>
              <button className="bg-[#111827] text-white font-manrope font-medium px-8 py-3 rounded-lg shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:bg-[#1f2937] transition-all">
                Commencer Votre Parcours
              </button>
            </div>
          </div>

          {/* Right - Process Steps */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">01</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Analyse du Profil</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Notre IA analyse en profondeur vos préférences, vos besoins de style de vie et vos objectifs financiers pour créer un profil d'acheteur complet.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">02</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Correspondance Intelligente</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Les algorithmes scannent des milliers d'annonces pour trouver les propriétés qui correspondent à vos critères uniques, en éliminant le superflu.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Visites Virtuelles & Aperçus</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Découvrez des maisons à distance avec des visites 3D immersives et recevez des rapports détaillés sur les analyses du quartier.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">04</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Clôture Transparente</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    De l'offre à la remise des clés, notre plateforme numérique gère les formalités administratives, les négociations et la logistique de clôture sans effort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
