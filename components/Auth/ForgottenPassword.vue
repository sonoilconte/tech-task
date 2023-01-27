<template>
  <div>
    <p>{{ $t('Forgot Password') }}</p>
    <form class="login-form" @submit.prevent="handleForm">
      <SfInput
        v-e2e="'forgot-modal-email'"
        v-model="form.username"
        name="email"
        type="email"
        :label="$t('Forgot Password Modal Email')"
        class="login-form__element"
        required
      />
      <SfButton
        v-e2e="'forgot-modal-submit'"
        type="submit"
        class="sf-button--full-width"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Reset Password') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { useForgotPassword } from '@vsf-enterprise/commercetools';
import { SfInput, SfButton, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'ForgottenPassword',
  components: {
    SfButton,
    SfInput,
    SfLoader
  },
  props: {
    screens: {
      type: Object,
      required: true
    }
  },
  setup({ screens }, { emit }) {
    const { request, loading } = useForgotPassword();
    const form = ref({});

    const handleForm = async () => {
      await request({ email: form.value.username });

      emit('change-current-screen', screens.forgotPasswordConfirmation);
      emit('set-forgotten-email', form.value.username);
    };

    return {
      form,
      loading,
      handleForm
    };
  }
};
</script>
