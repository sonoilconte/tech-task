<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form__element">
      <SfInput
        v-e2e="'myaccount-current-password'"
        v-model="form.currentPassword"
        type="password"
        name="currentPassword"
        :label="$t('Current password')"
        required
      />
    </div>
    <div class="form__horizontal">
      <div vid="password" class="form__element">
        <SfInput
          v-e2e="'myaccount-new-password'"
          v-model="form.newPassword"
          type="password"
          name="newPassword"
          :label="$t('New password')"
          required
        />
      </div>
      <div class="form__element">
        <SfInput
          v-e2e="'myaccount-repeat-password'"
          v-model="form.repeatPassword"
          type="password"
          name="repeatPassword"
          :label="$t('Repeat Password')"
          required
        />
      </div>
    </div>
    <SfButton
      v-e2e="'myaccount-update-password-btn'"
      type="submit"
      class="form__button"
    >
      {{ $t('Update password') }}
    </SfButton>
  </form>
</template>

<script>
import { ref, useContext } from '@nuxtjs/composition-api';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default {
  name: 'PasswordResetForm',

  components: {
    SfInput,
    SfButton
  },

  setup(_, { emit }) {
    const { app: { i18n } } = useContext();
    const { send } = useUiNotification();
    const resetForm = () => ({
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    });

    const form = ref(resetForm());

    const submitForm = () => {
      const onComplete = () => {
        form.value = resetForm();
        send({ type: 'success', message: i18n.t('Password has been changed'), icon: 'account' });
      };

      const onError = () => {
        // TODO: Handle error
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      form,
      submitForm
    };
  }
};
</script>

<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
