
import React, { useState } from 'react';
import { db } from '../db';
import { User, UserRole } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const users = db.getUsers();
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        db.setSession(user);
        onLoginSuccess(user);
      } else {
        setError('Incorrect email or password. Please try again.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all the details.');
        return;
      }
      const existing = db.getUsers().find(u => u.email === formData.email);
      if (existing) {
        setError('This email is already registered.');
        return;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: UserRole.CLIENT
      };
      
      db.saveUser(newUser);
      db.setSession(newUser);
      onLoginSuccess(newUser);
    }
  };

  const fillDemoAdmin = () => {
    setFormData({
      ...formData,
      email: 'admin@festiva.com',
      password: 'admin'
    });
    setIsLogin(true);
  };

  return (
    <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-sm shadow-2xl border border-slate-100">
      <h2 className="text-4xl font-serif text-slate-900 mb-4 text-center">
        {isLogin ? 'Sign In' : 'Join Us'}
      </h2>
      <p className="text-slate-500 mb-8 text-center text-sm font-light">
        {isLogin 
          ? 'Access your event concierge to manage your bookings.' 
          : 'Create an account to start planning your next celebration.'}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 transition font-light"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}
        
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 rounded-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 transition font-light"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 rounded-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 transition font-light"
              placeholder="03xx xxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 transition font-light"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-all duration-300 mt-4"
        >
          {isLogin ? 'Enter The House' : 'Create Account'}
        </button>
      </form>

      {isLogin && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-100">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2 text-center">Admin Access</p>
          <button 
            onClick={fillDemoAdmin}
            className="w-full text-xs text-amber-600 font-medium hover:text-amber-700 underline text-center"
          >
            Quick Fill Admin Credentials
          </button>
        </div>
      )}

      <div className="mt-10 text-center flex flex-col space-y-4">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-amber-600 text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <button 
          onClick={onBack}
          className="text-slate-400 text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Auth;
