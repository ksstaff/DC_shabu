
import React from 'react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('consultation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[650px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.heroImageUrl} 
          alt="Partnership Architecture" 
          className="w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brandDark/90 via-brandDark/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-2xl">
          <div className="inline-block bg-brandPrimary text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase shadow-xl">
            Exclusive Franchise Solution
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
            {settings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-300 mb-12 leading-relaxed opacity-90">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#consultation" 
              onClick={scrollToConsultation}
              className="px-10 py-5 bg-brandPrimary text-white text-xl font-black rounded-2xl text-center hover:brightness-110 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-calendar-check"></i>
              {settings.buttonLabels.heroConsultation}
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <i className="fa-solid fa-chevron-down text-white text-xl"></i>
      </div>
    </section>
  );
};
