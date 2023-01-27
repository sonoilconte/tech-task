<template>
  <div>
    <div v-if="selectedChannel">
      <SfHeading
        :level="3"
        :title="$t('Selected store')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <StoreComponent
        v-bind="selectedPlace"
        :button-text="$t('Change store')"
        class="selected-store"
        @click="toggleStoreLocatorModal"
      />
      <template v-if="hasUnavailableProducts">
        <SfHeading
          :level="3"
          :title="$t('Unavailable products')"
          class="sf-heading--left sf-heading--no-underline title"
          :description="`${$t('Products below are not available at the selected store')}. ${$t('Please lower their quantity or remove them from the cart')}.`"
        />
        <SfButton
          v-if="unavailableProductsIsGreaterThan(2)"
          @click="removeUnavailableProducts"
          class="sf-button--text remove"
        >
          {{ $t('Remove all unavailable products') }}
        </SfButton>
        <div class="form__element">
          <SfLoader :class="{ loader: hasLoader }" :loading="hasLoader">
            <CartProducts :products="unavailableProducts" />
          </SfLoader>
        </div>
      </template>
      <template v-if="!totalItems">
        <SfHeading
          :title="$t('Your cart is empty')"
          :level="3"
          :description="
            $t(
              `Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.`
            )
          "
          class="sf-heading--left sf-heading--no-underline title"
        />
      </template>
    </div>
    <div v-else>
      <SfHeading
        :level="3"
        :title="$t('Choose store')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <p>
        {{
          $t(
            'Please select a store from which you want to pick up your products'
          )
        }}:
      </p>
      <SfButton
        class="form__action-button form__element"
        type="button"
        @click="toggleStoreLocatorModal"
      >
        {{ $t('Open store selector') }}
      </SfButton>
    </div>
    <hr class="sf-divider" v-if="unavailableProductsIsGreaterThan(0)" />
  </div>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api';
import {
  cartGetters,
  useCart,
  useChannel,
  useInventory
} from '@vsf-enterprise/commercetools';
import { SfHeading, SfButton, SfLoader } from '@storefront-ui/vue';
import { useUiState, usePlaces } from '~/composables';
import StoreComponent from '~/components/StoreComponent.vue';
import CartProducts from '~/components/CartProducts';

export default {
  name: 'UserShippingCollect',
  components: {
    SfHeading,
    SfButton,
    SfLoader,
    CartProducts,
    StoreComponent
  },
  setup() {
    const { toggleStoreLocatorModal } = useUiState();
    const { cart, removeItem } = useCart();
    const { channel: selectedChannel } = useChannel();
    const { inventory, loading: inventoryLoading } = useInventory('shipping');
    const { selectedPlace } = usePlaces();
    const cartLoading = ref(false);
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const unavailableProducts = computed(() =>
      cartGetters.getUnavailableProducts(cart.value, inventory.value)
    );
    const hasLoader = computed(() => cartLoading.value || inventoryLoading.value);
    const hasUnavailableProducts = computed(
      () => unavailableProducts.value.length > 0
    );

    const unavailableProductsIsGreaterThan = value => unavailableProducts.value?.length > value;
    const removeUnavailableProducts = async () => {
      cartLoading.value = true;
      for (const product of unavailableProducts.value) {
        await removeItem({ product });
      }
      cartLoading.value = false;
    };

    return {
      selectedChannel,
      unavailableProducts,
      toggleStoreLocatorModal,
      totalItems,
      selectedPlace,
      hasUnavailableProducts,
      removeUnavailableProducts,
      unavailableProductsIsGreaterThan,
      hasLoader
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-sm) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
.form__action-button {
  margin-bottom: var(--spacer-base);

  @include for-mobile {
    width: 100%;
  }
}
.selected-store {
  padding: 0 0 var(--spacer-base);
}
::v-deep {
  .sf-collected-product {
    --collected-product-width: 100%;
  }
  .sf-collected-product__actions {
    display: none;
  }
}
.remove {
  text-align: end;
  font-size: var(--font-size-xl);
  cursor: pointer;
}
.loader {
  min-height: 200px;
}
</style>
