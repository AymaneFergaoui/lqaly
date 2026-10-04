import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import { ChevronRight, MapPin } from 'lucide-react';
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
        
        // Show up to 8 properties for a 4-column grid (2 rows)
        setProperties(allProperties.slice(0, 8));
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
      <section className="bg-background py-16 relative flex justify-center items-center min-h-[400px]">
         <div className="font-sans text-primary animate-pulse">Chargement des recommandations...</div>
      </section>
    );
  }

  // Use fallback dummy properties if none fetched
  const displayProperties = properties.length > 0 ? properties : [
    { _id: '1', title: 'Villa de luxe à Bouskoura', location: 'Bouskoura, Casablanca', price: 4500000, beds: 4, baths: 3, sqft: 350, type: 'house', availability: 'available', image: [glassPavilion] },
    { _id: '2', title: 'Penthouse avec vue', location: 'Marina, Agadir', price: 3200000, beds: 3, baths: 2, sqft: 180, type: 'apartment', availability: 'available', image: [skylinePenthouse] },
    { _id: '3', title: 'Oasis au coeur de la palmeraie', location: 'Palmeraie, Marrakech', price: 8900000, beds: 6, baths: 5, sqft: 600, type: 'house', availability: 'available', image: [desertOasis] },
    { _id: '4', title: 'Retraite côtière', location: 'Achakkar, Tanger', price: 5400000, beds: 4, baths: 4, sqft: 420, type: 'house', availability: 'available', image: [coastalRetreat] },
  ];

  return (
    <section className="bg-background py-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[24px] font-bold text-foreground">Recommandé pour vous</h2>
          <Link to="/properties" className="flex items-center gap-1 text-primary font-medium hover:underline text-[15px]">
            Voir tout
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Property Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayProperties.map((prop, idx) => (
            <Link key={prop._id || idx} to={`/properties/${prop._id}`} className="group block bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border/50">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img 
                  src={prop.image?.[0] || fallbackImages[idx % fallbackImages.length]} 
                  alt={prop.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-primary text-white font-bold text-[12px] px-2.5 py-1 rounded-[6px]">
                  Nouveau
                </div>
              </div>
              <div className="p-4">
                <div className="text-[18px] font-bold text-foreground mb-1">
                  {formatPrice(prop.price)}
                </div>
                <div className="text-[14px] text-muted-foreground truncate mb-1">
                  {prop.beds} pièces • {prop.sqft} m²
                </div>
                <div className="text-[14px] text-foreground truncate mb-2">
                  {prop.title}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mt-2">
                  <MapPin size={14} className="text-primary/70" />
                  <span className="truncate">{prop.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CuratedListingsSection;
