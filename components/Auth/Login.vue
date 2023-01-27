<template>
  <div>
    <form class="login-form" @submit.prevent="handleForm">
      <SfInput
        v-e2e="'login-modal-email'"
        v-model="form.username"
        :label="$t('Your email')"
        name="email"
        type="email"
        class="login-form__element"
        required
      />
      <SfInput
        v-e2e="'login-modal-password'"
        v-model="form.password"
        name="password"
        label="Password"
        type="password"
        class="login-form__element"
        required
      />
      <SfCheckbox
        v-e2e="'login-modal-remember-me'"
        v-model="rememberMe"
        :label="$t('Remember me')"
        name="remember-me"
        class="login-form__element checkbox"
      />
      <SfButton
        v-e2e="'login-modal-submit'"
        type="submit"
        class="sf-button--full-width"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Login') }}</div>
        </SfLoader>
      </SfButton>
    </form>
    <div class="login-action">
      <SfButton
        class="sf-button--text"
        @click="changeScreen(screens.forgottenPassword)"
      >
        {{ $t('Forgotten password?') }}
      </SfButton>
    </div>
    <div class="bottom">
      <p class="bottom__paragraph">{{ $t('No account') }}</p>
      <SfButton
        class="sf-button--text"
        @click="changeScreen(screens.register)"
      >
        {{ $t('Register today') }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { ref, useContext } from '@nuxtjs/composition-api';
import { useUser } from '@vsf-enterprise/commercetools';
import { SfButton, SfCheckbox, SfInput, SfLoader } from '@storefront-ui/vue';
import { useUiState, useUiNotification } from '~/composables';

export default {
  name: 'ScreenLogin',
  components: {
    SfButton,
    SfCheckbox,
    SfInput,
    SfLoader
  },
  props: {
    screens: {
      type: Object,
      required: true
    }
  },
  setup(_, { emit }) {
    const { app: { i18n } } = useContext();
    const { login, loading, error: userError } = useUser();
    const { toggleLoginModal } = useUiState();
    const { send } = useUiNotification();
    const form = ref({});
    const rememberMe = ref(false);

    const handleForm = async () => {
      await login({ user: form.value });

      if (!userError.value.login) {
        send({
          type: 'success',
          message: i18n.t('Login in to your account')
        });
        toggleLoginModal();
      }
    };
    const changeScreen = (screenName) => {
      emit('change-current-screen', screenName);
    };

    return {
      form,
      loading,
      rememberMe,
      handleForm,
      changeScreen
    };
  }
};
</script>

<style lang="scss" scoped>
.checkbox {
  margin-bottom: var(--spacer-2xl);
}
.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);
  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
</style>
