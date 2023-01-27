<template>
  <SfModal
    v-e2e="'login-modal'"
    :visible="isAuthModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t(barTitle)"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <Login
        v-if="currentScreen === screens.login"
        :screens="screens"
        @change-current-screen="setCurrentScreen"
      />
      <ForgottenPassword
        v-else-if="currentScreen === screens.forgottenPassword"
        :screens="screens"
        @change-current-screen="setCurrentScreen"
        @set-forgotten-email="setUserForgottenEmail"
      />
      <ForgottenPasswordConfirmation
        v-else-if="currentScreen === screens.forgotPasswordConfirmation"
        :email="forgottenEmail"
      />
      <Register
        v-else
        :screens="screens"
        @change-current-screen="setCurrentScreen"
      />
    </transition>
  </SfModal>
</template>

<script>
import { ref, computed } from '@nuxtjs/composition-api';
import { SfModal, SfBar } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import Login from './Login';
import ForgottenPassword from './ForgottenPassword';
import ForgottenPasswordConfirmation from './ForgottenPasswordConfirmation';
import Register from './Register';

export default {
  name: 'AuthModal',
  components: {
    Register,
    ForgottenPasswordConfirmation,
    ForgottenPassword,
    Login,
    SfModal,
    SfBar
  },
  setup() {
    const screens = {
      login: 'login',
      register: 'register',
      forgotPasswordConfirmation: 'forgotPasswordConfirmation',
      forgottenPassword: 'forgottenPassword'
    };
    const { isAuthModalOpen, toggleLoginModal } = useUiState();
    const forgottenEmail = ref('');
    const currentScreen = ref(screens.register);

    const barTitle = computed(() => {
      switch (currentScreen.value) {
        case screens.login:
          return 'Sign in';
        case screens.register:
          return 'Register';
        default:
          return 'Reset Password';
      }
    });

    const setCurrentScreen = (screenName) => {
      currentScreen.value = screenName;
    };
    const closeModal = () => {
      setCurrentScreen(screens.register);
      toggleLoginModal();
    };
    const setUserForgottenEmail = (email) => {
      forgottenEmail.value = email;
    };

    return {
      isAuthModalOpen,
      forgottenEmail,
      barTitle,
      currentScreen,
      screens,
      setCurrentScreen,
      closeModal,
      setUserForgottenEmail
    };
  }
};
</script>

<style lang="scss">
.login-form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
}
.login-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6 var(--font-family--secondary);
  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}
</style>
