<template>
  <div class="form">
    <form class="login-form" @submit.prevent="handleForm" autocomplete="off">
      <SfInput
        v-e2e="'login-modal-email'"
        v-model="form.email"
        :label="$t('Your email')"
        name="email"
        type="email"
        class="login-form__element"
        required
      />
      <SfInput
        v-e2e="'login-modal-firstName'"
        v-model="form.firstName"
        :label="$t('First name')"
        name="first-name"
        class="login-form__element"
        required
      />
      <SfInput
        v-e2e="'login-modal-lastName'"
        v-model="form.lastName"
        :label="$t('Last name')"
        name="last-name"
        class="login-form__element"
        required
      />
      <SfInput
        v-e2e="'login-modal-password'"
        v-model="form.password"
        :label="$t('Password')"
        name="password"
        type="password"
        class="login-form__element"
        required
      />
      <SfButton
        type="submit"
        class="sf-button--full-width"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Create an account') }}</div>
        </SfLoader>
      </SfButton>
    </form>
    <div class="login-action">
      {{ $t('or') }}
      <SfButton
        class="sf-button--text"
        @click="changeScreen"
      >
        {{ $t('Login in to your account') }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { ref, useContext } from '@nuxtjs/composition-api';
import { SfButton, SfInput, SfLoader } from '@storefront-ui/vue';
import { useUser } from '@vsf-enterprise/commercetools';
import { useUiState, useUiNotification } from '~/composables';

export default {
  name: 'Register',
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
    const { app: { i18n } } = useContext();
    const { toggleLoginModal } = useUiState();
    const { send } = useUiNotification();
    const { register, loading, error: userError } = useUser();
    const form = ref({});

    const handleForm = async () => {
      await register({ user: form.value });

      if (!userError.value.register) {
        send({
          type: 'success',
          message: i18n.t('Register an account')
        });
        toggleLoginModal();
      }
    };
    const changeScreen = () => {
      emit('change-current-screen', screens.login);
    };

    return {
      form,
      loading,
      handleForm,
      changeScreen
    };
  }
};
</script>
