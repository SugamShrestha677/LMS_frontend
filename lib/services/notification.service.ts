import api from '@/lib/api/axios';
import type { AppNotification } from '@/lib/realtime/types';

interface NotificationListResponse {
  success: boolean;
  data: {
    notifications: AppNotification[];
    unread_count: number;
  };
}

interface MarkReadResponse {
  success: boolean;
  data?: {
    unread_count: number;
  };
}

export async function fetchNotifications(): Promise<{
  notifications: AppNotification[];
  unreadCount: number;
}> {
  const { data } = await api.get<NotificationListResponse>('/accounts/notifications/');
  return {
    notifications: data.data?.notifications ?? [],
    unreadCount: data.data?.unread_count ?? 0,
  };
}

export async function markNotificationRead(id: number): Promise<number> {
  const { data } = await api.patch<MarkReadResponse>(
    `/accounts/notifications/${id}/read/`,
  );
  return data.data?.unread_count ?? 0;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/accounts/notifications/mark-all-read/');
}
