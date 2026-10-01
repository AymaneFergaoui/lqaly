import React from 'react';
import mapLocationImage from '../../images/Map_Location.jpg';

const ContactMapSection: React.FC = () => {
  return (
    <section className="bg-[#F2EFE9] py-16">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="relative aspect-[1280/400] rounded-2xl overflow-hidden border border-[#E6E0DA] bg-gray-100">
          {/* Map Image */}
          <img
            src={mapLocationImage}
            alt="Office location map"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          
          {/* Map Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href="https://www.google.com/maps/place/Lqaly/@33.5470625,-7.5973125,942m/data=!3m2!1e3!4b1!4m6!3m5!1s0xda633b86dd47a5d:0x690ebea7aa300d20!8m2!3d33.5470625!4d-7.5973125!16s%2Fg%2F11nr87ggrc?entry=ttu&g_ep=EgoyMDI2MDkyOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow-2xl rounded-xl px-8 py-4 flex items-center gap-3 hover:shadow-3xl transition-shadow group"
            >
              <span className="material-icons text-2xl text-[#FC0903] group-hover:scale-110 transition-transform">
                location_on
              </span>
              <div className="text-left">
                <p className="font-syne font-bold text-base text-[#221410] mb-0.5">
                  Bureau Lqaly
                </p>
                <p className="font-manrope font-extralight text-xs text-[#64748B]">
                  Cliquez pour voir sur Google Maps
                </p>
              </div>
              <span className="material-icons text-[#FC0903]">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;