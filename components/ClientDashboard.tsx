
import React, { useState, useEffect } from 'react';
import { User, Order, Feedback } from '../types';
import { db } from '../db';

interface ClientDashboardProps {
  user: User;
  onEditOrder: (order: Order) => void;
  onStartBooking: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onEditOrder, onStartBooking }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const all = db.getOrders();
    setOrders(all.filter(o => o.clientId === user.id));
  }, [user.id]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.comment) return;
    
    const newFb: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      clientName: user.name,
      rating: feedback.rating,
      comment: feedback.comment,
      createdAt: new Date().toISOString()
    };
    
    db.saveFeedback(newFb);
    setFeedback({ rating: 5, comment: '' });
    setShowFeedback(false);
    alert('Thank you for sharing your feedback with Festiva.');
  };

  const confirmCancel = () => {
    if (cancellingOrder) {
      db.deleteOrder(cancellingOrder.id);
      setOrders(prev => prev.filter(o => o.id !== cancellingOrder.id));
      setCancellingOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 pt-32">
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-serif text-slate-900 italic mb-2">My Concierge</h2>
          <p className="text-slate-500 font-light">View and manage your upcoming events and past celebrations.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFeedback(true)}
            className="px-8 py-3 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
          >
            Leave Feedback
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-sm">
          <p className="text-slate-400 font-light mb-8">You haven't booked any events with Festiva yet.</p>
          <button 
             onClick={onStartBooking}
             className="px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all"
          >
            Explore Our Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-10 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10 group hover:border-amber-500 transition-all">
              <div className="flex-grow">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-4 py-1 text-[9px] uppercase font-black tracking-widest rounded-full ${order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="text-slate-900 text-[10px] font-bold uppercase tracking-widest">{order.eventType}</span>
                </div>
                <h3 className="text-3xl font-serif italic mb-4">{order.theme}</h3>
                <div className="text-slate-500 font-light text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>📅 Event Date: {new Date(order.eventDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p>🍴 Dining: {order.catering}</p>
                  <p className="text-amber-600 font-bold md:col-span-2">Total Estimated: PKR {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-4 w-full md:w-auto">
                <button 
                  onClick={() => onEditOrder(order)}
                  className="flex-grow md:flex-none px-8 py-3 bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition"
                >
                  Edit Booking
                </button>
                <button 
                  onClick={() => setCancellingOrder(order)}
                  className="flex-grow md:flex-none px-8 py-3 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simplified Feedback Modal Content */}
      {showFeedback && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg p-10 rounded-sm animate-fade-in">
            <h3 className="text-3xl font-serif italic mb-6">Your Experience</h3>
            <p className="text-slate-500 text-sm mb-8 font-light italic">Help us maintain the high standards of Festiva by sharing your thoughts.</p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Rating</label>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFeedback({...feedback, rating: r})}
                      className={`w-12 h-12 border-2 flex items-center justify-center transition-all ${feedback.rating >= r ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 font-light min-h-[120px]"
                  placeholder="Tell us about your event..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
