import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, X, Search, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
  totalProperties?: number;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  viewMode?: 'grid' | 'list';
  onViewChange?: (v: 'grid' | 'list') => void;
}

export interface FilterState {
  location?: string;
  propertyType?: string[];
  availability?: string;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

const PROPERTY_TYPES = ['Appartement', 'Maison', 'Villa', 'Bureau'];
const AMENITIES = [
  'Parking', 'Piscine', 'Salle de sport', 'Jardin', 'Sécurité',
  'Clubhouse', 'Générateur électrique', 'Ascenseur', 'Balcon', 'Vidéosurveillance',
  'Aire de jeux', 'Résidence fermée',
];

const formatPriceLabel = (value: number): string => {
  if (value >= 200) return '20+ Cr';
  if (value >= 10) return `${(value / 10).toFixed(value % 10 === 0 ? 0 : 1)} Cr`;
  return `${value * 10} L`;
};

// Small dropdown wrapper — opens below trigger, closes on outside click
const Dropdown: React.FC<{
  label: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ label, active, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-sans text-[14px] font-medium transition-colors duration-200 ${
          active
            ? 'bg-[#171717] border-[#171717] text-white'
            : 'bg-card border-border text-foreground hover:border-gray-400'
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className="absolute top-full left-0 mt-2 z-30 bg-card border border-border rounded-[16px] shadow-lg min-w-[220px]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  totalProperties = 0,
  sortBy = 'featured',
  onSortChange,
  viewMode = 'grid',
  onViewChange,
}) => {
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const f: FilterState = {};
    if (location) f.location = location;
    if (availability) f.availability = availability;
    if (priceRange[0] > 0 || priceRange[1] < 200) f.priceRange = priceRange;
    if (selectedTypes.length) f.propertyType = selectedTypes;
    if (bedrooms > 0) f.bedrooms = bedrooms;
    if (selectedAmenities.length) f.amenities = selectedAmenities;
    onFilterChange?.(f);
  }, [location, availability, priceRange, selectedTypes, bedrooms, selectedAmenities]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMoreFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleReset = () => {
    setLocation(''); setAvailability(''); setPriceRange([0, 200]);
    setSelectedTypes([]); setBedrooms(0); setSelectedAmenities([]);
    onFilterChange?.({});
  };

  const activeCount = [
    location, availability,
    priceRange[0] > 0 || priceRange[1] < 200,
    selectedTypes.length > 0,
    bedrooms > 0,
    selectedAmenities.length > 0,
  ].filter(Boolean).length;

