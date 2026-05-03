'use client';

import { useAdminUsers } from '@/lib/hooks/useAdminData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MoreVertical, 
  UserPlus, Shield, Mail, CheckCircle2, 
  XCircle, Edit, Trash2, Ban
} from 'lucide-react';
import { useState } from 'react';
import { formatDate, getRoleBadgeColor } from '@/lib/utils';

export default function AdminUsers() {
  const [params, setParams] = useState({});
  const { data: users, isLoading } = useAdminUsers(params);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const displayUsers = users ?? [
    { id: 1, name: 'Sagar KC', email: 'sagar@leapfrog.com', role: 'student', status: 'active', joined: '2024-04-01' },
    { id: 2, name: 'Priya Shrestha', email: 'priya@meta.com', role: 'company', status: 'pending', joined: '2024-04-28' },
    { id: 3, name: 'Anil Kapoor', email: 'anil@staff.com', role: 'staff', status: 'active', joined: '2024-03-15' },
    { id: 4, name: 'Bina Tamang', email: 'bina@mail.com', role: 'student', status: 'banned', joined: '2024-01-10' },
    { id: 5, name: 'Ravi Verma', role: 'admin', email: 'ravi@admin.com', status: 'active', joined: '2023-12-01' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">User <span className="text-gradient">Management</span></h1>
          <p className="text-[#5A5A6E] mt-1">Manage all users, roles, and permissions across the platform.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 bg-white">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
          <Button className="h-11 shadow-primary">
            <UserPlus size={18} className="mr-2" /> Add New User
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A6E]" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#0A5C4A] focus:border-transparent outline-none bg-white text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-40 px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-sm font-medium outline-none">
            <option>All Roles</option>
            <option>Student</option>
            <option>Company</option>
            <option>Admin</option>
          </select>
          <select className="flex-1 sm:w-40 px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-sm font-medium outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden border-white/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-[#e5e7eb]">
                <th className="px-6 py-4 text-xs font-black text-[#5A5A6E] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-black text-[#5A5A6E] uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-black text-[#5A5A6E] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-[#5A5A6E] uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-black text-[#5A5A6E] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" rounded="full" /></td>
                  </tr>
                ))
              ) : displayUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#0A5C4A] font-bold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1E1E2A]">{user.name}</p>
                        <p className="text-xs text-[#5A5A6E] flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'} 
                      size="sm"
                      dot
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A5A6E] font-medium">
                    {formatDate(user.joined)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#5A5A6E] hover:text-[#0A5C4A] hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-[#5A5A6E] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Ban">
                        <Ban size={16} />
                      </button>
                      <button className="p-2 text-[#5A5A6E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50/50 border-t border-[#e5e7eb] flex items-center justify-between">
          <p className="text-xs font-bold text-[#5A5A6E]">Showing 5 of 1,245 users</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 bg-white" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 bg-white">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
