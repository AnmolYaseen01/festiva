
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { db } from '../db';

interface ServicesProps {
  onBookNow: (service: Service) => void;
  onBack: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBookNow, onBack }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(db.getServices());
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-20 text-center max-w-2xl mx-auto animate-fade-in">
          <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">What We Do</span>
          <h2 className="text-5xl font-serif text-slate-900 mb-6 italic">Our Expertise</h2>
          <p className="text-slate-500 font-light leading-relaxed">
            From majestic wedding ceremonies to vibrant birthday parties, we handle every detail so you can enjoy your special day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {services.map((s, idx) => (
            <div key={s.id} className={`flex flex-col group animate-fade-in`} style={{ animationDelay: `${idx * 0.2}s` }}>
              <div className="relative aspect-[16/10] overflow-hidden mb-10 bg-slate-200">
                <img 
                  src={s.imageUrl || `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000`} 
                  alt={s.name} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Pricing from PKR {s.basePrice.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="max-w-xl">
                <h3 className="text-3xl font-serif text-slate-900 mb-4">{s.name}</h3>
                <p className="text-slate-500 font-light leading-relaxed mb-8">
                  {s.name === 'Marriage Ceremony' 
                    ? 'Celebrate your union with elegance. We provide complete Nikah, Mehndi, and Valima arrangements with signature Pakistani hospitality.'
                    : 'Make every birthday a magical memory. From themed decor to entertainment, we create joy for children and adults alike.'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  {s.themes.map(t => (
                    <span key={t} className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-700 px-3 py-1 bg-amber-50 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => onBookNow(s)}
                  className="inline-flex items-center space-x-4 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 group-hover:text-amber-600 transition-colors"
                >
                  <span>Book This Service</span>
                  <div className="w-12 h-[1px] bg-slate-900 group-hover:bg-amber-600 group-hover:w-16 transition-all duration-500"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
