<template>
  <ProductLoader :loading="isProductLoading(product.sku)">
    <SfProductCard
      v-if="!isHorizontal"
      :title="productGetters.getName(product)"
      :image="productGetters.getCoverImage(product) | addBasePathFilter"
      :regular-price="productPriceTransform(product).regular"
      :special-price="productPriceTransform(product).special"
      :max-rating="5"
      :score-rating="productGetters.getAverageRating(product)"
      :show-add-to-cart-button="true"
      :is-in-wishlist="isInWishlist({ product })"
      :is-added-to-cart="isInCart({ product })"
      image-tag="nuxt-img"
      :nuxt-img-config="nuxtImgConfig"
      :image-width="imageWidth || 216"
      :image-height="imageHeight || 290"
      :link="localePath(`/p/${productGetters.getSlug(product)}/${productGetters.getSku(product)}`)"
      @click:wishlist="wishlistAction(product)"
      @click:add-to-cart="addToCart({ product, quantity: 1 })"
    />
    <SfProductCardHorizontal
      v-else
      :title="productGetters.getName(product)"
      :description="productGetters.getDescription(product)"
      :image="productGetters.getCoverImage(product) | addBasePathFilter"
      :regular-price="productPriceTransform(product).regular"
      :special-price="productPriceTransform(product).special"
      :max-rating="5"
      :score-rating="3"
      :is-in-wishlist="isInWishlist({ product })"
      :is-added-to-cart="isInCart({ product })"
      :qty="1"
      image-tag="nuxt-img"
      :nuxt-img-config="nuxtImgConfig"
      :image-width="imageWidth || 140"
      :image-height="imageHeight || 200"
      :wishlist-icon="false"
      @input="productsQuantity[product._id] = $event"
      @click:wishlist="wishlistAction(product)"
      :link="localePath(`/p/${productGetters.getSlug(product)}/${productGetters.getSku(product)}`)"
    >
      <template #add-to-cart>
        <SfAddToCart
          v-model="productsQuantity[product._id]"
          class="sf-product-card-horizontal__add-to-cart desktop-only"
        >
          <template #add-to-cart-btn>
            <SfButton
              @click="addToCart({ product, quantity: Number(productsQuantity[product._id]) })"
            >
              {{ $t('Add to cart') }}
            </SfButton>
          </template>
        </SfAddToCart>
      </template>
      <template #configuration>
        <SfProperty
          class="desktop-only"
          :name="$t('Size')"
          value="XS"
          style="margin: 0 0 1rem 0;"
        />
        <SfProperty
          class="desktop-only"
          :name="$t('Color')"
          :value="$t('white')"
        />
      </template>
      <template #actions>
        <SfButton
          class="sf-button--text"
          :aria-label="$t('Add to wishlist')"
          @click="wishlistAction(product)"
        >
          <SfIcon
            :icon="getWishlistIcon(product)"
            size="19px"
            data-test="sf-wishlist-icon"
          />
        </SfButton>
      </template>
    </SfProductCardHorizontal>
  </ProductLoader>
</template>

<script>
import {
  SfButton,
  SfIcon,
  SfProductCard,
  SfProductCardHorizontal,
  SfProperty,
  SfAddToCart
} from '@storefront-ui/vue';
import {
  useCart,
  useWishlist,
  wishlistGetters,
  productGetters,
  productPriceTransform
} from '@vsf-enterprise/commercetools';
import { computed, ref, useContext } from '@nuxtjs/composition-api';
import { useUiNotification, useProductLoading } from '~/composables';
import ProductLoader from '~/components/ProductLoader';

// TODO(addToCart qty, horizontal): https://github.com/vuestorefront/storefront-ui/issues/1606
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    isHorizontal: {
      type: Boolean,
      default: false
    },
    imageWidth: {
      type: [Number, String],
      default: null
    },
    imageHeight: {
      type: [Number, String],
      default: null
    },
    nuxtImgConfig: {
      type: Object,
      default: () => ({
        format: 'webp',
        fit: 'cover'
      })
    }
  },
  components: {
    ProductLoader,
    SfAddToCart,
    SfButton,
    SfIcon,
    SfProductCard,
    SfProductCardHorizontal,
    SfProperty
  },
  setup() {
    const { app: { i18n } } = useContext();
    const {
      addItem: addItemToCart,
      isInCart,
      error: cartError
    } = useCart();
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist,
      wishlist,
      error: wishlistError
    } = useWishlist();
    const { send } = useUiNotification();
    const { setProductLoading, isProductLoading } = useProductLoading();
    const productsQuantity = ref({});

    const addToCart = async ({ product, quantity }) => {
      const { id, sku } = product;
      setProductLoading(sku);
      await addItemToCart({
        product: { id, sku },
        quantity
      });
      setProductLoading();
      if (!cartError.value.addItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been added to the cart.')
        });
      }
    };
    const removeProductFromWishlist = async (productItem) => {
      const productsInWhishlist = computed(() => wishlistGetters.getItems(wishlist.value));
      const product = productsInWhishlist.value.find(wishlistProduct => wishlistProduct.variant.sku === productItem.sku);

      setProductLoading(productItem.sku);
      await removeItemFromWishlist({ product });
      setProductLoading();

      if (!wishlistError.value.removeItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been removed from the wishlist.')
        });
      }
    };
    const addProductToWishlist = async (product) => {
      setProductLoading(product.sku);
      await addItemToWishlist({ product });
      setProductLoading();

      if (!wishlistError.value.addItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been added to the wishlist.')
        });
      }
    };
    const wishlistAction = (product) => !isInWishlist({ product }) ? addProductToWishlist(product) : removeProductFromWishlist(product);
    const getWishlistIcon = (product) => isInWishlist({ product }) ? 'heart_fill' : 'heart';

    return {
      addToCart,
      isInCart,
      isInWishlist,
      getWishlistIcon,
      productGetters,
      productPriceTransform,
      wishlistAction,
      productsQuantity,
      isProductLoading
    };
  }
};
</script>
