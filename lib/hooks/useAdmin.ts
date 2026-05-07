// lib/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services/user.service';
import { adminService } from '@/lib/services/admin.service';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => userService.getAuditLogs(),
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    },
  });
};

// Add Soft Delete Hook
export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => 
      userService.softDeleteUser(id, reason),
    onSuccess: (response) => {
      toast.success(response.message || 'User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

// Add Restore User Hook
export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.restoreUser(id),
    onSuccess: (response) => {
      toast.success(response.message || 'User restored successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore user');
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; personal_email: string; role: string }) => 
      userService.createUser(data),
    onSuccess: (response) => {
      toast.success(response.message || 'User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create user.';
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => 
      userService.updateUser(id as number, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update user.';
      toast.error(message);
    },
  });
};

export const useChangeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string | number; role: string }) => 
      userService.changeRole(id as number, role),
    onSuccess: () => {
      toast.success('Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update role.';
      toast.error(message);
    },
  });
};

export const useStaffPermissionByStaffId = (staffId: number | null) => {
  return useQuery({
    queryKey: ['staff-permissions', staffId],
    queryFn: () => userService.getStaffPermissionByStaffId(staffId!),
    enabled: !!staffId,
  });
};

export const useUpdateStaffPermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      userService.updateStaffPermission(id, data),
    onSuccess: () => {
      toast.success('Permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: ['staff-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    },
  });
};