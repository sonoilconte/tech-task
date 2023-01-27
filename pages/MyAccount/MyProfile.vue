<template>
  <SfTabs :open-tab="1">
    <!-- Personal data update -->
    <SfTab :title="$t('Personal data')">
      <p class="message">
        {{ $t('Feel free to edit') }}
      </p>

      <ProfileUpdateForm @submit="updatePersonalData" />

      <p class="notice">
        {{ $t('Use your personal data') }}
        <nuxt-link to="/">{{ $t('Privacy Policy') }}</nuxt-link>
      </p>
    </SfTab>

    <!-- Password reset -->
    <SfTab :title="$t('Password change')">
      <p class="message">
        {{ $t('Change password your account') }}:<br />
        {{ $t('Your current email address is') }}
        <span
          v-e2e="'myaccount-message-email'"
          class="message__label"
        >
          {{currentEmail}}
        </span>
      </p>

      <PasswordResetForm @submit="updatePassword" />
    </SfTab>
  </SfTabs>
</template>

<script>
import { useUser, userGetters } from '@vsf-enterprise/commercetools';
import { SfTabs } from '@storefront-ui/vue';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm';

export default {
  name: 'PersonalDetails',

  components: {
    SfTabs,
    ProfileUpdateForm,
    PasswordResetForm
  },

  setup() {
    const { updateUser, changePassword, user } = useUser();

    const currentEmail = userGetters.getEmailAddress(user.value);

    const formHandler = async (fn, onComplete, onError) => {
      try {
        const data = await fn();
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    const updatePersonalData = ({ form, onComplete, onError }) => formHandler(() => updateUser({ user: form.value }), onComplete, onError);
    const updatePassword = ({ form, onComplete, onError }) => formHandler(() => changePassword({ current: form.value.currentPassword, new: form.value.newPassword }), onComplete, onError);

    return {
      currentEmail,
      updatePersonalData,
      updatePassword
    };
  }
};
</script>

<style lang='scss' scoped>
.message,
.notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font-size: var(--font-size--base);
  &__label {
    font-weight: 400;
  }
}
.notice {
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);
}

</style>
