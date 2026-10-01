import React from 'react';

const ContactHeroSection: React.FC = () => {
  return (
    <section className="bg-[#F9F7F2] border-b border-[rgba(230,224,218,0.5)] py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center">
          {/* Label */}
          <div className="flex justify-center mb-4">
            <span className="font-space-mono text-xs text-[#FC0903] uppercase tracking-widest">
              Contact & Support
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-fraunces text-6xl text-[#221410] mb-6">
            Nous serions ravis d'échanger avec vous
          </h1>

          {/* Subtitle */}
          <p className="font-manrope text-lg text-[#4B5563] leading-relaxed max-w-[672px] mx-auto">
            Que vous ayez une question sur nos annonces ou
            que vous souhaitiez explorer des opportunités de partenariat, notre équipe est à votre écoute.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;