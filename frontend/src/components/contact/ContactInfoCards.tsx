import React from 'react';

const ContactInfoCards: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Visit Our Office Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#FC0903]">
              location_on
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#221410] mb-2">
              Visitez Notre Bureau
            </h3>
            <p className="font-manrope font-extralight text-sm text-[#4B5563] leading-relaxed mb-3">
              GCW3+R35,<br />
              Casablanca 20000
            </p>
            <a
              href="https://www.google.com/maps/place/Lqaly/@33.5470625,-7.5973125,942m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda633b86dd47a5d:0x690ebea7aa300d20!8m2!3d33.5470625!4d-7.5973125!16s%2Fg%2F11nr87ggrc?entry=ttu&g_ep=EgoyMDI2MDkyOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-manrope font-medium text-sm text-[#FC0903] hover:text-[#C05621] transition-[color]"
            >
              <span>Obtenir l'itinéraire</span>
              <span className="material-icons text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Call or Email Us Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#FC0903]">
              phone
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#221410] mb-3">
              Appelez-nous ou Envoyez un Email
            </h3>
            <div className="space-y-2">
              <a
                href="tel:+212699945264"
                className="flex items-center gap-2 font-manrope font-extralight text-sm text-[#4B5563] hover:text-[#FC0903] transition-[color]"
              >
                <span className="material-icons text-base">
                  call
                </span>
                <span>+212 699-945264</span>
              </a>
              <a
                href="mailto:contact@lqaly.com"
                className="flex items-center gap-2 font-manrope font-extralight text-sm text-[#4B5563] hover:text-[#FC0903] transition-[color]"
              >
                <span className="material-icons text-base">
                  email
                </span>
                <span>contact@lqaly.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#FC0903]">
              schedule
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#221410] mb-3">
              Heures d'Ouverture
            </h3>
            <div className="space-y-2 font-manrope font-extralight text-sm text-[#4B5563]">
              <div className="flex justify-between items-center">
                <span>Lun - Ven :</span>
                <span className="font-medium text-[#221410]">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Samedi :</span>
                <span className="font-medium text-[#221410]">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dimanche :</span>
                <span className="font-medium text-[#221410]">Fermé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCards;