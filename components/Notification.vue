<template>
  <transition-group tag="div" class="notifications" name="slide-fade">
    <SfNotification
      v-for="notification in notifications"
      :key="notification.id"
      :message="notification.message"
      :action="notification.action && notification.action.text"
      :type="notification.type"
      @click:close="notification.dismiss"
      @click:action="handleActionClick(notification.action, notification.dismiss)"
      class="notification"
      v-e2e="'notification'"
      visible
    >
      <template #icon v-if="notification.icon">
        <SfIcon :icon="notification.icon" color="white" class="sf-notification__icon"/>
      </template>
    </SfNotification>
  </transition-group>
</template>

<script>
import { SfNotification, SfIcon } from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default {
  name: 'Notification',
  components: {
    SfNotification,
    SfIcon
  },
  setup () {
    const { notifications } = useUiNotification();

    const handleActionClick = (action, dismiss) => {
      action?.onClick();
      dismiss();
    };

    return {
      notifications,
      handleActionClick
    };
  }
};
</script>

<style lang="scss" scoped>
.notifications {
  position: fixed;
  right: 20px;
  top: 20px;
  bottom: auto;
  z-index: 10000;
  max-width: 340px;
  @include for-mobile {
    max-width: 100%;
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
  }
}
.notification::v-deep {
  &.sf-notification {
    margin: var(--spacer-xs) auto 0 auto;
    padding-right: 2rem;
    --notification-font-size: var(--font-size--xs);
    &:first-child {
      margin-top: 0;
    }
    @include for-desktop {
      padding-right: 3rem;
      margin: 0 0 var(--spacer-xs) 0;
    }
    @include for-mobile {
      --notification-background: var(--c-link);
      --notification-border-radius: 0;
      --notification-max-width: 100%;
      --notification-font-family: var(--font-family--primary);
      --notification-font-weight: var(--font-weight--normal);
      --notification-font-size: var(--font-size--sm);
      --notification-padding: var(--spacer-base);
      --notification-action-display: block;
    }
  }
  .sf-notification__action {
    margin-top: var(--spacer-xs);
    padding: var(--spacer-2xs) var(--spacer-xs);
    text-decoration: none;
    border: 1px solid;
    border-radius: 5px;
    opacity: 0.8;
  }
  .sf-notification__close {
    top: var(--spacer-sm);
    @include for-mobile {
      top: var(--spacer-base);
    }
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s;
  @include for-desktop {
    transition: opacity 0.25s linear;
  }
}
.slide-fade-enter {
  transform: translateY(40px);
  @include for-desktop {
    opacity: 0;
    transform: translateY(0);
  }
}
.slide-fade-leave-to {
  transform: translateY(80px);
  @include for-desktop {
    opacity: 0;
    transform: translateY(0);
  }
}
</style>
