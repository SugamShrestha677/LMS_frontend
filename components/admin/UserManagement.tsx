'use client';

import { useUsers, useCreateUser, useUpdateUser, useChangeRole, useSoftDeleteUser, useRestoreUser, useActivateUser, useDeactivateUser, useStaffPermissionByStaffId, useUpdateStaffPermission } from '@/lib/hooks/useAdmin';
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
  Edit2, Trash2, RotateCcw, AlertCircle,
  Eye, EyeOff, Settings as SettingsIcon,
  Check, X, Filter,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserInput } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

interface UserManagementProps {
  roleFilter?: string;
  title?: string;
  subtitle?: string;
}

export function UserManagement({ roleFilter, title, subtitle }: UserManagementProps) {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, refetch } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: changeRole, isPending: isUpdating } = useChangeRole();
  const { mutate: softDeleteUser, isPending: isDeleting } = useSoftDeleteUser();
  const { mutate: restoreUser, isPending: isRestoring } = useRestoreUser();
  const { mutate: activateUser } = useActivateUser();
  const { mutate: deactivateUser } = useDeactivateUser();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  // Staff Permissions state
  const { data: staffPermissions, isLoading: isLoadingPermissions } = useStaffPermissionByStaffId(
    selectedUser?.role === 'staff' ? selectedUser.id : null
  );
  const { mutate: updatePermissions, isPending: isUpdatingPermissions } = useUpdateStaffPermission();

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
    changeRole({ id: selectedUser.id, role: data.role }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const handleTogglePermission = (key: string) => {
    if (!staffPermissions || !selectedUser) return;
    const newData = { ...staffPermissions, [key]: !staffPermissions[key] };
    updatePermissions({ id: selectedUser.id, data: newData });
  };

  const handleSoftDelete = () => {
    if (!selectedUser) return;
    softDeleteUser(
      { id: selectedUser.id, reason: deleteReason || 'No reason provided' },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
          setDeleteReason('');
          refetch();
        },
      }
    );
  };

  const handleRestore = (user: any) => {
    restoreUser(user.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleToggleActive = (user: any) => {
    if (user.is_active) {
      deactivateUser(user.id);
    } else {
      activateUser(user.id);
    }
  };

  // Filter roles based on current user's role
  const getAvailableRoles = () => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    
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
    
    if (isAdmin) {
      return [
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

  const filteredUsers = useMemo(() => {
    const userListFromApi = Array.isArray(users) ? users : users?.data || [];
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    
    return userListFromApi.filter((u: any) => {
      if (isAdmin && u.role === 'super_admin') return false;
      if (!showDeleted && u.is_deleted) return false;
      if (showDeleted && !u.is_deleted) return false;
      
      const matchesSearch = 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      
      return matchesSearch && matchesRole;
    });
  }, [users, currentUser, showDeleted, searchTerm, roleFilter]);

  const canEditUser = (targetUser: any) => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    if (targetUser.is_deleted) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) return !['super_admin', 'admin'].includes(targetUser.role);
    return false;
  };

  const canManageStaffPermissions = (targetUser: any) => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    if (targetUser.role !== 'staff') return false;
    if (targetUser.is_deleted) return false;
    return isSuperAdmin || isAdmin;
  };

  const canDeleteUser = (targetUser: any) => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    if (targetUser.is_deleted) return false;
    if (targetUser.id === currentUser?.id) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) return !['super_admin', 'admin'].includes(targetUser.role);
    return false;
  };

  const canRestoreUser = (targetUser: any) => {
    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.is_super_admin;
    const isAdmin = currentUser?.role === 'admin';
    if (!targetUser.is_deleted) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) return !['super_admin', 'admin'].includes(targetUser.role);
    return false;
  };

  const getStatusBadge = (user: any) => {
    if (user.is_deleted) {
      return {
        icon: <XCircle size={14} />,
        text: 'Deleted',
        className: 'bg-red-500/10 text-red-600 border-red-500/20'
      };
    }
    if (user.is_active) {
      return {
        icon: <CheckCircle2 size={14} />,
        text: 'Active',
        className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      };
    }
    return {
      icon: <AlertCircle size={14} />,
      text: 'Inactive',
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border-2 border-[var(--color-border)] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 max-w-full overflow-hidden">
          <h1 className="text-2xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight uppercase truncate">
            {title || (roleFilter ? `${roleFilter.replace('_', ' ')} Management` : 'User Management')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-bold flex items-center gap-2 text-sm md:text-base">
            <span className="hidden md:block w-8 h-1 bg-[var(--color-primary)] rounded-full" />
            <span className="truncate">{subtitle || 'Manage your platform\'s talent and administrative team.'}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto">
          <Button
            variant={showDeleted ? "primary" : "outline"}
            onClick={() => setShowDeleted(!showDeleted)}
            className="flex-1 md:flex-none rounded-2xl h-12 md:h-14 px-4 md:px-6 border-2 font-black uppercase tracking-widest text-[9px] md:text-[10px]"
          >
            {showDeleted ? <Eye size={18} className="mr-2" /> : <EyeOff size={18} className="mr-2" />}
            <span className="whitespace-nowrap">{showDeleted ? 'Show Active' : 'Show Deleted'}</span>
          </Button>
          {!showDeleted && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none rounded-2xl h-12 md:h-14 px-6 md:px-8 shadow-2xl shadow-[var(--color-primary)]/30 font-black uppercase tracking-widest text-[9px] md:text-[10px]"
            >
              <UserPlus size={18} className="mr-2" />
              <span className="whitespace-nowrap">Create User</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-5 p-6 bg-white border-2 border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/10">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">
              {showDeleted ? 'Deleted Count' : 'Total Population'}
            </p>
            <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter">
              {filteredUsers.length}
            </p>
          </div>
        </Card>

        <div className="md:col-span-3 relative group">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input 
            type="text" 
            placeholder={showDeleted ? "Search archived records..." : "Search by name, email, or role..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[80px] bg-white border-2 border-[var(--color-border)] rounded-[2rem] pl-16 pr-8 outline-none focus:border-[var(--color-primary)] transition-all font-bold text-lg text-[var(--color-text-primary)] shadow-sm focus:shadow-xl focus:shadow-[var(--color-primary)]/5"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <div className="h-8 w-px bg-[var(--color-border)] mr-2" />
             <Filter size={18} className="text-[var(--color-text-secondary)]" />
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <Card padding="none" className="overflow-hidden border-2 border-[var(--color-border)] shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30 border-b-2 border-[var(--color-border)]">
                <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">User Profile</th>
                <th className="hidden lg:table-cell px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Access Level</th>
                <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Account Status</th>
                <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[var(--color-border)]">
              {isLoading ? (
                <tr><td colSpan={4} className="p-0"><TableSkeleton rows={6} /></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-[var(--color-muted)]/50 flex items-center justify-center border-2 border-dashed border-[var(--color-border)]">
                        <Users size={32} className="text-[var(--color-text-secondary)]/30" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-widest">No users detected</p>
                        <p className="text-xs font-bold text-[var(--color-text-secondary)] mt-1">Try broadening your search or filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u: any, idx: number) => {
                    const status = getStatusBadge(u);
                    return (
                      <motion.tr 
                        key={u.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04 }}
                        className={cn(
                          "hover:bg-[var(--color-primary)]/[0.02] transition-colors group",
                          u.is_deleted && "opacity-60 bg-red-500/[0.02]"
                        )}
                      >
                        <td className="px-6 md:px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[var(--color-muted)] items-center justify-center font-black text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                              {u.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors truncate tracking-tight text-sm md:text-base">
                                {u.email}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="hidden md:block text-[10px] text-[var(--color-text-secondary)] font-bold truncate tracking-tight">
                                  {u.personal_email}
                                </span>
                                <Badge className="lg:hidden font-black px-2 py-0.5 rounded-lg border-2 border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 text-[var(--color-primary)] uppercase text-[8px] tracking-widest">
                                  {u.role?.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-8 py-6">
                          <Badge className="font-black px-4 py-2 rounded-xl border-2 border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 text-[var(--color-primary)] uppercase text-[9px] tracking-widest shadow-sm">
                            {u.role?.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="hidden sm:table-cell px-8 py-6">
                          <div className="flex flex-col gap-2">
                            <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest w-fit",
                              status.className
                            )}>
                              {status.icon}
                              {status.text}
                            </div>
                            {u.must_change_password && !u.is_deleted && (
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-tighter px-2.5 py-1 bg-amber-500/5 rounded-lg w-fit border-2 border-amber-500/10">
                                <Clock size={10} className="animate-pulse" /> Setup Pending
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-2 md:group-hover:translate-x-0">
                            {canManageStaffPermissions(u) && (
                              <button 
                                onClick={() => { setSelectedUser(u); setIsPermissionModalOpen(true); }}
                                className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-110 active:scale-95"
                                title="Access Control"
                              >
                                <Shield size={18} />
                              </button>
                            )}
                            {!showDeleted && canEditUser(u) && (
                              <button 
                                onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }}
                                className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-110 active:scale-95"
                                title="Modify Role"
                              >
                                <Edit2 size={20} />
                              </button>
                            )}
                            {showDeleted && canRestoreUser(u) && (
                              <button 
                                onClick={() => handleRestore(u)}
                                disabled={isRestoring}
                                className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-110 active:scale-95"
                                title="Restore Account"
                              >
                                <RotateCcw size={20} />
                              </button>
                            )}
                            {!showDeleted && canDeleteUser(u) && (
                              <button 
                                onClick={() => { setSelectedUser(u); setIsDeleteModalOpen(true); }}
                                disabled={isDeleting}
                                className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-110 active:scale-95"
                                title="Archive Account"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                            {!showDeleted && !u.is_deleted && (
                              <button 
                                onClick={() => handleToggleActive(u)}
                                className="w-11 h-11 rounded-2xl bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-text-primary)] hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-110 active:scale-95"
                                title={u.is_active ? "Lock Access" : "Unlock Access"}
                              >
                                {u.is_active ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Staff Permission Modal */}
      <Modal 
        open={isPermissionModalOpen} 
        onClose={() => { setIsPermissionModalOpen(false); setSelectedUser(null); }}
        title="Staff Access Control"
      >
        <div className="space-y-8 pt-4 pb-2">
          <div className="p-6 rounded-[2rem] bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/10 shadow-inner flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg">
                <Shield size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-0.5">Target Identity</p>
                <p className="font-black text-[var(--color-text-primary)] text-lg tracking-tight">{selectedUser?.email}</p>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] px-2">Module Access Gates</h3>
            
            {isLoadingPermissions ? (
              <div className="flex flex-col items-center py-16 gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin shadow-xl shadow-[var(--color-primary)]/10" />
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest animate-pulse">Syncing Permissions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'can_create_users', label: 'User Hub', desc: 'Creation & audit of all accounts' },
                  { key: 'can_manage_courses', label: 'LMS Core', desc: 'Course architecture & deployment' },
                  { key: 'can_manage_students', label: 'Student CRM', desc: 'Lifecycle & enrollment flow' },
                  { key: 'can_manage_tutors', label: 'Faculty Ops', desc: 'Tutor mapping & verification' },
                  { key: 'can_manage_companies', label: 'B2B Portal', desc: 'Partnership & company data' },
                  { key: 'can_manage_payments', label: 'Finance Engine', desc: 'Payment verification & logic' },
                  { key: 'can_manage_settings', label: 'System Prefs', desc: 'Global platform configuration' },
                  { key: 'can_view_analytics', label: 'Data Lab', desc: 'Real-time performance metrics' },
                ].map((perm) => {
                  const hasPerm = !!staffPermissions?.[perm.key];
                  return (
                    <button
                      key={perm.key}
                      onClick={() => handleTogglePermission(perm.key)}
                      disabled={isUpdatingPermissions}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all group text-left relative overflow-hidden",
                        hasPerm
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.03] shadow-md"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/30 hover:shadow-lg"
                      )}
                    >
                      {hasPerm && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[var(--color-primary)]" />}
                      <div className="flex-1 pr-4">
                        <p className={cn(
                          "text-xs font-black uppercase tracking-widest transition-colors",
                          hasPerm ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"
                        )}>
                          {perm.label}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] font-bold mt-1 opacity-80">{perm.desc}</p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border-2",
                        hasPerm 
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] scale-110" 
                          : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] border-[var(--color-border)] group-hover:scale-105"
                      )}>
                        {hasPerm ? <Check size={18} strokeWidth={4} /> : <X size={18} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-6">
            <Button 
              onClick={() => { setIsPermissionModalOpen(false); setSelectedUser(null); }}
              fullWidth
              className="h-16 rounded-2xl shadow-xl shadow-[var(--color-primary)]/10 font-black uppercase tracking-widest text-xs"
            >
              Finalize Permissions <CheckCircle2 size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create New User Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Spawn New Identity"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-2">
          <Input 
            label="Professional Identity (Email)"
            placeholder="alias@leapfrogconnect.com"
            icon={<Shield size={20} />}
            {...register('email')}
            error={errors.email?.message}
            className="rounded-2xl h-14 font-bold border-2"
          />
          <Input 
            label="Recovery Gateway (Personal Email)"
            placeholder="user.personal@provider.com"
            icon={<Mail size={20} />}
            {...register('personal_email')}
            error={errors.personal_email?.message}
            className="rounded-2xl h-14 font-bold border-2"
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-2">Designated Role Architecture</label>
            <Select 
              options={getAvailableRoles()}
              {...register('role')}
              error={errors.role?.message}
              className="rounded-2xl h-14 font-bold border-2"
            />
          </div>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isCreating}
              className="flex-1 h-16 rounded-2xl shadow-2xl shadow-[var(--color-primary)]/30 font-black uppercase tracking-widest text-xs"
            >
              Initialize User <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal 
        open={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
        title="Override Access Level"
      >
        <div className="space-y-8 pt-4 pb-2">
          <div className="p-6 rounded-[2rem] bg-blue-500/5 border-2 border-blue-500/10 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg">
                <Shield size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-0.5">Target Identity</p>
                <p className="font-black text-[var(--color-text-primary)] text-lg tracking-tight">{selectedUser?.email}</p>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-2">Elevate/Modify Role Architecture</label>
            <div className="grid grid-cols-1 gap-3">
              {getAvailableRoles().map((role) => (
                <button
                  key={role.value}
                  onClick={() => onUpdateRole({ role: role.value })}
                  disabled={isUpdating}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 transition-all group text-left",
                    selectedUser?.role === role.value
                      ? "border-blue-500 bg-blue-500/[0.03] shadow-md"
                      : "border-[var(--color-border)] bg-white hover:border-blue-500/30"
                  )}
                >
                  <div>
                    <p className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      selectedUser?.role === role.value ? "text-blue-500" : "text-[var(--color-text-primary)]"
                    )}>
                      {role.label}
                    </p>
                  </div>
                  {selectedUser?.role === role.value && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button 
              variant="outline"
              onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
              fullWidth
              className="h-16 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete/Archive Modal */}
      <Modal 
        open={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
        title="Archive Account"
      >
        <div className="space-y-8 pt-4 pb-2">
          <div className="p-8 rounded-[2rem] bg-red-500/5 border-2 border-red-500/10 text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/30 mx-auto">
                <Trash2 size={36} />
             </div>
             <div>
                <h4 className="text-xl font-black text-red-600 uppercase tracking-tight">Confirm Deactivation</h4>
                <p className="text-xs font-bold text-[var(--color-text-secondary)] mt-2">
                  You are about to archive <span className="text-[var(--color-text-primary)]">{selectedUser?.email}</span>. 
                  This will revoke all platform access immediately.
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-2">Deactivation Audit Trail (Reason)</label>
            <textarea 
              placeholder="Provide a mandatory reason for archiving this identity..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full min-h-[120px] p-6 rounded-[2rem] border-2 border-[var(--color-border)] bg-white outline-none focus:border-red-500 transition-all font-bold text-sm resize-none"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
              className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-xs"
            >
              Abort
            </Button>
            <Button 
              onClick={handleSoftDelete}
              loading={isDeleting}
              disabled={!deleteReason.trim()}
              className="flex-1 h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-2xl shadow-red-500/30 font-black uppercase tracking-widest text-xs"
            >
              Confirm Archive
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
