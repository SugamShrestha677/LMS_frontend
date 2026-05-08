import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/lib/services/event.service';
import { toast } from 'react-hot-toast';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getEvents(),
  });
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventData: any) => eventService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstError = Object.values(fieldErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : (fieldErrors.message || 'Failed to create event');
        toast.error(errorMessage);
      } else {
        toast.error('Failed to create event');
      }
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => eventService.updateEvent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstError = Object.values(fieldErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : (fieldErrors.message || 'Failed to update event');
        toast.error(errorMessage);
      } else {
        toast.error('Failed to update event');
      }
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted');
    },
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.registerForEvent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      toast.success('Successfully registered for event!');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to register';
      toast.error(msg);
    },
  });
};

export const useUnregisterFromEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.unregisterFromEvent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      toast.success('Registration cancelled');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to cancel registration';
      toast.error(msg);
    },
  });
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success('Attendee removed from event');
    },
    onError: (error: any) => {
      toast.error('Failed to remove attendee');
    },
  });
};

export const useEventRegistrations = (eventId?: number) => {
  return useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => eventService.getRegistrations(eventId),
  });
};
