import { computed, ref, ComputedRef } from '@nuxtjs/composition-api';
import { UseUiNotification, SendUiNotificationParams } from './types';

const notifications = ref<UseUiNotification[]>([]);
const maxVisibleNotifications = 3;
const timeToLive = 5000;

const useUiNotification = () => {
  const send = (notification: SendUiNotificationParams) => {
    const id = Symbol();

    const dismiss = () => {
      const index = notifications.value.findIndex(notification => notification.id === id);

      if (index !== -1) notifications.value.splice(index, 1);
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    notifications.value.push(newNotification);
    if (notifications.value.length > maxVisibleNotifications) notifications.value.shift();

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }

    return dismiss;
  };
  const hasNotifications: ComputedRef<boolean> = computed(() => notifications.value.length > 0);

  return {
    send,
    notifications,
    hasNotifications
  };
};

export default useUiNotification;
