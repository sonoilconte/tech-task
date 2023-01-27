<template>
  <div id="wishlist">
    <SfSidebar
      class="sidebar sf-sidebar--right"
      v-e2e="'sidebar-wishlist'"
      :visible="isWishlistSidebarOpen"
      :title="$t('My wishlist')"
      @close="toggleWishlistSidebar"
      :persistent="hasNotifications"
      position="right"
    >
      <transition name="fade" mode="out-in">
        <div v-if="totalItems" class="my-wishlist" key="my-wishlist">
          <div class="my-wishlist__total-items">
            <span>{{ $t('Total items') }}:</span>
            <strong>{{ totalItems }}</strong>
          </div>
          <div class="collected-product-list">
            <transition-group name="fade" tag="div">
              <ProductLoader
                v-for="product in products"
                :key="wishlistGetters.getItemSku(product)"
                :loading="isProductLoading(product.id)"
              >
                <SfCollectedProduct
                  v-e2e="'collected-product'"
                  :key="wishlistGetters.getItemSku(product)"
                  :image="wishlistGetters.getItemImage(product) | addBasePathFilter"
                  :title="wishlistGetters.getItemName(product)"
                  :regular-price="productPriceTransform(product.variant).regular"
                  :special-price="productPriceTransform(product.variant).special"
                  :link="localePath(`/p/${product.productSlug}/${product.variant.sku}`)"
                  :stock="99999"
                  :has-more-actions="false"
                  image-width="180"
                  image-height="200"
                  @click:remove="removeFromWishlist({ product }) "
                  class="collected-product"
                >
                  <template #configuration>
                    <div class="collected-product__properties">
                      <SfProperty
                        v-for="(attribute, key) in wishlistGetters.getItemAttributes(product, ['color', 'size'])"
                        :key="key"
                        :name="key"
                        :value="attribute"
                      />
                    </div>
                  </template>
                  <template #input="{}">&nbsp;</template>
                  <template #actions="{}">&nbsp;</template>
                </SfCollectedProduct>
              </ProductLoader>
            </transition-group>
          </div>
        </div>
        <div v-else class="empty-wishlist" key="empty-wishlist">
          <div class="empty-wishlist__banner">
            <nuxt-img
              :src="'/icons/empty-cart.svg' | addBasePathFilter"
              :height="173"
              :width="256"
              alt="Empty bag"
              class="empty-wishlist__icon"
              provider="static"
            />
            <SfHeading
              :title="$t('Your wishlist is empty')"
              :description="$t('Looks like you haven’t added any items to the wishlist yet. Start browsing to fill it in.')"
              class="empty-wishlist__label"
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <SfButton
          v-if="canClearWishlist"
          class="sf-button--text sf-button--full-width clear-wishlist"
          @click="handleClear"
        >
          {{ $t('Clear wishlist') }}
        </SfButton>
        <SfButton
          @click="toggleWishlistSidebar"
          class="sf-button--full-width color-secondary"
        >
          {{ $t('Start browsing') }}
        </SfButton>
      </template>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfProperty,
  SfPrice,
  SfCollectedProduct
} from '@storefront-ui/vue';
import { computed, watch, useContext, useRoute } from '@nuxtjs/composition-api';
import {
  useWishlist,
  useUser,
  wishlistGetters,
  productPriceTransform,
  priceTransform
} from '@vsf-enterprise/commercetools';
import { useUiState, useUiNotification, useProductLoading } from '~/composables';
import ProductLoader from '~/components/ProductLoader';

export default {
  name: 'Wishlist',
  components: {
    ProductLoader,
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfProperty,
    SfPrice,
    SfCollectedProduct
  },
  setup() {
    const { app: { i18n } } = useContext();
    const route = useRoute();
    const { isWishlistSidebarOpen, toggleWishlistSidebar, closeWishlistSidebar } = useUiState();
    const { send, notifications, hasNotifications } = useUiNotification();
    const { wishlist, removeItem, error: wishlistError, clear } = useWishlist();
    const { isAuthenticated } = useUser();
    const { setProductLoading, isProductLoading } = useProductLoading();
    const products = computed(() => wishlistGetters.getItems(wishlist.value));
    const totals = computed(() => wishlistGetters.getTotals(wishlist.value));
    const totalItems = computed(() => wishlistGetters.getTotalItems(wishlist.value));

    const getWishlistPrice = (price) => {
      return priceTransform(price, wishlist.value?.lineItems[0]?.variant?.price?.value.currencyCode || null);
    };
    const canClearWishlist = computed(() => totalItems.value > 2);

    const removeFromWishlist = async ({ product }) => {
      setProductLoading(product.id);
      await removeItem({ product });
      setProductLoading();

      if (!wishlistError.value.removeItem) {
        send({ type: 'success', message: i18n.t('Product has been removed from the wishlist.') });
      }
    };
    const handleClear = () => {
      send({
        type: 'info',
        message: i18n.t('Do you want to remove all products from wishlist?'),
        action: {
          text: i18n.t('Yes'),
          onClick: async () => {
            await clear();
          }
        },
        persist: true
      });
    };

    watch(
      () => route.value.fullPath,
      () => {
        closeWishlistSidebar();
      }
    );

    return {
      isAuthenticated,
      products,
      removeFromWishlist,
      isWishlistSidebarOpen,
      toggleWishlistSidebar,
      totals,
      totalItems,
      wishlistGetters,
      productPriceTransform,
      getWishlistPrice,
      notifications,
      hasNotifications,
      canClearWishlist,
      handleClear,
      isProductLoading
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  --sidebar-content-padding: var(--spacer-lg) var(--spacer-base);
}

.my-wishlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font: var(--font-weight--normal) var(--font-size--lg) / 1.6 var(--font-family--secondary);
    color: var(--c-link);
    margin: 0;
  }
  &__total-price {
    --property-name-font-size: var(--font-size--xl);
    --price-font-size: var(--font-size--xl);
    margin: 0 0 var(--spacer-xl) 0;
    &-label {
      font: var(--font-weight--normal) var(--font-size--2xl) / 1.6 var(--font-family--secondary);
      color: var(--c-link);
    }
  }
}
.empty-wishlist {
  display: flex;
  flex: 1;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &__label,
  &__description {
    text-align: center;
  }
  &__label {
    --heading-description-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-color: var(--c-primary);
    --heading-title-font-weight: var(--font-weight--semibold);
    @include for-desktop {
      --heading-title-font-size: var(--font-size--xl);
      --heading-title-margin: 0 0 var(--spacer-sm) 0;
    }
    ::v-deep .sf-heading__description {
      color: var(--_c-dark-secondary);
    }
  }
  &__icon {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
}
.heading {
  &__wrapper {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    display: flex;
    justify-content: space-between;
  }
}

.sidebar-bottom {
  margin: auto 0 0 0;
}

.collected-product {
  margin: var(--spacer-base) 0;
  &__properties {
    margin: var(--spacer-sm) 0 0 0;
  }
}

.clear-wishlist {
  margin-bottom: var(--spacer-base);
  font-size: var(--font-size-xl);
}

</style>
