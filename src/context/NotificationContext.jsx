import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const STORAGE_KEY = 'streamsavvy_notifications';

const hydrateNotifications = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to parse notifications from storage', error);
    return [];
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => hydrateNotifications());

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const exists = prev.some((item) => item.id === notification.id);
      if (exists) {
        return prev.map((item) =>
          item.id === notification.id ? { ...item, ...notification, read: false } : item
        );
      }
      return [{ ...notification, read: false }, ...prev].slice(0, 20);
    });
  }, []);

  const addNotifications = useCallback(
    (items) => {
      if (!Array.isArray(items) || items.length === 0) return;
      setNotifications((prev) => {
        const map = new Map(prev.map((item) => [item.id, item]));
        items.forEach((notification) => {
          const updated = { ...notification, read: false };
          map.set(notification.id, updated);
        });
        return Array.from(map.values())
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .slice(0, 20);
      });
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      addNotifications,
      markAllAsRead,
      clearNotifications,
    }),
    [notifications, unreadCount, addNotification, addNotifications, markAllAsRead, clearNotifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
