<template>
  <SfMegaMenu
    :visible="isSearchOpen"
    :title="$t('Search results')"
    class="search"
  >
    <SfLoader :loading="loading">
      <div v-if="hasProductsFound" class="search__wrapper-results" key="results">
        <SfMegaMenuColumn
          :title="$t('Categories')"
          class="sf-mega-menu-column--pined-content-on-mobile search__categories"
        >
          <template #title="{title}">
            <SfMenuItem :label="title">
              <template #mobile-nav-icon>
                &#8203;
              </template>
            </SfMenuItem>
          </template>
          <SfList>
            <SfListItem v-for="(category, key) in categories.items" :key="key">
              <SfMenuItem :label="category.label" :link="localePath(`/c/${category.slug}`)">
                <template #mobile-nav-icon>
                  &#8203;
                </template>
              </SfMenuItem>
            </SfListItem>
          </SfList>
        </SfMegaMenuColumn>
        <SfMegaMenuColumn
          :title="$t('Product suggestions')"
          class="sf-mega-menu-column--pined-content-on-mobile search__results"
        >
          <template #title="{title}">
            <SfMenuItem :label="title" class="sf-mega-menu-column__header search__header">
              <template #mobile-nav-icon>
                &#8203;
              </template>
            </SfMenuItem>
          </template>
          <SfScrollable class="results--desktop desktop-only" show-text="" hide-text="">
            <div class="results-listing">
              <ProductCard
                v-for="product in products"
                :key="product._slug"
                :product="product"
                class="result-card"
                :nuxt-img-config="{
                  format: 'webp',
                  fit: 'fill'
                }"
              />
            </div>
          </SfScrollable>
          <div class="results--mobile smartphone-only">
            <ProductCard
              v-for="product in products"
              :key="product._slug"
              :product="product"
              class="result-card"
              :image-width="216"
              :image-height="190"
              :nuxt-img-config="{
                format: 'webp',
                fit: 'fill'
              }"
            />
          </div>
        </SfMegaMenuColumn>
        <div class="action-buttons smartphone-only">
          <SfButton
            class="action-buttons__button color-light"
            @click="$emit('close')"
          >
            {{ $t('Cancel') }}
          </SfButton>
        </div>
      </div>
      <div v-else class="before-results" key="no-results">
        <nuxt-img
          :src="'/error/error.svg' | addBasePathFilter"
          :height="230"
          :width="230"
          class="before-results__picture"
          alt="error"
          loading="lazy"
          provider="static"
        />
        <p v-if="hasNoResults" class="before-results__paragraph"> {{ $t('No products found.') }}</p>
        <template v-else>
          <p class="before-results__paragraph">{{ $t('You haven’t searched for items yet') }}</p>
          <p class="before-results__paragraph">{{ $t('Let’s start now – we’ll help you') }}</p>
        </template>
        <SfButton
          class="before-results__button color-secondary smartphone-only"
          @click="$emit('close')"
        >
          {{ $t('Go back') }}
        </SfButton>
      </div>
    </SfLoader>
  </SfMegaMenu>
</template>
<script>
import {
  SfMegaMenu,
  SfList,
  SfProductCard,
  SfScrollable,
  SfMenuItem,
  SfButton,
  SfLoader
} from '@storefront-ui/vue';
import { watch, computed, useContext } from '@nuxtjs/composition-api';
import {
  productGetters,
  facetGetters,
  productPriceTransform,
  useWishlist,
  wishlistGetters,
  useCart,
  useFacet
} from '@vsf-enterprise/commercetools';
import { useUiNotification, useUiState } from '~/composables';
import ProductCard from '~/components/ProductCard';

