import React from 'react';
import { Link } from 'react-router-dom';
import { Percent, ShieldCheck, Wrench, Wallet } from 'lucide-react';

const ProcessSection: React.FC = () => {
  return (
    <section className="bg-background py-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-[24px] font-bold text-foreground mb-8">Services immobiliers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Tile 1 */}
          <Link to="/mortgage" className="group relative overflow-hidden rounded-[16px] p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #DDF7DE 0%, #F7FFF5 100%)' }}>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1B3B1C] mb-1">Potentiel hypothécaire</h3>
              <p className="text-[14px] text-[#2C5F2D]">Découvrez votre capacité d'emprunt</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#BCEABF] rounded-full opacity-50 group-hover:scale-110 transition-transform flex items-center justify-center">
              <Percent size={40} className="text-[#1B3B1C] opacity-30 -mr-2 -mt-2" />
            </div>
          </Link>

          {/* Tile 2 */}
          <Link to="/services/legal" className="group relative overflow-hidden rounded-[16px] p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #E6F0FF 0%, #F5F9FF 100%)' }}>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1A365D] mb-1">Vérification juridique</h3>
              <p className="text-[14px] text-[#2B6CB0]">Achetez en toute sécurité</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#BEE3F8] rounded-full opacity-50 group-hover:scale-110 transition-transform flex items-center justify-center">
              <ShieldCheck size={40} className="text-[#1A365D] opacity-30 -mr-2 -mt-2" />
            </div>
          </Link>

          {/* Tile 3 */}
          <Link to="/services/moving" className="group relative overflow-hidden rounded-[16px] p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #FFF0E6 0%, #FFFAF5 100%)' }}>
            <div>
              <h3 className="text-[18px] font-semibold text-[#7B341E] mb-1">Aide au déménagement</h3>
              <p className="text-[14px] text-[#C05621]">Des partenaires fiables</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FEEBC8] rounded-full opacity-50 group-hover:scale-110 transition-transform flex items-center justify-center">
              <Wrench size={40} className="text-[#7B341E] opacity-30 -mr-2 -mt-2" />
            </div>
          </Link>

          {/* Tile 4 */}
          <Link to="/services/valuation" className="group relative overflow-hidden rounded-[16px] p-6 min-h-[160px] flex flex-col justify-between transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #FAEDFF 100%)' }}>
            <div>
              <h3 className="text-[18px] font-semibold text-[#44337A] mb-1">Évaluation en ligne</h3>
              <p className="text-[14px] text-[#6B46C1]">Estimez le prix de votre bien</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E9D8FD] rounded-full opacity-50 group-hover:scale-110 transition-transform flex items-center justify-center">
              <Wallet size={40} className="text-[#44337A] opacity-30 -mr-2 -mt-2" />
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
