import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-card font-sans mt-12 border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Multi-column Link Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          <div className="flex flex-col">
            <Link to="/properties?type=buy" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Acheter un appartement</Link>
            <Link to="/properties?type=buy&new=true" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Appartements neufs</Link>
            <Link to="/properties?type=buy&rooms=1" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Appartements 1 pièce</Link>
            <Link to="/properties?type=buy&rooms=2" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Appartements 2 pièces</Link>
            <Link to="/properties?type=buy&rooms=3" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Appartements 3 pièces</Link>
            <Link to="/properties?type=buy" className="text-[#3E7EFF] hover:underline mt-2 text-[14px]">Tous 2 450</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/properties?type=rent" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Louer un appartement</Link>
            <Link to="/properties?type=rent&rooms=1" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Location 1 pièce</Link>
            <Link to="/properties?type=rent&rooms=2" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Location 2 pièces</Link>
            <Link to="/properties?type=rent&type=house" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Louer une maison</Link>
            <Link to="/properties?type=rent&type=commercial" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Immobilier commercial</Link>
            <Link to="/properties?type=rent" className="text-[#3E7EFF] hover:underline mt-2 text-[14px]">Tous 1 126</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/mortgage" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Prêt immobilier</Link>
            <Link to="/mortgage/calc" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Calculatrice de prêt</Link>
            <Link to="/mortgage/refinance" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Refinancement</Link>
            <Link to="/mortgage/family" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Prêt familial</Link>
            <Link to="/mortgage/support" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Aides de l'État</Link>
            <Link to="/mortgage" className="text-[#3E7EFF] hover:underline mt-2 text-[14px]">Tous 15</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/build" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Construire une maison</Link>
            <Link to="/build/contractors" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Trouver un entrepreneur</Link>
            <Link to="/build/projects" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Projets de maisons</Link>
            <Link to="/build/plots" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Terrains à bâtir</Link>
            <Link to="/build/materials" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Matériaux de construction</Link>
            <Link to="/build" className="text-[#3E7EFF] hover:underline mt-2 text-[14px]">Tous 84</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/services" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Services immobiliers</Link>
            <Link to="/services/valuation" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Évaluation en ligne</Link>
            <Link to="/services/legal" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Vérification juridique</Link>
            <Link to="/services/insurance" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Assurance immobilière</Link>
            <Link to="/services/moving" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Aide au déménagement</Link>
            <Link to="/services" className="text-[#3E7EFF] hover:underline mt-2 text-[14px]">Tous 23</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/about" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">À propos du projet</Link>
            <Link to="/contact" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Contacts</Link>
            <Link to="/careers" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Offres d'emploi</Link>
            <Link to="/help" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Centre d'aide</Link>
            <Link to="/partners" className="text-foreground hover:text-primary mb-3 text-[14px] leading-loose">Pour les partenaires</Link>
          </div>
        </div>

        {/* About Block */}
        <div className="mb-12">
          <h3 className="font-bold text-[16px] mb-4">À propos de Lqaly</h3>
          <div className="text-muted-foreground text-[14px] space-y-2">
             <ul className="list-disc pl-5 space-y-2">
                <li>La plus grande plateforme immobilière pour acheter, vendre et louer en toute sécurité.</li>
                <li>Des milliers d'annonces vérifiées avec photos et descriptions détaillées.</li>
                <li>Un accompagnement complet pour votre prêt immobilier.</li>
                <li>Des services innovants pour estimer, assurer et gérer vos biens.</li>
             </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border w-full my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 py-8">
          <div className="flex flex-col gap-4">
             <Link to="/">
               <img src="/landscape-logo.png" alt="Lqaly" className="h-8 w-auto object-contain" />
             </Link>
             <p className="text-muted-foreground text-[13px] max-w-2xl">
               © 2026 Lqaly. Tous droits réservés. L'utilisation du site signifie l'acceptation de notre accord d'utilisation. 
               Les informations présentées sur le site ne constituent pas une offre publique.
             </p>
             <div className="flex gap-4">
               <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground text-[13px]">Politique de confidentialité</Link>
               <Link to="/terms" className="text-muted-foreground hover:text-foreground text-[13px]">Conditions d'utilisation</Link>
             </div>
          </div>

          <div className="flex items-center gap-6">
             {/* App Store Badges (mockups) */}
             <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-[12px]">
                   <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                   <div className="flex flex-col text-left">
                     <span className="text-[10px]">Download on the</span>
                     <span className="text-[13px] font-bold">App Store</span>
                   </div>
                </button>
                <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-[12px]">
                   <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                   <div className="flex flex-col text-left">
                     <span className="text-[10px]">GET IT ON</span>
                     <span className="text-[13px] font-bold">Google Play</span>
                   </div>
                </button>
             </div>

             {/* Socials */}
             <div className="flex gap-2">
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <TikTokIcon className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;