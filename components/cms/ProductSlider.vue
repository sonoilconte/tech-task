<template>
  <SfCarousel v-if="list.length" class="product-carousel">
    <SfCarouselItem v-for="(product, i) in list" :key="i">
      <SfProductCard
        class="product-card"
        data-cy="home-url_product"
        :title="productGetters.getName(product)"
        :image="product.images[0].url"
        :regular-price="
          $n(
            productGetters.getFormattedPrice(
              productGetters.getPrice(product).regular,
            ),
            'currency',
          )
        "
        :special-price="
          productGetters.getPrice(product).special &&
          $n(productGetters.getPrice(product).special, 'currency')
        "
        :max-rating="5"
        :score-rating="3.5"
        :show-add-to-cart-button="true"
        :is-in-wishlist="isInWishlist({ product })"
        :link="
          localePath(
            `/p/${productGetters.getId(product)}/${productGetters.getSlug(
              product,
            )}`,
          )
        "
        @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
        @click:wishlist="
          !isInWishlist({ product })
            ? addItemToWishlist({ product })
            : removeItemFromWishlist(product)
        "
        :is-added-to-cart="isInCart({ product })"
      />
    </SfCarouselItem>
  </SfCarousel>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfCarousel, SfProductCard } from '@storefront-ui/vue'
import {
  productGetters,
  useProduct,
  useCart,
  useWishlist,
  wishlistGetters,
} from '@vsf-enterprise/commercetools'
import { computed } from '@nuxtjs/composition-api'
import { onSSR } from '@vue-storefront/core';

export default Vue.extend({
  name: 'ProductSlider',
  components: {
    SfCarousel,
    SfProductCard,
  },
  props: {
    items: {
      type: [Array, Object],
      default: () => [],
    },
  },
  setup({ items: { items } }: { items: { items: any[] } }) {
    const ids = items.map((item) => item.id)
    const { addItem: addItemToCart, isInCart } = useCart()
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem,
      wishlist,
    } = useWishlist()
    const { search, products } = useProduct(ids.join(''))

    const masterProducts = computed(() =>
      productGetters.getFiltered(products.value, { master: true }),
    )

    const removeItemFromWishlist = (productItem) => {
      const wishlistItems = wishlistGetters.getItems(wishlist.value)
      const product = wishlistItems.find(
        (wishlistItem) => wishlistItem.variant.sku === productItem.sku,
      )
      removeItem({ product })
    }

    onSSR(async () => {
      await search({ ids })
    })

    return {
      list: masterProducts,
      productGetters,
      addItemToCart,
      isInCart,
      addItemToWishlist,
      removeItemFromWishlist,
      isInWishlist,
    }
  },
})
</script>