import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-background py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-[24px] font-bold text-foreground">Ce que disent nos clients</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
            <div className="flex gap-1 mb-4 text-[#FCD34D]">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              "Lqaly nous a trouvé la maison de nos rêves en seulement 2 semaines. Le processus était fluide et personnalisé."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
              <div>
                <div className="text-[14px] font-bold text-foreground">Sarah Johnson</div>
                <div className="text-[13px] text-muted-foreground">Casablanca</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
            <div className="flex gap-1 mb-4 text-[#FCD34D]">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              "Les informations sur les quartiers étaient inestimables. Nous savions exactement à quoi nous attendre avant même de visiter."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
              <div>
                <div className="text-[14px] font-bold text-foreground">Michael Chen</div>
                <div className="text-[13px] text-muted-foreground">Rabat</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-card border border-border rounded-[16px] p-6 shadow-sm">
            <div className="flex gap-1 mb-4 text-[#FCD34D]">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              "La meilleure expérience immobilière de ma vie. Les recommandations étaient très précises et nous ont fait gagner des mois de recherche."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
              <div>
                <div className="text-[14px] font-bold text-foreground">Emily Rodriguez</div>
                <div className="text-[13px] text-muted-foreground">Tanger</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
