<template>
  <div class="cart">
    <SfLoader
      class="cart__loader"
      :loading="isLoading"
    >
      <div v-if="totalItems" class="cart__products">
        <SfHeading
          :level="3"
          :title="$t('My Cart')"
          class="cart__heading"
        />
        <div class="cart__total-items">
          <span>{{ $t('Total items') }}:</span>
          <strong>{{ totalItems }}</strong>
        </div>
        <div class="collected-product-list">
          <CartProducts :products="products" />
        </div>
        <SfButton
          class="cart__button"
          :link="localePath('checkout')"
        >
          {{ $t('Go to checkout') }}
        </SfButton>
      </div>
      <div v-else class="cart__empty">
        <nuxt-img
          :alt="$t('Empty bag')"
          class="cart__empty-image"
          :src="'/icons/empty-cart.svg' | addBasePathFilter"
          :height="173"
          :width="256"
          provider="static"
        />
        <SfHeading
          :title="$t('Your cart is empty')"
          :level="2"
          :description="$t(`Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.`)"
        />
        <SfButton
          :link="localePath('home')"
          class="cart__button"
        >
          {{ $t('Go back shopping') }}
        </SfButton>
      </div>
    </SfLoader>
  </div>
</template>

<script>

import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api';
import { cartGetters, useCart, useUser } from '@vsf-enterprise/commercetools';
import {
  SfHeading,
  SfLoader,
  SfButton
} from '@storefront-ui/vue';
import CartProducts from '~/components/CartProducts.vue';

export default {
  name: 'Cart',
  components: {
    CartProducts,
    SfHeading,
    SfLoader,
    SfButton
  },
  setup() {
    const { cart } = useCart();
    const { loading } = useUser();
    const isLoading = ref(true);
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const products = computed(() => cartGetters.getItems(cart.value));

    onMounted(() => {
      watch(loading, (value) => {
        isLoading.value = value;
      }, { immediate: true });
    });

    return {
      isLoading,
      totalItems,
      products,
      cart
    };
  }
};
</script>

<style lang="scss" scoped>
.cart {
  min-height: 60vh;
  display: flex;
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  &__loader {
    height: auto;
    display: flex;
  }
  &__heading {
    text-align: left;
    margin-bottom: var(--spacer-xl);
  }
  &__products {
    width: 100%;
    padding: var(--spacer-sm) 0;
  }
  &__button {
    margin: var(--spacer-xl) 0 0 0;
    padding: var(--spacer-sm) var(--spacer-base);
    width: 100%;
    display: inline-block;
    text-align: center;
    @include for-desktop {
      width: auto;
      box-sizing: content-box;
    }
    &:hover {
      color: var(--c-light-variant);
    }
  }
  &__empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    &-image {
      margin: 0 0 var(--spacer-2xl) 7.5rem;
    }
  }
}
</style>
