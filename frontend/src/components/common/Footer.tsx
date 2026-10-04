import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-foreground">Immobilier</h4>
            <Link to="/properties" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Recherche de biens</Link>
            <Link to="/properties?type=buy" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Acheter</Link>
            <Link to="/properties?type=rent" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Louer</Link>
            <Link to="/add-property" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Publier une annonce</Link>
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-foreground">Services</h4>
            <Link to="/services" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Nos services</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Shooting photo</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Vidéo immobilière</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Estimation & Conseils</Link>
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-foreground">Lqaly</h4>
            <Link to="/about" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">À propos de nous</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Contact</Link>
            <Link to="/careers" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Carrières</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Blog & Magazine</Link>
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-foreground">Informations Légales</h4>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Politique de confidentialité</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Conditions d'utilisation</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Politique des cookies</Link>
            <Link to="/sitemap" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Plan du site</Link>
          </div>
          
          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-foreground">Compte</h4>
            <Link to="/signin" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Connexion</Link>
            <Link to="/signup" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Inscription</Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary mb-3 text-[14px]">Tableau de bord</Link>
          </div>
        </div>

        {/* About Block */}
        <div className="mb-12">
          <h3 className="font-bold text-[16px] mb-4">À propos de Lqaly</h3>
          <div className="text-muted-foreground text-[14px] space-y-2 max-w-4xl">
            La plus grande plateforme immobilière pour acheter, vendre et louer en toute sécurité. Des milliers d'annonces vérifiées avec photos et descriptions détaillées, accompagnées de services innovants pour estimer et mettre en valeur vos biens.
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
             </p>
          </div>

          <div className="flex items-center gap-6">
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
