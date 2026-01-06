
import React, { useState, useEffect } from 'react';
import { User, Order, Venue, Service } from '../types';
import { db } from '../db';
import { SERVICES, FOOD_PRESENTATION_STYLES, CATERING_PACKAGES } from '../constants';
import { getEventSuggestions } from '../geminiService';

interface BookingFormProps {
  user: User;
  onComplete: () => void;
  editOrder?: Order;
  preSelectedService?: Service;
}

const BookingForm: React.FC<BookingFormProps> = ({ user, onComplete, editOrder, preSelectedService }) => {
  const [step, setStep] = useState(1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  
  const [formData, setFormData] = useState<Partial<Order>>(
    editOrder || {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      clientName: user.name,
      eventType: preSelectedService?.name || SERVICES[0].name,
      eventDate: '',
      venueId: '',
      theme: '',
      catering: CATERING_PACKAGES[0],
      foodPresentation: FOOD_PRESENTATION_STYLES[0],
      status: 'Pending',
      totalAmount: 0,
      createdAt: new Date().toISOString()
    }
  );

  useEffect(() => {
    setVenues(db.getVenues());
    setAllServices(db.getServices());
  }, []);

  const selectedService = allServices.find(s => s.name === formData.eventType);
  const selectedVenue = venues.find(v => v.id === formData.venueId);

  useEffect(() => {
    if (selectedVenue && selectedService) {
      const amount = (selectedService.basePrice || 0) + (selectedVenue.price || 0);
      setFormData(prev => ({ ...prev, totalAmount: amount }));
    }
  }, [formData.eventType, formData.venueId, selectedVenue, selectedService]);

  const handleAiSuggestions = async () => {
    setLoadingSuggestions(true);
    const suggestions = await getEventSuggestions(formData.eventType || 'Event', 100);
    setAiSuggestions(suggestions);
    setLoadingSuggestions(false);
  };

  const handleFinish = () => {
    if (!formData.eventDate || !formData.theme || !formData.venueId) {
      alert('Please complete all the fields to confirm your booking.');
      return;
    }
    db.saveOrder(formData as Order);
    onComplete();
  };

  const StepProgress = () => (
    <div className="flex items-center space-x-6 mb-16">
      {[1, 2, 3, 4].map(s => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step === s ? 'bg-amber-500 text-slate-900 scale-125' : step > s ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {s}
          </div>
          {s < 4 && <div className={`w-12 h-[1px] ml-6 ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="flex-grow animate-fade-in">
          <div className="mb-12">
            <h2 className="text-5xl font-serif text-slate-900 italic mb-4">Event Booking</h2>
            <p className="text-slate-500 font-light tracking-wide uppercase text-[10px] mb-12">Booking ID: {formData.id}</p>
            <StepProgress />
          </div>

          <div className="bg-white border border-slate-200/60 p-12 rounded-sm shadow-sm">
            {step === 1 && (
              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 block">Step 1. Choose Event & Date</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allServices.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setFormData({...formData, eventType: s.name})}
                        className={`p-6 text-left border transition-all duration-500 ${formData.eventType === s.name ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="font-serif text-xl text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">Starting from PKR {s.basePrice.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Pick Your Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 border-b border-slate-200 focus:border-amber-500 outline-none text-slate-900 font-light text-lg transition-all"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  />
                </div>
                <div className="pt-10 flex justify-end">
                  <button onClick={() => setStep(2)} className="px-12 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all">Next Step</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 block">Step 2. Select Your Venue</label>
                  <div className="grid grid-cols-1 gap-4">
                    {venues.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setFormData({...formData, venueId: v.id})}
                        className={`group relative flex items-center p-6 border transition-all duration-500 ${formData.venueId === v.id ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <img src={v.imageUrl} className="w-24 h-24 object-cover mr-8 grayscale group-hover:grayscale-0 transition-all" />
                        <div className="text-left">
                          <div className="font-serif text-xl text-slate-900">{v.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest">{v.location}</div>
                        </div>
                        <div className="ml-auto text-amber-600 font-mono">PKR {v.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-10 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Back</button>
                  <button onClick={() => setStep(3)} className="px-12 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all">Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 block">Step 3. Choose a Theme</label>
                  <div className="flex flex-wrap gap-3 mb-12">
                    {selectedService?.themes?.map(t => (
                      <button
                        key={t}
                        onClick={() => setFormData({...formData, theme: t})}
                        className={`px-8 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.theme === t ? 'bg-amber-500 text-slate-900 border-amber-500' : 'border-slate-200 hover:border-amber-500'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="p-10 bg-slate-50 border border-slate-200 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="font-serif text-2xl mb-2 italic">Festiva Theme Expert</h4>
                      <p className="text-slate-500 text-xs mb-8">Need inspiration? Our AI can suggest unique themes tailored to your choice.</p>
                      <button 
                        onClick={handleAiSuggestions}
                        disabled={loadingSuggestions}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 hover:text-amber-700"
                      >
                        {loadingSuggestions ? 'Thinking...' : 'Get AI Suggestions'}
                      </button>
                      
                      {aiSuggestions.length > 0 && (
                        <div className="mt-8 space-y-4">
                          {aiSuggestions.map((s, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 bg-white border border-slate-200 cursor-pointer hover:border-amber-500 transition-all flex justify-between items-center"
                              onClick={() => setFormData({...formData, theme: s.themeName})}
                            >
                              <span className="font-medium text-slate-900">{s.themeName}</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 italic">{s.vibe}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-10 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Back</button>
                  <button onClick={() => setStep(4)} className="px-12 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all">Next Step</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 block">Step 4. Catering & Presentation</label>
                    <div className="space-y-3">
                      {CATERING_PACKAGES.map(c => (
                        <button key={c} onClick={() => setFormData({...formData, catering: c})} className={`w-full p-4 border transition-all text-[11px] font-medium text-left ${formData.catering === c ? 'border-amber-500 bg-amber-50' : 'border-slate-100'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 block">Presentation Style</label>
                    <div className="space-y-3">
                      {FOOD_PRESENTATION_STYLES.map(f => (
                        <button key={f} onClick={() => setFormData({...formData, foodPresentation: f})} className={`w-full p-4 border transition-all text-[11px] font-medium text-left ${formData.foodPresentation === f ? 'border-amber-500 bg-amber-50' : 'border-slate-100'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-20 border-t border-slate-100 flex flex-col items-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Total Estimated Cost</div>
                  <div className="text-5xl font-serif text-slate-900 mb-12 italic">PKR {formData.totalAmount?.toLocaleString()}</div>
                  <button onClick={handleFinish} className="px-20 py-5 bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all duration-500">Confirm My Booking</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-96 shrink-0 pt-20">
          <div className="sticky top-40 bg-white border border-slate-200 p-8 rounded-sm">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8">Booking Summary</h5>
            <div className="space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <div className="text-[9px] uppercase font-bold text-amber-600 mb-1 tracking-widest">Service</div>
                <div className="font-serif text-xl">{formData.eventType || 'None'}</div>
              </div>
              <div className="pb-6 border-b border-slate-100">
                <div className="text-[9px] uppercase font-bold text-amber-600 mb-1 tracking-widest">Selected Theme</div>
                <div className="font-serif text-xl">{formData.theme || 'TBD'}</div>
              </div>
              <div className="pb-6 border-b border-slate-100">
                <div className="text-[9px] uppercase font-bold text-amber-600 mb-1 tracking-widest">Venue</div>
                <div className="font-serif text-xl">{selectedVenue?.name || 'Pending'}</div>
              </div>
              <div className="pt-4 text-center">
                <p className="text-[10px] text-slate-400 font-light italic leading-relaxed">Our team will contact you within 24 hours to discuss the final touches of your event.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
