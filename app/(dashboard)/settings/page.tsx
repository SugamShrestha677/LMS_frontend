'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  User, Lock, Bell, Shield, 
  CreditCard, Globe, Moon, Save,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[#1E1E2A]">Account <span className="text-gradient">Settings</span></h1>
        <p className="text-[#5A5A6E] mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile Info', icon: User, active: true },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
            { id: 'privacy', label: 'Privacy', icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active 
                  ? 'bg-[#0A5C4A] text-white shadow-md' 
                  : 'text-[#5A5A6E] hover:bg-gray-100 hover:text-[#1E1E2A]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Profile Section */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-[#1E1E2A] mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative group self-start">
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center text-[#0A5C4A] font-black text-3xl border-2 border-white shadow-lg overflow-hidden">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-3xl">
                    <Globe size={20} />
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" defaultValue={user?.first_name} />
                    <Input label="Last Name" defaultValue={user?.last_name} />
                  </div>
                  <Input label="Email Address" defaultValue={user?.email} disabled />
                  <p className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1">
                    <Shield size={10} /> Email cannot be changed during beta
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#1E1E2A] mb-4">Bio</h4>
                <textarea 
                  className="w-full min-h-[120px] rounded-xl border border-[#e5e7eb] p-4 text-sm outline-none focus:ring-2 focus:ring-[#0A5C4A] focus:border-transparent transition-all"
                  placeholder="Tell us about yourself..."
                  defaultValue="Passionate learner and tech enthusiast."
                />
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-[#1E1E2A] mb-6">Security</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E1E2A]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#5A5A6E]">Currently enabled via email</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-white">Manage</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-[#1E1E2A] mb-6">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1E1E2A]">Email Notifications</p>
                  <p className="text-xs text-[#5A5A6E]">Receive weekly summaries and job matches</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-[#0A5C4A] relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1E1E2A]">Dark Mode</p>
                  <p className="text-xs text-[#5A5A6E]">Switch between light and dark theme</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-gray-200 relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="font-bold">Discard Changes</Button>
            <Button onClick={handleSave} loading={loading} className="px-8 shadow-primary">
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
