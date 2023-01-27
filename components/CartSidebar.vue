<template>
  <div id="cart">
    <SfSidebar
      class="sf-sidebar--right"
      v-e2e="'sidebar-cart'"
      :visible="isCartSidebarOpen"
      :title="$t('My Cart')"
      @close="toggleCartSidebar"
      :persistent="hasNotifications"
      position="right"
    >
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="my-cart__total-items"><span>{{ $t('Total items') }}:</span> <strong>{{ totalItems }}</strong></div>
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <CartProducts :products="products" key="cart-products"/>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <nuxt-img
              :alt="$t('Empty bag')"
              class="empty-cart__image"
              :src="'/icons/empty-cart.svg' | addBasePathFilter"
              :height="173"
              :width="256"
              provider="static"
            />
            <SfHeading
              :title="$t('Your cart is empty')"
              :level="2"
              :description="$t(`Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.`)"
              class="empty-cart__heading"
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <SfProperty
              :name="$t('Subtotal price')"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <SfPrice
                  :regular="getTotalPrice(totals.subtotal)"
                  :special="(totals.special !== totals.subtotal) ? getTotalPrice(totals.special) : 0"
                />
              </template>
            </SfProperty>
            <SfButton
              v-if="canClearCart"
              class="sf-button--text sf-button--full-width clear-cart"
              @click="handleClear"
            >
              {{ $t('Clear cart') }}
            </SfButton>
            <nuxt-link :to="goToCheckoutPath">
              <SfButton
                class="sf-button--full-width color-secondary"
                @click="toggleCartSidebar"
              >
                {{ $t('Go to checkout') }}
              </SfButton>
            </nuxt-link>
          </div>
          <div v-else>
            <SfButton
              class="sf-button--full-width color-primary"
              @click="toggleCartSidebar"
            >
              {{ $t('Go back shopping') }}
            </SfButton>
          </div>
        </transition>
      </template>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfQuantitySelector
} from '@storefront-ui/vue';
import { computed, useContext, useRoute, watch } from '@nuxtjs/composition-api';
import {
  useCart,
  useInventory,
  useChannel,
  cartGetters,
  priceTransform,
  productPriceTransform
} from '@vsf-enterprise/commercetools';
import { useUiState, useUiNotification } from '~/composables';
import CartProducts from '~/components/CartProducts.vue';

export default {
  name: 'Cart',
  components: {
    CartProducts,
    SfSidebar,
    SfButton,
    SfHeading,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfQuantitySelector
  },
  setup() {
    const { app: { localePath, i18n } } = useContext();
    const route = useRoute();
    const { isCartSidebarOpen, toggleCartSidebar, closeCartSidebar } = useUiState();
    const { cart, clear } = useCart();
    const { channel: selectedChannel } = useChannel();
    const { search: searchInventory } = useInventory('cart');
    const { notifications, hasNotifications, send } = useUiNotification();
    const products = computed(() => cartGetters.getItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const goToCheckoutPath = computed(() => localePath({ name: 'checkout' }));
    const canClearCart = computed(() => cart.value?.lineItems.length > 2);

    const getTotalPrice = (value) => {
      return priceTransform(value, cart.value.totalPrice.currencyCode);
    };
    const handleClear = () => {
      send({
        type: 'info',
        message: i18n.t('Do you want to remove all products from cart?'),
        action: {
          text: i18n.t('Yes'),
          onClick: async () => {
            await clear();
          }
        },
        persist: true
      });
    };

    watch(products, async () => {
      await searchInventory({
        sku: products.value.map(product => product.variant.sku),
        supplyChannel: selectedChannel.value
      });
    });

    watch(
      () => route.value.fullPath,
      () => {
        closeCartSidebar();
      }
    );

    return {
      cart,
      handleClear,
      products,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      cartGetters,
      productPriceTransform,
      getTotalPrice,
      notifications,
      hasNotifications,
      goToCheckoutPath,
      canClearCart
    };
  }
};
</script>

<style lang="scss" scoped>
#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
.cart-summary {
  margin-top: var(--spacer-xl);
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font: var(--font-weight--normal) var(--font-size--lg) / 1.6 var(--font-family--secondary);
    color: var(--c-link);
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
    ::v-deep .sf-heading__description {
      color: var(--_c-dark-secondary);
    }
  }
  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
  .clear-cart {
    margin-bottom: var(--spacer-base);
    font-size: var(--font-size-xl);
  }
</style>
