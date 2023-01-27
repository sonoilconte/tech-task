<template>
  <div id="checkout">
    <div class="checkout">
      <div class="checkout__main">
        <SfSteps
          v-if="!isThankYou"
          :active="currentStepIndex"
          class="checkout__steps"
          @change="handleStepClick"
        >
          <SfStep
            v-for="(step, key) in steps"
            :key="key"
            :name="$t(step)"
          >
            <nuxt-child />
          </SfStep>
        </SfSteps>
        <nuxt-child v-else />
      </div>
      <div
        v-if="!isThankYou"
        class="checkout__aside"
      >
        <transition name="fade">
          <CartPreview key="order-summary" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { SfSteps } from '@storefront-ui/vue';
import { useUser } from '@vsf-enterprise/commercetools';
import { useVSFContext } from '@vue-storefront/core';
import { computed, useContext, useRoute, useRouter } from '@nuxtjs/composition-api';
import CartPreview from '~/components/Checkout/CartPreview';

export default {
  name: 'Checkout',
  components: {
    SfSteps,
    CartPreview
  },
  middleware: ['checkout'],
  setup() {
    const { app: { localePath } } = useContext();
    const route = useRoute();
    const router = useRouter();
    const {
      $ct: {
        config: { enableCustomerCheckoutStep }
      }
    } = useVSFContext();
    const { isAuthenticated } = useUser();

    const steps = {
      ...(enableCustomerCheckoutStep && !isAuthenticated.value ? { customer: 'Customer' } : false),
      billing: 'Billing',
      shipping: 'Shipping',
      payment: 'Payment'
    };

    const currentStep = computed(() => route.value.path.split('/').pop());
    const currentStepIndex = computed(() => Object.keys(steps).findIndex(s => s === currentStep.value));
    const isThankYou = computed(() => currentStep.value === 'thank-you');

    const handleStepClick = (stepIndex) => {
      const name = Object.keys(steps)[stepIndex];
      router.push(localePath({ name }));
    };

    return {
      handleStepClick,
      steps,
      currentStepIndex,
      isThankYou,
      currentStep
    };
  }
};
</script>

<style lang="scss" scoped>
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.checkout {
  @include for-desktop {
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }
  &__steps {
    --steps-content-padding: 0 var(--spacer-base);
    ::v-deep .sf-steps__step.is-done  {
      color: var(--c-primary);
    }
    @include for-desktop {
      --steps-content-padding: 0;
    }
  }
}

</style>
