'use client';

import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { 
  Users, UserPlus, Mail, Shield, 
  MoreHorizontal, Search, 
  CheckCircle2, XCircle, ArrowRight,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserInput } from '@/lib/validations/auth';
import { toast } from 'sonner';

export function UserManagement() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    createUser(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      },
    });
  };

  const onUpdateRole = (data: { role: string }) => {
    if (!selectedUser) return;
    updateUser({ id: selectedUser.id, data: { role: data.role } }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
      },
    });
  };

  // Filter roles based on current user's role
  const getAvailableRoles = () => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    
    if (isSuperAdmin) {
      return [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'staff', label: 'Staff' },
        { value: 'tutor', label: 'Tutor' },
        { value: 'company', label: 'Company' },
        { value: 'student', label: 'Student' },
      ];
    }
    return [
      { value: 'staff', label: 'Staff' },
      { value: 'tutor', label: 'Tutor' },
      { value: 'company', label: 'Company' },
      { value: 'student', label: 'Student' },
    ];
  };

  const filteredUsers = users?.filter((u: any) => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)] p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            User <span className="text-[var(--color-primary)]">Management</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Manage your pipeline's talent and administrative team.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="rounded-2xl shadow-xl shadow-[var(--color-primary)]/20"
        >
          <UserPlus size={20} className="mr-2" />
          Create New User
        </Button>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Total Users</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{users?.length || 0}</p>
          </div>
        </Card>

        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search by email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[72px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[2rem] pl-14 pr-6 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 transition-all font-medium text-[var(--color-text-primary)] backdrop-blur-sm shadow-lg"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card padding="none" className="overflow-hidden border-none shadow-2xl bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)]/5">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">User Account</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Role</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <TableSkeleton rows={6} />
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
                        <Users size={32} className="text-[var(--color-text-secondary)]/30" />
                      </div>
                      <p className="text-[var(--color-text-secondary)] font-medium">No users found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredUsers?.map((u: any, idx: number) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-[var(--color-primary)]/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{u.email}</span>
                          <span className="text-xs text-[var(--color-text-secondary)] font-medium">{u.personal_email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="primary" className="font-black px-4 py-1.5 rounded-xl border-none uppercase text-[10px] tracking-widest">
                          {u.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            {u.is_active ? (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                            <span className={cn("text-xs font-black uppercase tracking-tighter", u.is_active ? "text-emerald-600" : "text-red-600")}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {u.must_change_password && (
                            <span className="text-[10px] uppercase tracking-tighter font-black text-amber-600 px-2 py-0.5 bg-amber-500/10 rounded-lg w-fit border border-amber-500/20">
                              Setup Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(currentUser?.role === 'super_admin' || currentUser?.is_super_admin) && (
                            <button 
                              onClick={() => {
                                setSelectedUser(u);
                                setIsEditModalOpen(true);
                              }}
                              className="w-10 h-10 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center hover:scale-110 active:scale-95"
                              title="Update Role"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          <button className="w-10 h-10 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition-all flex items-center justify-center hover:scale-110 active:scale-95">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-2">
          <Input 
            label="Organization Email"
            placeholder="username@leapfrogconnect.com"
            icon={<Shield size={18} />}
            {...register('email')}
            error={errors.email?.message}
            className="rounded-2xl"
          />
          <Input 
            label="Personal Email"
            placeholder="user.personal@gmail.com"
            icon={<Mail size={18} />}
            {...register('personal_email')}
            error={errors.personal_email?.message}
            className="rounded-2xl"
          />
          <Select 
            label="Designated Role"
            options={getAvailableRoles()}
            {...register('role')}
            error={errors.role?.message}
            className="rounded-2xl"
          />
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-14 rounded-2xl border-2 font-black text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isCreating}
              className="flex-1 h-14 rounded-2xl shadow-2xl shadow-[var(--color-primary)]/30 font-black text-xs uppercase tracking-widest"
            >
              Generate Account <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal 
        open={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Update User Role"
      >
        <div className="space-y-6 pt-4 pb-2">
          <div className="p-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Editing User</p>
            <p className="font-black text-[var(--color-text-primary)]">{selectedUser?.email}</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-[var(--color-text-primary)]">Select New Role</label>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableRoles().map((role) => (
                <button
                  key={role.value}
                  onClick={() => onUpdateRole({ role: role.value })}
                  disabled={isUpdating}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                    selectedUser?.role === role.value
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30"
                  )}
                >
                  <p className="text-xs font-black uppercase tracking-widest">{role.label}</p>
                  {selectedUser?.role === role.value && (
                    <p className="text-[10px] mt-1 font-bold">Current Role</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              className="h-14 rounded-2xl border-2 font-black text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
