<template>
  <div class="confirmation">
    <i18n tag="p" class="confirmation__paragraph" path="forgotPasswordConfirmation">
      <span class="confirmation__paragraph--bold">{{ email }}</span>
    </i18n>
    <p class="confirmation__paragraph">{{ $t('Thank You Inbox') }}</p>
  </div>
</template>

<script>
export default {
  name: 'ForgottenPasswordConfirmation',
  props: {
    email: String
  }
};
</script>

<style lang="scss" scoped>
.confirmation {
  &__paragraph {
    &--bold {
      font-weight: var(--font-weight--semibold);
    }
  }
}
</style>
