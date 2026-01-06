
import React, { useState, useEffect } from 'react';
import { Order, User, Feedback, UserRole, Venue, Service } from '../types';
import { db } from '../db';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [tab, setTab] = useState<'orders' | 'services' | 'venues' | 'clients' | 'feedback'>('orders');
  const [orderFilter, setOrderFilter] = useState<Order['status'] | 'All'>('All');
  
  // States for Modals
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    setOrders(db.getOrders());
    setFeedback(db.getFeedback());
    const allUsers = db.getUsers();
    setClients(allUsers.filter(u => u.role === UserRole.CLIENT));
    setVenues(db.getVenues());
    setServices(db.getServices());
  }, [tab, showVenueModal, showServiceModal]);

  const updateStatus = (id: string, status: Order['status']) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      const updated = { ...order, status };
      db.saveOrder(updated);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    }
  };

  const filteredOrders = orderFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  // Analytics Calculations
  const totalRevenue = orders
    .filter(o => o.status === 'Confirmed' || o.status === 'Completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  const avgRating = feedback.length > 0 
    ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1)
    : "N/A";

  const StatsHeader = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-[#161D2F] border border-slate-800 p-8 rounded-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Total Revenue</div>
        <div className="text-3xl font-mono text-amber-500">PKR {totalRevenue.toLocaleString()}</div>
      </div>
      <div className="bg-[#161D2F] border border-slate-800 p-8 rounded-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Engagements</div>
        <div className="text-3xl font-serif text-white">{orders.length}</div>
      </div>
      <div className="bg-[#161D2F] border border-slate-800 p-8 rounded-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Client Satisfaction</div>
        <div className="text-3xl font-serif text-white">{avgRating} <span className="text-sm text-slate-500 font-sans">/ 5.0</span></div>
      </div>
      <div className="bg-[#161D2F] border border-slate-800 p-8 rounded-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Active Establisments</div>
        <div className="text-3xl font-serif text-white">{venues.length}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-slate-300 pt-32 pb-24 px-8">
      <div className="max-w-screen-2xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-serif text-white mb-2 italic">Festiva Command</h2>
            <p className="text-slate-500 text-sm font-light tracking-wide uppercase">Operational Intelligence & Logistics</p>
          </div>
          <div className="flex bg-[#161D2F] p-1 rounded-sm border border-slate-800">
            {(['orders', 'services', 'venues', 'clients', 'feedback'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm ${tab === t ? 'bg-amber-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <StatsHeader />

        <div className="bg-[#161D2F] border border-slate-800 rounded-sm overflow-hidden shadow-2xl relative">
          
          {/* ORDERS VIEW */}
          {tab === 'orders' && (
            <div>
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0F172A]">
                <div className="flex space-x-4">
                  {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(f => (
                    <button 
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${orderFilter === f ? 'bg-slate-700 text-amber-500 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Showing {filteredOrders.length} records</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0A0F1C] text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-6">Engagement Reference</th>
                      <th className="px-8 py-6">Client</th>
                      <th className="px-8 py-6">Timeline</th>
                      <th className="px-8 py-6">Commission</th>
                      <th className="px-8 py-6">Current State</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-[#1E2638] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="text-white font-serif text-lg">{o.eventType}</div>
                          <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">Ref: {o.id}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-slate-300 font-medium">{o.clientName}</div>
                          <div className="text-[10px] text-slate-500">Theme: {o.theme}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-slate-400 text-sm">{new Date(o.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </td>
                        <td className="px-8 py-6 font-mono text-amber-400/80">
                          PKR {o.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                            o.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            o.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-slate-700/50 text-slate-400 border-slate-600'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <select 
                            value={o.status} 
                            onChange={(e) => updateStatus(o.id, e.target.value as any)} 
                            className="bg-slate-900 border border-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-sm py-2 px-3 outline-none focus:border-amber-500 transition-colors cursor-pointer"
                          >
                            <option value="Pending">Queue</option>
                            <option value="Confirmed">Approve</option>
                            <option value="Completed">Archive</option>
                            <option value="Cancelled">Rescind</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="py-32 text-center text-slate-600 italic font-serif">No engagements match the current filter.</div>
                )}
              </div>
            </div>
          )}

          {/* SERVICES VIEW */}
          {tab === 'services' && (
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif text-white">Service Collections</h3>
                <button 
                  onClick={() => setShowServiceModal(true)}
                  className="px-6 py-2 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-amber-400 transition-colors"
                >
                  Create New Collection
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map(s => (
                  <div key={s.id} className="bg-[#0A0F1C] border border-slate-800 p-8 rounded-sm hover:border-amber-500/50 transition-all group flex flex-col h-full">
                    <div className="flex-grow">
                      <h4 className="text-xl font-serif text-white mb-2">{s.name}</h4>
                      <p className="text-xs text-slate-500 font-light mb-6 line-clamp-3 leading-relaxed">{s.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {s.themes.map(t => (
                          <span key={t} className="text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-slate-800 text-slate-400 rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-6 border-t border-slate-800/50">
                      <span className="text-amber-500 font-mono text-sm">PKR {s.basePrice.toLocaleString()}</span>
                      <div className="flex space-x-4">
                        <button className="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Edit</button>
                        <button 
                          onClick={() => { if(confirm('Are you sure?')) { db.deleteService(s.id); setServices(db.getServices()); } }}
                          className="text-[9px] font-bold uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VENUES VIEW */}
          {tab === 'venues' && (
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif text-white">Estate Registry</h3>
                <button 
                  onClick={() => setShowVenueModal(true)}
                  className="px-6 py-2 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-amber-400 transition-colors"
                >
                  Enlist New Estate
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {venues.map(v => (
                  <div key={v.id} className="bg-[#0A0F1C] border border-slate-800 rounded-sm overflow-hidden group">
                    <div className="h-48 overflow-hidden relative">
                      <img src={v.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent opacity-60"></div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-xl font-serif text-white mb-1">{v.name}</h4>
                      <p className="text-[10px] text-amber-500 uppercase tracking-widest mb-4">{v.location}</p>
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-xs text-slate-500">Capacity: <span className="text-white">{v.capacity}</span></div>
                        <div className="text-sm font-mono text-slate-300">PKR {v.price.toLocaleString()}</div>
                      </div>
                      <div className="flex space-x-4 border-t border-slate-800 pt-6">
                        <button className="flex-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 py-2 border border-slate-800 hover:text-white hover:border-slate-700 transition-all">Details</button>
                        <button 
                          onClick={() => { if(confirm('Remove this estate?')) { db.deleteVenue(v.id); setVenues(db.getVenues()); } }}
                          className="px-4 text-[9px] font-bold uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENTS VIEW */}
          {tab === 'clients' && (
            <div className="p-10">
              <div className="mb-10">
                <h3 className="text-2xl font-serif text-white">Client List</h3>
                <p className="text-slate-500 text-xs mt-1">Global directory of individuals commissioned by Festiva.</p>
              </div>
              <div className="space-y-4">
                {clients.map(c => (
                  <div key={c.id} className="flex flex-col md:flex-row justify-between items-center p-8 bg-[#0A0F1C] border border-slate-800 rounded-sm hover:border-slate-700 transition-all group">
                    <div className="mb-4 md:mb-0">
                      <div className="text-white font-serif text-xl mb-1">{c.name}</div>
                      <div className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-bold">{c.email}</div>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <div className="text-slate-400 font-mono text-sm mb-1">{c.phone}</div>
                      <div className="text-[9px] text-slate-600 uppercase tracking-widest">Commissioned 1 Engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEEDBACK VIEW */}
          {tab === 'feedback' && (
            <div className="p-10">
              <div className="mb-12">
                <h3 className="text-2xl font-serif text-white">Sentiment Archives</h3>
                <p className="text-slate-500 text-xs mt-1">Direct feedback from our distinguished guests.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {feedback.map(f => (
                  <div key={f.id} className="bg-[#0A0F1C] border border-slate-800 p-8 rounded-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-white font-serif text-lg leading-tight">{f.clientName}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{new Date(f.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-sm ${star <= f.rating ? 'text-amber-500' : 'text-slate-800'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-400 font-light text-sm italic leading-relaxed border-l-2 border-amber-500/20 pl-6">"{f.comment}"</p>
                  </div>
                ))}
              </div>
              {feedback.length === 0 && <div className="py-20 text-center italic text-slate-600">No sentiments recorded yet.</div>}
            </div>
          )}
        </div>
      </div>

      {/* Add Venue Modal */}
      {showVenueModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-[#161D2F] border border-slate-800 w-full max-w-lg p-10 animate-fade-in">
            <h3 className="text-2xl font-serif text-white mb-8">Register New Estate</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const newVenue: Venue = {
                id: 'v-' + Math.random().toString(36).substr(2, 5),
                name: target.name.value,
                location: target.location.value,
                capacity: parseInt(target.capacity.value),
                price: parseInt(target.price.value),
                imageUrl: target.imageUrl.value || 'https://picsum.photos/seed/estate/800/600'
              };
              db.saveVenue(newVenue);
              setShowVenueModal(false);
            }} className="space-y-6">
              <input name="name" required placeholder="Estate Name" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <input name="location" required placeholder="Province / City" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="capacity" required type="number" placeholder="Guest Capacity" className="bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
                <input name="price" required type="number" placeholder="Price per Engagement" className="bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              </div>
              <input name="imageUrl" placeholder="Image URL (Optional)" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowVenueModal(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Abort</button>
                <button type="submit" className="flex-1 py-3 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-[#161D2F] border border-slate-800 w-full max-w-lg p-10 animate-fade-in">
            <h3 className="text-2xl font-serif text-white mb-8">Define New Collection</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const newService: Service = {
                id: 's-' + Math.random().toString(36).substr(2, 5),
                name: target.name.value,
                description: target.description.value,
                basePrice: parseInt(target.price.value),
                themes: target.themes.value.split(',').map((t: string) => t.trim()),
                imageUrl: target.imageUrl.value || 'https://picsum.photos/seed/coll/800/600'
              };
              db.saveService(newService);
              setShowServiceModal(false);
            }} className="space-y-6">
              <input name="name" required placeholder="Collection Name" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <textarea name="description" required placeholder="Curated Description" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none min-h-[100px]" />
              <input name="price" required type="number" placeholder="Base Commission Value" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <input name="themes" required placeholder="Available Themes (Comma separated)" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <input name="imageUrl" placeholder="Image URL (Optional)" className="w-full bg-[#0A0F1C] border border-slate-800 p-3 text-sm focus:border-amber-500 outline-none" />
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Abort</button>
                <button type="submit" className="flex-1 py-3 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">Publish Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
