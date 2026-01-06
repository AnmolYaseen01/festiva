
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 glass border-b border-slate-200/50 z-[100] px-8 py-5 transition-all duration-500">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <div 
          className="text-3xl font-serif font-black tracking-[-0.05em] text-slate-900 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          FESTIVA<span className="text-amber-500 group-hover:text-amber-600 transition-colors">.</span>
        </div>
        
        <div className="hidden lg:flex space-x-12 items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-600 transition-colors"> Home </button>
          <button onClick={() => onNavigate('services')} className="hover:text-amber-600 transition-colors"> Services </button>
          <button onClick={() => onNavigate('portfolio')} className="hover:text-amber-600 transition-colors"> Portfolio </button>
          {user && (
            <button onClick={() => onNavigate('dashboard')} className="hover:text-amber-600 transition-colors">Concierge</button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('profile')} 
                className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-amber-600 transition-colors"
              >
                {user.name}
              </button>
              <button 
                onClick={onLogout}
                className="px-6 py-2 border border-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-full"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="px-8 py-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 rounded-full shadow-lg shadow-slate-200"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
