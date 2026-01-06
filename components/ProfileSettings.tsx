
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../db';

interface ProfileSettingsProps {
  user: User;
  onUpdate: (user: User) => void;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: user.password || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = { ...user, ...formData };
    if (db.updateUser(updated)) {
      onUpdate(updated);
      onClose();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-3xl font-serif text-slate-900 mb-6 text-center">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
          <input type="tel" className="w-full p-3 rounded-xl bg-slate-50 border" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" />
          <input type="email" disabled className="w-full p-3 rounded-xl bg-slate-100 border text-slate-400" value={formData.email} />
          {/* Fixed typo from dclassName to className */}
          <input type="password" className="w-full p-3 rounded-xl bg-slate-50 border" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="New Password" />
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Update Profile</button>
          <button type="button" onClick={onClose} className="w-full py-2 text-slate-400 text-sm">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
