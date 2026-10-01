import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Video, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // TODO: Submit to backend
    setEmail('');
  };

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-[1280px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Lqaly" loading="lazy" decoding="async" width="40" height="40" className="h-10 w-auto brightness-0 invert" />
              <span className="font-fraunces text-2xl font-bold">Lqaly</span>
            </Link>
            <p className="font-manrope font-extralight text-[#9ca3af] text-sm leading-relaxed mb-6">
              Plateforme d'immobilier de luxe vous connectant à la maison de vos rêves grâce à des recommandations personnalisées.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61572350921063"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgba(255,255,255,0.05)] hover:bg-[#FC0903] border border-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center transition-all group"
              >
                <Facebook className="w-5 h-5 text-[#9ca3af] group-hover:text-white transition-[color]" />
              </a>
              <a
                href="https://www.instagram.com/lqalyimmobilier/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgba(255,255,255,0.05)] hover:bg-[#FC0903] border border-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 text-[#9ca3af] group-hover:text-white transition-[color]" />
              </a>
              <a
                href="https://www.tiktok.com/@lqalyimmobilier"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgba(255,255,255,0.05)] hover:bg-[#FC0903] border border-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center transition-all group"
              >
                <Video className="w-5 h-5 text-[#9ca3af] group-hover:text-white transition-[color]" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-syne font-bold text-white text-lg mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white hover:pl-2 transition-all inline-block">
                  Parcourir les Propriétés
                </Link>
              </li>

              <li>
                <Link to="/about" className="font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white hover:pl-2 transition-all inline-block">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white hover:pl-2 transition-all inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white hover:pl-2 transition-all inline-block">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#" className="font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white hover:pl-2 transition-all inline-block">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h4 className="font-syne font-bold text-white text-lg mb-6">Coordonnées</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://www.google.com/maps/place/Lqaly/@33.5470625,-7.5973125,942m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda633b86dd47a5d:0x690ebea7aa300d20!8m2!3d33.5470625!4d-7.5973125!16s%2Fg%2F11nr87ggrc?entry=ttu&g_ep=EgoyMDI2MDkyOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white transition-[color] group">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FC0903]" />
                  <span className="leading-relaxed">
                    GCW3+R35,<br />
                    Casablanca 20000
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+212699945264" className="flex items-center gap-3 font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white transition-[color]">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[#FC0903]" />
                  <span>+212 699-945264</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@lqaly.com" className="flex items-center gap-3 font-manrope font-extralight text-[#9ca3af] text-sm hover:text-white transition-[color]">
                  <Mail className="w-5 h-5 flex-shrink-0 text-[#FC0903]" />
                  <span>contact@lqaly.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-syne font-bold text-white text-lg mb-6">Restez Informé</h4>
            <p className="font-manrope font-extralight text-[#9ca3af] text-sm mb-4 leading-relaxed">
              Abonnez-vous à notre newsletter pour les dernières annonces, analyses de marché et offres exclusives.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#FC0903] transition-[border-color]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FC0903] hover:bg-[#C05621] text-white font-manrope font-bold text-sm px-4 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                S'abonner
              </button>
            </form>
            <p className="font-manrope font-extralight text-[#6b7280] text-xs mt-3">
              Nous respectons votre vie privée. Désabonnez-vous à tout moment.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-manrope font-extralight text-[#6b7280] text-sm text-center md:text-left">
              © 2026 Lqaly. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="font-manrope font-extralight text-[#6b7280] text-sm hover:text-white transition-[color]">
                Politique de Confidentialité
              </a>
              <a href="#" className="font-manrope font-extralight text-[#6b7280] text-sm hover:text-white transition-[color]">
                Conditions d'Utilisation
              </a>
              <a href="#" className="font-manrope font-extralight text-[#6b7280] text-sm hover:text-white transition-[color]">
                Politique des Cookies
              </a>
              <a href="#" className="font-manrope font-extralight text-[#6b7280] text-sm hover:text-white transition-[color]">
                Plan du Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;