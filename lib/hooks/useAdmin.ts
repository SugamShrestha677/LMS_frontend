// lib/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services/user.service';
import { adminService } from '@/lib/services/admin.service';
import { toast } from 'react-hot-toast';

function getApiErrorMessage(error: any, fallback: string) {
  const responseData = error?.response?.data;

  if (!responseData) return fallback;

  if (typeof responseData.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof responseData.error === 'string' && responseData.error.trim()) {
    return responseData.error;
  }

  if (responseData.errors && typeof responseData.errors === 'object') {
    const fieldMessages = Object.values(responseData.errors)
      .flat()
      .filter((value) => typeof value === 'string' && value.trim());

    if (fieldMessages.length > 0) {
      return fieldMessages.join(' ');
    }
  }

  if (typeof responseData.detail === 'string' && responseData.detail.trim()) {
    return responseData.detail;
  }

  return fallback;
}

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
      toast.error(getApiErrorMessage(error, 'Failed to create user.'));
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
      toast.error(getApiErrorMessage(error, 'Failed to update user.'));
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
      toast.error(getApiErrorMessage(error, 'Failed to update role.'));
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
    // Optimistic Update
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['staff-permissions', id] });

      // Snapshot the previous value
      const previousPermissions = queryClient.getQueryData(['staff-permissions', id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['staff-permissions', id], (old: any) => ({
        ...old,
        ...data,
      }));

      // Return a context object with the snapshotted value
      return { previousPermissions, id };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousPermissions) {
        queryClient.setQueryData(
          ['staff-permissions', context.id],
          context.previousPermissions
        );
      }
      toast.error('Failed to update permissions');
    },
    // Always refetch after error or success to guarantee we are in sync with the server
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['staff-permissions', context?.id] });
    },
    onSuccess: () => {
      toast.success('Permissions updated successfully');
    },
  });
};