  const toggleType = (t: string) =>
    setSelectedTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleAmenity = (a: string) =>
    setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  return (
    <div className="bg-card border-b border-border sticky top-[72px] z-20 font-sans shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-3">

        <div className="flex items-center gap-2.5 flex-wrap">

          {/* Location search */}
          <div className="relative flex-1 min-w-[200px] max-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Recherche..."
              className="w-full h-[40px] bg-muted border-none rounded-full pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {location && (
              <button onClick={() => setLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Buy / Rent toggle */}
          <div className="flex items-center gap-1 h-[40px] bg-muted rounded-full p-1">
            {['buy', 'rent'].map(a => (
              <button
                key={a}
                onClick={() => setAvailability(av => av === a ? '' : a)}
                className={`h-8 px-4 rounded-full text-[14px] font-medium transition-all duration-200 ${
                  availability === a
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {a === 'buy' ? 'Acheter' : 'Louer'}
              </button>
            ))}
          </div>

          {/* Price */}
          <Dropdown
            label={priceRange[0] > 0 || priceRange[1] < 200
              ? `${formatPriceLabel(priceRange[0])} MAD – ${formatPriceLabel(priceRange[1])} MAD`
              : 'Prix'}
            active={priceRange[0] > 0 || priceRange[1] < 200}
          >
            <div className="p-4 space-y-4 w-[260px]">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider">Fourchette de prix</p>
              <div className="flex justify-between font-sans text-sm text-primary">
                <span>{formatPriceLabel(priceRange[0])}</span>
                <span>{formatPriceLabel(priceRange[1])}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                  <input type="range" min="0" max="200" step="1" value={priceRange[0]}
                    onChange={e => { const v = +e.target.value; if (v < priceRange[1]) setPriceRange([v, priceRange[1]]); }}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                  <input type="range" min="0" max="200" step="1" value={priceRange[1]}
                    onChange={e => { const v = +e.target.value; if (v > priceRange[0]) setPriceRange([priceRange[0], v]); }}
                    className="w-full accent-primary" />
                </div>
              </div>
            </div>
          </Dropdown>

          {/* Type */}
          <Dropdown
            label={selectedTypes.length ? selectedTypes.join(', ') : 'Type'}
            active={selectedTypes.length > 0}
          >
            <div className="p-3 w-[200px]">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 px-1">Type de bien</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PROPERTY_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`h-[36px] rounded-[12px] text-sm font-medium transition-all duration-200 ${
                      selectedTypes.includes(t)
                        ? 'bg-[#171717] text-white'
                        : 'bg-muted text-foreground hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Dropdown>

          {/* Beds */}
          <Dropdown
            label={bedrooms > 0 ? `${bedrooms === 5 ? '5+' : bedrooms} Lit${bedrooms !== 1 ? 's' : ''}` : 'Lits'}
            active={bedrooms > 0}
          >
            <div className="p-3 w-[200px]">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 px-1">Chambres</p>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setBedrooms(n)}
                    className={`w-[36px] h-[36px] rounded-[12px] text-sm font-bold transition-all duration-200 ${
                      bedrooms === n
                        ? 'bg-[#171717] text-white'
                        : 'bg-muted text-foreground hover:bg-gray-200'
                    }`}
                  >
                    {n === 0 ? 'Tous' : n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
            </div>
          </Dropdown>

          {/* More filters */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setShowMoreFilters(o => !o)}
              className={`flex items-center gap-1.5 h-[40px] px-4 rounded-full border text-[14px] font-medium transition-colors duration-200 ${
                selectedAmenities.length > 0
                  ? 'bg-[#171717] border-[#171717] text-white'
                  : 'bg-card border-border text-foreground hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal size={14} />
              Plus{selectedAmenities.length > 0 ? ` (${selectedAmenities.length})` : ''}
            </button>

            <AnimatePresence>
              {showMoreFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                  className="absolute top-full right-0 mt-2 z-30 bg-card border border-border rounded-[16px] shadow-lg w-[300px] p-4"
                >
                  <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">Équipements</p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
                    {AMENITIES.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-left transition-all duration-200 ${
                          selectedAmenities.includes(a)
                            ? 'bg-[#171717] text-white'
                            : 'bg-muted text-foreground hover:bg-gray-200'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 h-[40px] px-3 rounded-full text-[14px] text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <X size={14} /> Effacer
            </button>
          )}

          <div className="flex-1" />

          {/* Count */}
          <span className="text-[14px] text-muted-foreground whitespace-nowrap">
            {totalProperties} {totalProperties === 1 ? 'propriété' : 'propriétés'}
          </span>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => onSortChange?.(e.target.value)}
            className="h-[40px] bg-card border border-border rounded-[12px] px-3 pr-8 text-[14px] text-foreground cursor-pointer focus:outline-none focus:border-primary appearance-none transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236B7280' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center'
            }}
          >
            <option value="featured">En vedette</option>
            <option value="price-low">Prix : Croissant</option>
            <option value="price-high">Prix : Décroissant</option>
            <option value="newest">Plus récent</option>
            <option value="beds">Plus de lits</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 h-[40px] bg-muted rounded-[12px] p-1">
            {(['grid', 'list'] as const).map(m => (
              <button
                key={m}
                onClick={() => onViewChange?.(m)}
                aria-label={`${m} view`}
                className={`w-8 h-8 flex items-center justify-center rounded-[8px] transition-all duration-200 ${
                  viewMode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {m === 'grid' ? <Grid size={18} /> : <List size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
