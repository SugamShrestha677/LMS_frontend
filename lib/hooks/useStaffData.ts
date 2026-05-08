import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

export const useStaffPayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => courseService.getPayments(),
  });
};

export const useConfirmStaffPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) => courseService.confirmPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment confirmed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    },
  });
};

export const useRejectStaffPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number; reason: string }) =>
      courseService.rejectPayment(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    },
  });
};