export default {
  name: 'SearchResults',
  components: {
    ProductCard,
    SfMegaMenu,
    SfList,
    SfProductCard,
    SfScrollable,
    SfMenuItem,
    SfButton,
    SfLoader
  },
  setup() {
    const { app: { i18n } } = useContext();
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist,
      wishlist,
      error: wishlistError
    } = useWishlist();
    const { isInCart, addItem: addItemToCart, error: cartError } = useCart();
    const { result, loading } = useFacet('search');
    const { send } = useUiNotification();
    const { isSearchOpen } = useUiState();
    const products = computed(() => facetGetters.getProducts(result.value));
    const categories = computed(() => facetGetters.getCategoryTree(result.value));

    watch(isSearchOpen, () => {
      if (isSearchOpen.value) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    });

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

    const addToCart = async ({ product, quantity }) => {
      const { id, sku } = product;
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

    const hasProductsFound = computed(() => products.value?.length > 0);
    const hasNoResults = computed(() => products.value.length === 0 && result.value.input?.phrase.length > 0);

    return {
      isSearchOpen,
      productGetters,
      products,
      hasProductsFound,
      hasNoResults,
      categories,
      productPriceTransform,
      isInWishlist,
      isInCart,
      wishlistAction,
      addToCart,
      loading
    };
  }
};
</script>
<style lang="scss" scoped>
.search {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  --mega-menu-column-header-margin: var(--spacer-sm) 0 var(--spacer-xl);
  --mega-menu-content-padding: 0;
  --mega-menu-height: auto;
  @include for-desktop {
    --mega-menu-content-padding: var(--spacer-xl) 0;
  }
  &__wrapper-results {
    display: flex;
    flex-direction: column;
    @include for-desktop {
      flex-direction: row;
      flex: 1;
    }
  }
  &__categories {
    @include for-desktop {
      flex: 0 0 220px;
    }
    & > .sf-button {
      display: none;
      @include for-desktop {
        display: flex;
        text-transform: uppercase;
        margin: var(--spacer-sm) 0 var(--spacer-xl);
        pointer-events: none;
      }
    }
  }
  &__results {
    flex: 1
  }
  &__header {
    margin-left: var(--spacer-sm);
    pointer-events: none;
  }
  ::v-deep .sf-bar {
    display: none;
  }
  ::v-deep .sf-mega-menu-column__header {
    display: none;
    @include for-desktop {
      display: flex;
    }
  }
  ::v-deep .sf-mega-menu__content {
    align-items: stretch;
    min-height: 595px;
    @include for-desktop {
      min-height: 530px;
    }
  }
  ::v-deep .sf-mega-menu__menu {
    @include for-mobile {
      justify-content: center;
    }
  }
  ::v-deep .sf-loader {
    display: flex;
    align-items: center;
  }
}
.results {
  &--desktop {
    --scrollable-max-height: 35vh;
  }
  &--mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background: var(--c-white);
    padding: var(--spacer-base) var(--spacer-sm);
    --product-card-max-width: 9rem;
  }
}
.see-all {
  padding: var(--spacer-xl) 0 0 var(--spacer-sm);
}
.action-buttons {
  padding: var(--spacer-xl) var(--spacer-sm) var(--spacer-3xl);
  background: var(--c-white);
  width: 100%;
  &__button {
    width: calc(100% - 32px);
  }
}
.results-listing {
  display: flex;
  flex-wrap: wrap;
  margin-left: var(--spacer-2xs);
}
.result-card {
  margin: var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-2xs) 0;
  }
}

.before-results {
  box-sizing: border-box;
  padding: var(--spacer-base) var(--spacer-sm) var(--spacer-2xl);
  width: 100%;
  text-align: center;
  @include for-desktop {
    padding: 0;
  }
  &__picture {
    --image-width: 230px;
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      --image-width: 18.75rem;
      margin-top: var(--spacer-base);
    }
  }
  &__paragraph {
    font-family: var(--font-family--primary);
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--base);
    color: var(--c-text-muted);
    margin: 0;
    @include for-desktop {
      font-size: var(--font-size--lg);
    }
    &:first-of-type {
      margin: var(--spacer-xl) auto var(--spacer-xs);
    }
  }
  &__button {
    margin: var(--spacer-xl) auto 0 auto;
    width: 100%;
  }
}
</style>
