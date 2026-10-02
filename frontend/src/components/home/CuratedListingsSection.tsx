import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import glassPavilion from '../../images/bouskoura_villa.jpg';
import skylinePenthouse from '../../images/agadir_penthouse.jpg';
import desertOasis from '../../images/marrakech_oasis.jpg';
import coastalRetreat from '../../images/tangier_coastal.jpg';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  availability: string;
}

const CuratedListingsSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackImages = [glassPavilion, skylinePenthouse, desertOasis, coastalRetreat];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertiesAPI.getAll();
        const allProperties: Property[] = response.data.property || [];
        
        // Logic to extract exactly 4 properties from 4 different cities
        const selected: Property[] = [];
        const citiesSeen = new Set<string>();

        for (const prop of allProperties) {
          // Extract the city from location (assuming "Neighborhood, City" format)
          const parts = prop.location.split(',').map(s => s.trim());
          const city = parts[parts.length - 1].toLowerCase();
          
          if (!citiesSeen.has(city)) {
            citiesSeen.add(city);
            selected.push(prop);
          }
          if (selected.length === 4) break;
        }

        // Fill up to 4 if we couldn't find 4 distinct cities
        if (selected.length < 4) {
          for (const prop of allProperties) {
            if (!selected.find(s => s._id === prop._id)) {
              selected.push(prop);
            }
            if (selected.length === 4) break;
          }
        }

        setProperties(selected);
      } catch (error) {
        console.error("Failed to fetch curated listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <section className="bg-[#F9F7F2] py-24 relative overflow-hidden flex justify-center items-center min-h-[600px]">
         <div className="font-space-mono text-[#FC0903] animate-pulse">Chargement des propriétés exclusives...</div>
      </section>
    );
  }

  const p1 = properties[0];
  const p2 = properties[1];
  const p3 = properties[2];
  const p4 = properties[3];

  return (
    <section className="bg-[#F9F7F2] py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <path d="M0 0h20v20H0z" fill="#FC0903" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <div className="font-space-mono text-sm text-[#FC0903] uppercase tracking-widest mb-4">Sélection Exclusive</div>
            <h2 className="font-fraunces text-5xl text-[#111827]">Propriétés d'Exception</h2>
          </div>

          <Link to="/properties" className="flex items-center gap-2 font-manrope font-bold text-[#FC0903] hover:gap-4 transition-all">
            Voir Toutes les Propriétés
            <span className="font-material-icons text-sm" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Large Featured Property (Slot 1) */}
          {p1 && (
            <div className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group">
              <Link to={`/properties/${p1._id}`} className="block relative h-[500px]">
                <img 
                  src={p1.image?.[0] || fallbackImages[0]} 
                  alt={p1.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-[#FC0903] inline-block px-3 py-1 rounded text-white font-manrope font-bold text-xs mb-4">
                    EN VEDETTE
                  </div>
                  <h3 className="font-fraunces text-3xl text-white mb-2">{p1.title}</h3>
                  <p className="font-manrope font-light text-white/80 mb-4">{p1.location}</p>
                  <div className="border-t border-white/20 pt-4 flex items-center justify-between">
                    <span className="font-space-mono text-white">{formatPrice(p1.price)}</span>
                    <div className="flex items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <span className="font-material-icons text-sm" aria-hidden="true">bed</span>
                        <span className="font-space-mono text-sm">{p1.beds} Chambres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-material-icons text-sm" aria-hidden="true">square_foot</span>
                        <span className="font-space-mono text-sm">{p1.sqft} m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Small Property Card (Slot 2) */}
          {p2 && (
            <div className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group">
              <Link to={`/properties/${p2._id}`} className="block relative h-[500px]">
                <img 
                  src={p2.image?.[0] || fallbackImages[1]} 
                  alt={p2.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-fraunces text-xl text-white mb-1 line-clamp-1">{p2.title}</h3>
                  <p className="font-manrope text-sm text-white/70 mb-3 line-clamp-1">{p2.location}</p>
                  <span className="font-space-mono text-sm text-white">{formatPrice(p2.price)}</span>
                </div>
              </Link>
            </div>
          )}

          {/* Desert Oasis (Slot 3) */}
          {p3 && (
            <div className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] aspect-square group">
              <Link to={`/properties/${p3._id}`} className="block relative h-full">
                <img 
                  src={p3.image?.[0] || fallbackImages[2]} 
                  alt={p3.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-fraunces text-xl text-white mb-1 line-clamp-1">{p3.title}</h3>
                  <p className="font-manrope text-sm text-white/70 mb-3 line-clamp-1">{p3.location}</p>
                  <span className="font-space-mono text-sm text-white">{formatPrice(p3.price)}</span>
                </div>
              </Link>
            </div>
          )}

          {/* Coastal Retreat (Slot 4) */}
          {p4 && (
            <div className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] relative group">
              <Link to={`/properties/${p4._id}`} className="block relative h-[800px]">
                <img 
                  src={p4.image?.[0] || fallbackImages[3]} 
                  alt={p4.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-fraunces text-2xl text-white mb-2">{p4.title}</h3>
                  <p className="font-manrope text-white/70 mb-6">{p4.location}</p>
                  <div className="border-t border-white/20 pt-6 flex items-center justify-between">
                    <span className="font-space-mono text-white">{formatPrice(p4.price)}</span>
                    <button className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all" aria-label={`Voir ${p4.title}`}>
                      <span className="font-material-icons text-2xl" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CuratedListingsSection;
