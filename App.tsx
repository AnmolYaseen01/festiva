
import React, { useState, useEffect } from 'react';
import { User, UserRole, Order, Service } from './types';
import { db } from './db';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingForm from './components/BookingForm';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import ProfileSettings from './components/ProfileSettings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'auth' | 'dashboard' | 'book' | 'portfolio' | 'services' | 'profile'>('home');
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
  const [preSelectedService, setPreSelectedService] = useState<Service | undefined>(undefined);

  useEffect(() => {
    const session = db.getCurrentUser();
    if (session) setUser(session);
  }, []);

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setView('home');
  };

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    if (preSelectedService) {
      setView('book');
    } else {
      setView('dashboard');
    }
  };

  const navigateToBook = (order?: Order) => {
    setEditingOrder(order);
    setPreSelectedService(undefined);
    setView('book');
  };

  const handleServiceBooking = (service: Service) => {
    setPreSelectedService(service);
    if (!user) {
      setView('auth');
    } else {
      setView('book');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Hero onBookClick={() => setView('services')} onPortfolioClick={() => setView('portfolio')} />;
      case 'auth':
        return <Auth onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
      case 'portfolio':
        return <Portfolio onBack={() => setView('home')} />;
      case 'services':
        return <Services onBookNow={handleServiceBooking} onBack={() => setView('home')} />;
      case 'dashboard':
        if (!user) return <Auth onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
        return user.role === UserRole.ADMIN ? (
          <AdminDashboard />
        ) : (
          <ClientDashboard 
            user={user} 
            onEditOrder={navigateToBook} 
            onStartBooking={() => setView('services')} 
          />
        );
      case 'book':
        if (!user) return <Auth onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
        return (
          <BookingForm 
            user={user} 
            onComplete={() => setView('dashboard')} 
            editOrder={editingOrder}
            preSelectedService={preSelectedService}
          />
        );
      case 'profile':
        if (!user) return <Auth onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
        return <ProfileSettings user={user} onUpdate={(u) => setUser(u)} onClose={() => setView('dashboard')} />;
      default:
        return <Hero onBookClick={() => setView('services')} onPortfolioClick={() => setView('portfolio')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={(v: any) => setView(v)} 
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-slate-900 text-white py-20 px-8 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-4xl font-serif font-black mb-6 tracking-tighter">FESTIVA<span className="text-amber-500">.</span></div>
          <p className="text-slate-400 max-w-md mb-12 font-light leading-relaxed">
            Planning weddings and birthdays across Pakistan. Experience the ease of luxury event management with our online booking platform.
          </p>
          <div className="flex space-x-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <button onClick={() => setView('services')} className="hover:text-white transition-colors">Our Services</button>
            <button onClick={() => setView('portfolio')} className="hover:text-white transition-colors">The Archive</button>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 w-full text-[10px] text-slate-600 font-medium tracking-widest">
            &copy; {new Date().getFullYear()} FESTIVA EVENT MANAGEMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
