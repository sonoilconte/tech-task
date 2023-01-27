<template>
  <div class="customer">
    <SfHeading
      :level="3"
      :title="$t('Do you have an account?')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <p class="customer__text">
      {{ $t('You can login to your account or register a new one.') }}
    </p>
    <div class="customer__element">
      <SfButton
        class="form__action-button"
        @click="toggleLoginModal"
      >
        {{ $t('Login') }} / {{ $t('Register') }}
      </SfButton>
    </div>
    <SfDivider class="customer__element" />
    <p class="customer__text">
      {{ $t('Or you can continue as a guest.') }} {{ $t('Provide your email address') }}:
    </p>
    <form @submit.prevent="handleSubmit" class="form">
        <SfInput
          :value="guestEmail"
          @input="handleEmailUpdate"
          :label="$t('Your email')"
          name="email"
          type="email"
          required
        />
      <div class="customer__element">
        <SfButton
          class="form__action-button"
          type="submit"
        >
          {{ $t('Continue as Guest') }}
        </SfButton>
      </div>
    </form>
  </div>
</template>

<script>
import {
  SfButton,
  SfHeading,
  SfInput,
  SfDivider
} from '@storefront-ui/vue';
import { useContext, useRouter, watch } from '@nuxtjs/composition-api';
import { useGuestEmail, useUser } from '@vsf-enterprise/commercetools';
import { useUiState } from '~/composables';

export default {
  name: 'Customer',
  components: {
    SfButton,
    SfHeading,
    SfInput,
    SfDivider
  },
  setup() {
    const { app: { localePath } } = useContext();
    const router = useRouter();
    const { guestEmail, setCustomerEmail, updateCustomerEmail } = useGuestEmail();
    const { isAuthenticated } = useUser();
    const { toggleLoginModal } = useUiState();

    const handleSubmit = async () => {
      await setCustomerEmail(guestEmail.value);
      router.push(localePath({ name: 'billing' }));
    };
    const handleEmailUpdate = email => updateCustomerEmail(email);

    watch(isAuthenticated, () => {
      if (isAuthenticated.value) {
        router.push(localePath({ name: 'billing' }));
      }
    }, { immediate: true });

    return {
      handleSubmit,
      handleEmailUpdate,
      toggleLoginModal,
      guestEmail
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
.customer {
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__text {
    margin: 0 0 var(--spacer-base) 0;
  }
}
.form {
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    width: 100%;
    @include for-desktop {
      width: 25rem;
    }
  }
}
</style>
