import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  badge?: string;
  tags?: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id, image, name, price, location, beds, baths, sqft, badge, tags = []
}) => {
  const [favorited, setFavorited] = useState(false);

  return (
    <Link to={`/property/${id}`} className="group block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[16px]">
      <article className="bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 bg-primary text-white font-bold text-[12px] px-2.5 py-1 rounded-[6px]">
              {badge}
            </div>
          )}

          {/* Favourite Button */}
          <button
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={e => { e.preventDefault(); setFavorited(f => !f); }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md hover:bg-white transition-colors duration-200"
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${favorited ? 'text-primary fill-primary' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4">
          {/* Price */}
          <div className="text-[18px] font-bold text-foreground leading-tight mb-1">
            {price}
          </div>

          {/* Meta Info (Beds, Sqft, etc.) */}
          <div className="text-[14px] text-muted-foreground truncate mb-1">
            {beds} {beds === 1 ? 'Chambre' : 'Chambres'} • {baths} Sdb • {sqft.toLocaleString()} m²
          </div>

          {/* Name / Title */}
          <h3 className="text-[14px] text-foreground truncate mb-2">
            {name}
          </h3>

          {/* Location / Metro area */}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mt-2">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: 'var(--color-metro-orange, #F5A623)' }}></div>
            <span className="truncate">{location}</span>
          </div>

          {/* Tag (Optional) */}
          {tags[0] && (
            <div className="mt-3">
              <span className="inline-block font-sans text-[11px] text-muted-foreground border border-border rounded px-2 py-0.5">
                {tags[0]}
              </span>
            </div>
          )}
        </div>
        
      </article>
    </Link>
  );
};

export default PropertyCard;
