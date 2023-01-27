<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem class="carousel__item" v-for="product in products" :key="product.sku">
          <ProductCard :product="product" />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script>
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { computed, useContext } from '@nuxtjs/composition-api';
import { useCart,
  useWishlist,
  wishlistGetters,
  productGetters,
  productPriceTransform
} from '@vsf-enterprise/commercetools';
import { useUiNotification } from '~/composables';
import ProductCard from '~/components/ProductCard';

export default {
  name: 'RelatedProducts',
  setup() {
    const { app: { i18n } } = useContext();
    const { addItem: addItemToCart, isInCart, error: cartError } = useCart();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist, error: wishlistError } = useWishlist();
    const { send } = useUiNotification();

    const addProductToWishlist = async (product) => {
      await addItemToWishlist({ product });

      if (!wishlistError.value.addItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been added to the wishlist.')
        });
      }
    };

    const removeProductFromWishlist = async (productItem) => {
      const productsInWhishlist = computed(() => wishlistGetters.getItems(wishlist.value));
      const product = productsInWhishlist.value.find(wishlistProduct => wishlistProduct.variant.sku === productItem.sku);
      await removeItemFromWishlist({ product });

      if (!wishlistError.value.removeItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been removed from the wishlist.')
        });
      }
    };

    const wishlistAction = (product) => !isInWishlist({ product }) ? addProductToWishlist(product) : removeProductFromWishlist(product);

    const addToCart = async ({ product: { id, sku }, quantity }) => {
      await addItemToCart({
        product: { id, sku },
        quantity
      });

      if (!cartError.value.addItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been added to the cart.')
        });
      }
    };

    return {
      productGetters,
      isInWishlist,
      wishlistAction,
      addToCart,
      isInCart,
      productPriceTransform
    };
  },
  components: {
    ProductCard,
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
    margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}

</style>
