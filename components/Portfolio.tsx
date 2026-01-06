
import React from 'react';
import { PORTFOLIO_IMAGES } from '../constants';

interface PortfolioProps {
  onBack: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onBack }) => {
  return (
    <div className="bg-[#0F172A] min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-xl">
            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Living Archive</span>
            <h2 className="text-6xl font-serif text-white italic mb-6">Masterpieces</h2>
            <p className="text-slate-400 font-light leading-relaxed">
              A curated retrospective of our most celebrated commissions. Each image tells a story of heritage, luxury, and the human spirit.
            </p>
          </div>
          <button onClick={onBack} className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors mb-4">← Return to House</button>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
          {PORTFOLIO_IMAGES.map((img, i) => (
            <div key={i} className="group relative break-inside-avoid animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="relative overflow-hidden bg-slate-800">
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-700 flex flex-col justify-end p-10">
                  <span className="text-amber-500 text-[9px] font-bold uppercase tracking-[0.4em] mb-2">Exhibition {2020 + i}</span>
                  <h3 className="text-white text-2xl font-serif italic">{img.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
