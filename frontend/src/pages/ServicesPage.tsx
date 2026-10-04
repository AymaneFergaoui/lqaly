import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Camera, Video, Calculator, PenTool, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 'shooting',
      title: 'Shooting Photo Professionnel',
      description: 'Mettez en valeur votre bien avec des photos haute définition réalisées par nos experts immobiliers.',
      icon: <Camera size={32} />,
      color: 'from-[#E6F0FF] to-[#F5F9FF]',
      iconColor: 'text-[#1A365D]',
      iconBg: 'bg-[#BEE3F8]'
    },
    {
      id: 'video',
      title: 'Vidéo & Visite Virtuelle',
      description: 'Créez des annonces vidéo engageantes et des visites 3D immersives pour attirer plus d\'acheteurs à distance.',
      icon: <Video size={32} />,
      color: 'from-[#FFF0E6] to-[#FFFAF5]',
      iconColor: 'text-[#7B341E]',
      iconBg: 'bg-[#FEEBC8]'
    },
    {
      id: 'estimate',
      title: 'Estimation de Projet',
      description: 'Obtenez une estimation précise de votre bien immobilier ou de votre projet de construction grâce à nos données de marché.',
      icon: <Calculator size={32} />,
      color: 'from-[#F3E8FF] to-[#FAEDFF]',
      iconColor: 'text-[#44337A]',
      iconBg: 'bg-[#E9D8FD]'
    },
    {
      id: 'legal',
      title: 'Accompagnement Juridique',
      description: 'Sécurisez vos transactions avec l\'aide de nos experts juridiques partenaires.',
      icon: <ShieldCheck size={32} />,
      color: 'from-[#DDF7DE] to-[#F7FFF5]',
      iconColor: 'text-[#1B3B1C]',
      iconBg: 'bg-[#BCEABF]'
    },
    {
      id: 'renovation',
      title: 'Travaux & Rénovation',
      description: 'Trouvez les meilleurs artisans pour valoriser votre bien avant la vente ou la location.',
      icon: <PenTool size={32} />,
      color: 'from-[#FFE5E5] to-[#FFF5F5]',
      iconColor: 'text-[#E8384F]',
      iconBg: 'bg-[#FFC2C2]'
    },
    {
      id: 'ads',
      title: 'Publicité & Visibilité',
      description: 'Boostez vos annonces sur nos réseaux partenaires pour vendre ou louer plus rapidement.',
      icon: <TrendingUp size={32} />,
      color: 'from-[#E5F7FF] to-[#F5FCFF]',
      iconColor: 'text-[#005580]',
      iconBg: 'bg-[#BCE6FF]'
    }
  ];

  return (
    <div className="bg-background min-h-screen font-sans">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-[36px] md:text-[48px] font-bold text-foreground mb-4">Nos Services Immobiliers</h1>
            <p className="text-[16px] text-muted-foreground">
              Découvrez l'ensemble de nos services pour vous accompagner à chaque étape de votre projet immobilier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="group relative overflow-hidden rounded-[20px] p-8 min-h-[240px] flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm border border-border"
                style={{ background: `linear-gradient(135deg, ${service.color.split(' ')[1].replace('to-[', '').replace(']', '')} 0%, #FFFFFF 100%)` }}
              >
                <div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${service.iconBg} bg-opacity-50`}>
                    <div className={service.iconColor}>{service.icon}</div>
                  </div>
                  <h3 className="text-[20px] font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
                
                <div className="mt-8">
                  <Link to={`/contact?service=${service.id}`} className="inline-flex items-center text-[14px] font-bold text-primary hover:underline">
                    En savoir plus
                    <span className="material-icons text-[18px] ml-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;
