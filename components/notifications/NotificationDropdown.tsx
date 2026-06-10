'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '@/lib/realtime/notificationStore';
import {
  handleMarkAllNotificationsRead,
  handleMarkNotificationRead,
} from '@/components/providers/RealtimeProvider';
import { cn } from '@/lib/utils';

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const hydrated = useNotificationStore((s) => s.hydrated);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleNotificationClick = async (id: number, isRead: boolean) => {
    if (!isRead) {
      await handleMarkNotificationRead(id);
    }
  };

  const handleMarkAll = async () => {
    await handleMarkAllNotificationsRead();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] transition-all border border-[var(--color-border)]"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="absolute right-0 top-full mt-3 w-80 bg-[var(--color-bg-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] z-20 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                <p className="text-sm font-black">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void handleMarkAll()}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] hover:opacity-80"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {!hydrated ? (
                  <p className="p-4 text-sm text-[var(--color-text-secondary)] animate-pulse">
                    Loading notifications...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="p-4 text-sm text-[var(--color-text-secondary)]">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        void handleNotificationClick(notification.id, notification.is_read)
                      }
                      className={cn(
                        'w-full text-left px-4 py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-muted)] transition',
                        !notification.is_read && 'bg-[var(--color-primary)]/5',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 uppercase tracking-wider">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
