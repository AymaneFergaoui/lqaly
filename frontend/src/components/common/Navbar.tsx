import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Search, MessageCircle, Heart, PlusCircle, LogIn, X, User } from 'lucide-react';

const mainNavLinks = [
  { path: '/properties?type=buy', label: 'Achat' },
  { path: '/properties?type=rent', label: 'Louer', hasNotification: true },
  { path: '/properties?new=true', label: 'Nouveaux bâtiments' },
  { path: '/services', label: 'Services' },
  { path: '/blog', label: 'Le Magazine' },
  { path: '/contact', label: 'Agents & Contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path.split('?')[0])) return true;
    return false;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Passer au contenu principal
      </a>

      <header className="w-full flex flex-col font-sans">
        
        {/* 1. Promo banner strip */}
        {isPromoVisible && (
          <div className="relative w-full text-white text-sm" style={{ background: 'var(--gradient-promo-banner)' }}>
            <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-bold">Promotion Exclusive</span>
                <span className="hidden sm:inline text-white/80">Profitez de nos offres spéciales sur les nouveaux bâtiments</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-black/35 rounded-full px-2.5 py-1 text-xs">Publicité ⓘ</span>
                <button onClick={() => setIsPromoVisible(false)} className="hover:text-white/70 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Utility bar */}
        <div className="w-full bg-card hidden md:block border-b border-border">
          <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <MapPin size={18} />
                <span>Moscou</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <User size={18} />
                <span>Aux partenaires</span>
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Search size={18} />
                <span>Recherche</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <MessageCircle size={18} />
                <span>Chat</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Heart size={18} />
                <span>Favoris</span>
              </button>
              <Link to="/add-property" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <PlusCircle size={18} />
                <span>Publier une annonce</span>
              </Link>
              
              {isAuthenticated && user ? (
                 <div className="relative" ref={userMenuRef}>
                   <button
                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                     className="flex items-center gap-2 hover:text-foreground transition-colors"
                   >
                     <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                       {initials}
                     </div>
                     <span>{user.name.split(' ')[0]}</span>
                   </button>
                   {isUserMenuOpen && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-dropdown py-2 z-50">
                       <Link to="/dashboard" className="block px-4 py-2 hover:bg-muted text-foreground">Tableau de bord</Link>
                       <Link to="/my-listings" className="block px-4 py-2 hover:bg-muted text-foreground">Mes Annonces</Link>
                       <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-muted text-red-600">Déconnexion</button>
                     </div>
                   )}
                 </div>
              ) : (
                <Link to="/signin" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <LogIn size={18} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3. Main nav bar */}
        <div className="w-full bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 py-5 flex items-center justify-between md:justify-start gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 gap-2" onClick={closeMobileMenu}>
              <img src="/landscape-logo.png" alt="Lqaly" className="h-8 w-auto object-contain" />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 flex-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[15px] font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.label}
                  {link.hasNotification && (
                    <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 lg:hidden text-muted-foreground">
               <button><Search size={24} /></button>
               <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menu"
               >
                 {isMobileMenuOpen ? <X size={28} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-current"></div><div className="w-6 h-0.5 bg-current"></div><div className="w-6 h-0.5 bg-current"></div></div>}
               </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4">
               {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium ${isActive(link.path) ? 'text-primary' : 'text-foreground'}`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2"></div>
              {!isAuthenticated ? (
                 <Link to="/signin" className="text-base font-medium text-foreground" onClick={closeMobileMenu}>Connexion</Link>
              ) : (
                 <>
                   <Link to="/dashboard" className="text-base font-medium text-foreground" onClick={closeMobileMenu}>Tableau de bord</Link>
                   <button onClick={handleLogout} className="text-left text-base font-medium text-red-600">Déconnexion</button>
                 </>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
