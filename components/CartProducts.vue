<template>
  <div>
    <ProductLoader
      v-for="(product, index) in products"
      :key="`${cartGetters.getItemSku(product)}${index}`"
      :loading="isProductLoading(product.id)"
    >
      <SfCollectedProduct
        class="collected-product"
        v-e2e="'collected-product'"
        :image="cartGetters.getItemImage(product) | addBasePathFilter"
        :title="cartGetters.getItemName(product)"
        :regular-price="productPriceTransform(product).regular"
        :special-price="productPriceTransform(product).special"
        :stock="99999"
        :link="localePath(`/p/${product.productSlug}/${product.variant.sku}`)"
        :has-more-actions="false"
        @click:remove="removeFromCart({ product })"
      >
        <template #configuration>
          <div class="collected-product__properties">
            <SfProperty
              v-for="(attribute, key) in cartGetters.getItemAttributes(product, [
                'color',
                'size'
              ])"
              :key="key"
              :name="$t(key)"
              :value="$t(attribute)"
            />
          </div>
        </template>
        <template #input>
          <div class="sf-collected-product__quantity-wrapper">
            <SfQuantitySelector
              :disabled="loading"
              :max="getAvalableQuantity(product)"
              :qty="cartGetters.getItemQty(product)"
              class="sf-collected-product__quantity-selector"
              @input="updateQuantity({ product, quantity: Number($event) })"
            />
          </div>
        </template>
        <template #actions>&nbsp;</template>
      </SfCollectedProduct>
    </ProductLoader>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { useContext } from '@nuxtjs/composition-api';
import {
  SfCollectedProduct,
  SfQuantitySelector,
  SfImage,
  SfProperty
} from '@storefront-ui/vue';
import {
  useCart,
  useInventory,
  cartGetters,
  productPriceTransform
} from '@vsf-enterprise/commercetools';
import { useUiNotification, useProductLoading } from '~/composables';
import ProductLoader from '~/components/ProductLoader';

export default {
  name: 'CartProducts',
  components: {
    ProductLoader,
    SfCollectedProduct,
    SfQuantitySelector,
    SfImage,
    SfProperty
  },
  props: {
    products: {
      type: Array,
      default: []
    }
  },
  setup() {
    const {
      app: { i18n }
    } = useContext();
    const {
      removeItem,
      updateItemQty,
      loading,
      error: cartError
    } = useCart();
    const { send } = useUiNotification();
    const { setProductLoading, isProductLoading } = useProductLoading();
    const { inventory } = useInventory('cart');

    const getAvalableQuantity = (product) => {
      return inventory.value.find((item) => item.sku === cartGetters.getItemSku(product))?.availableQuantity;
    };

    const removeFromCart = async ({ product }) => {
      setProductLoading(product.id);
      await removeItem({ product });
      setProductLoading();
      if (!cartError.value.removeItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been removed from the cart.')
        });
      }
    };
    const updateQuantity = debounce(async ({ product, quantity }) => {
      setProductLoading(product.id);
      await updateItemQty({ product, quantity });
      setProductLoading();
      if (!cartError.value.updateItemQty) {
        send({
          type: 'success',
          message: i18n.t('Product quantity has been updated.')
        });
      }
    }, 500);

    return {
      loading,
      removeFromCart,
      updateQuantity,
      productPriceTransform,
      cartGetters,
      isProductLoading,
      getAvalableQuantity
    };
  }
};
</script>

<style lang="scss" scoped>
.collected-product {
  margin: var(--spacer-base) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
  }
  &__save,
  &__compare {
    --button-padding: 0;
    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }
  &__save {
    opacity: var(--cp-save-opacity, 0);
  }
  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }
  &-list {
    flex: 1;
  }
  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
}
</style>
