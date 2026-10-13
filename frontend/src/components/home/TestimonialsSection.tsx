import React, { useState } from 'react';

interface Testimonial {
  name: string;
  city: string;
  avatar: string;
  initials: string;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Yassine El Amrani',
    city: 'Casablanca, Maroc',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'YA',
    comment: "L'IA de Lqaly nous a trouvé la maison de nos rêves en seulement 2 semaines. Le processus était fluide et personnalisé.",
  },
  {
    name: 'Kenza Berrada',
    city: 'Rabat, Maroc',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'KB',
    comment: "Les informations sur les quartiers étaient inestimables. Nous savions exactement à quoi nous attendre avant même de visiter.",
  },
  {
    name: 'Mehdi Benjelloun',
    city: 'Tanger, Maroc',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'MB',
    comment: "La meilleure expérience immobilière de ma vie. Les recommandations de l'IA étaient très précises et nous ont fait gagner des mois de recherche.",
  },
];

const TestimonialAvatar: React.FC<{ src: string; alt: string; initials: string }> = ({ src, alt, initials }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB] bg-[#FC0903]/10 flex items-center justify-center">
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span className="font-syne font-bold text-sm text-[#FC0903]">{initials}</span>
      )}
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-[#F9F7F2] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <div className="font-space-mono text-sm text-[#FC0903] uppercase tracking-widest mb-4">Témoignages</div>
            <h2 className="font-fraunces text-5xl text-[#111827]">Ce que disent nos clients</h2>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white border border-[#f3f4f6] rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-icons text-[#FCD34D] text-xl">star</span>
                  ))}
                </div>
                <p className="font-manrope text-base text-[#4b5563] leading-relaxed mb-6">
                  "{item.comment}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TestimonialAvatar src={item.avatar} alt={item.name} initials={item.initials} />
                <div>
                  <div className="font-syne font-bold text-sm text-[#111827]">{item.name}</div>
                  <div className="font-manrope text-xs text-[#6b7280]">{item.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
