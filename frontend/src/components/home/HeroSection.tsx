import React from 'react';
import { motion } from 'framer-motion';
import { Search, Map, SlidersHorizontal } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-background pt-16 pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[34px] md:text-[40px] font-bold text-foreground text-center mb-8"
        >
          Recherche de biens immobiliers
        </motion.h1>

        {/* Filter Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
        >
          <button className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-[14px] font-medium border border-transparent">
            Acheter
          </button>
          <button className="bg-card text-foreground px-5 py-2.5 rounded-full text-[14px] font-medium border border-border flex items-center gap-2 hover:border-gray-300 transition-colors">
            Louer
          </button>
          <button className="bg-card text-foreground px-5 py-2.5 rounded-full text-[14px] font-medium border border-border flex items-center gap-2 hover:border-gray-300 transition-colors">
            Hypothèque
          </button>
          <button className="bg-card text-foreground px-5 py-2.5 rounded-full text-[14px] font-medium border border-border flex items-center gap-2 hover:border-gray-300 transition-colors">
            Nouveaux bâtiments
          </button>
          <button className="bg-card text-foreground px-5 py-2.5 rounded-full text-[14px] font-medium border border-border flex items-center gap-2 hover:border-gray-300 transition-colors">
            Construire
          </button>
        </motion.div>

        {/* Search Bar Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl bg-card rounded-[20px] shadow-[0_4px_12px_rgba(16,24,40,0.08)] p-6 mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center bg-muted rounded-[16px] p-1 gap-2">
            
            <div className="flex-1 flex items-center w-full px-4">
              <Search className="text-muted-foreground w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Région, ville, rue, complexe résidentiel, métro" 
                className="w-full bg-transparent border-none py-4 px-3 text-[15px] text-foreground focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto p-1">
              <button className="bg-card border border-border rounded-[12px] p-3.5 flex items-center justify-center text-foreground hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              
              <button className="bg-card border border-border rounded-full px-4 py-3.5 flex items-center gap-2 text-[14px] font-medium text-foreground hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Map className="w-4 h-4 text-primary" />
                <span>Sur la carte</span>
              </button>
              
              <button className="bg-primary hover:bg-[#C42B3D] text-white rounded-full px-7 py-3.5 text-[15px] font-semibold transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto">
                Trouver
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
