
import React from 'react';

interface HeroProps {
  onBookClick: () => void;
  onPortfolioClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookClick, onPortfolioClick }) => {
  return (
    <div className="relative min-h-screen flex items-center bg-[#0F172A] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" 
          alt="Festiva Grand Wedding" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pt-20">
        <div className="max-w-3xl animate-fade-in">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-[1px] w-12 bg-amber-500"></div>
            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em]">Welcome to Festiva</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl text-white font-serif mb-8 leading-[0.95] tracking-tight">
            The Art of Your <br />
            <span className="italic font-normal text-amber-200/90">Celebration</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300/80 mb-12 font-light leading-relaxed max-w-xl">
            Festiva is Pakistan's premier choice for grand weddings and unforgettable birthdays. We combine timeless tradition with modern luxury to create moments that last forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <button 
              onClick={onBookClick}
              className="group relative px-10 py-5 bg-amber-500 text-slate-900 rounded-sm font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-white"
            >
              <span className="relative z-10">Start Online Booking</span>
            </button>
            <button 
              onClick={onPortfolioClick}
              className="px-10 py-5 border border-white/20 text-white rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500"
            >
              Our Past Events
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 flex flex-col items-center space-y-4 opacity-40">
        <span className="[writing-mode:vertical-lr] text-[10px] uppercase font-bold tracking-[0.5em] text-white">Discover More</span>
        <div className="h-16 w-[1px] bg-white"></div>
      </div>
    </div>
  );
};

export default Hero;
