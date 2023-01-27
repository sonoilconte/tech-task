<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <LazyHydrate never>
          <SfHeading
            :level="3"
            :title="$t('Categories')"
            class="navbar__title"
          />
        </LazyHydrate>
      </div>
      <CategoryPageHeader
        :pagination="pagination"
        :sorting="sorting"
      />
    </div>
    <div class="main section">
      <div class="sidebar desktop-only">
        <LazyHydrate when-idle>
          <SfLoader
            :class="{ 'loading--categories': loading }"
            :loading="loading"
          >
            <SfAccordion
              v-e2e="'categories-accordion'"
              :open="activeCategory"
              :show-chevron="true"
            >
              <SfAccordionItem
                v-for="cat in categoryTree && categoryTree.items"
                :key="cat.id"
                :header="cat.label"
              >
                <template>
                  <SfList class="list">
                    <SfListItem class="list__item">
                      <SfMenuItem :count="cat.count || ''" :label="cat.label">
                        <template #label>
                          <nuxt-link
                            :to="localePath(th.getCatLink(cat))"
                            :class="
                              cat.isCurrent ? 'sidebar--cat-selected' : ''
                            "
                          >
                            {{ $t('All') }}
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                    <SfListItem
                      class="list__item"
                      v-for="subCat in cat.items"
                      :key="subCat.id"
                    >
                      <SfMenuItem
                        :count="subCat.count || ''"
                        :label="subCat.label"
                      >
                        <template #label="{ label }">
                          <nuxt-link
                            :to="localePath(th.getCatLink(subCat))"
                            :class="
                              subCat.isCurrent ? 'sidebar--cat-selected' : ''
                            "
                          >
                            {{ label }}
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                  </SfList>
                </template>
              </SfAccordionItem>
            </SfAccordion>
          </SfLoader>
        </LazyHydrate>
      </div>
      <SfLoader :class="{ loading }" :loading="loading">
        <div class="products" v-if="products.length > 0">
          <transition-group
            v-if="isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <ProductCard
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="product._slug"
              :product="product"
              :style="{ '--index': i }"
              class="products__product-card"
            />
          </transition-group>
          <transition-group
            v-else
            appear
            name="products__slide"
            tag="div"
            class="products__list"
          >
            <ProductCard
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="product._slug"
              :isHorizontal="true"
              :product="product"
              :style="{ '--index': i }"
              class="products__product-card-horizontal"
            />
          </transition-group>
          <LazyHydrate on-interaction>
            <SfPagination
              v-if="!loading"
              class="products__pagination desktop-only"
              v-show="pagination.totalPages > 1"
              :current="pagination.currentPage"
              :total="pagination.totalPages"
              :visible="5"
            />
          </LazyHydrate>
          <div
            v-show="pagination.totalPages > 1"
            class="products__show-on-page"
          >
            <span class="products__show-on-page__label">{{
                $t('Show on page')
              }}</span>
            <LazyHydrate on-interaction>
              <SfSelect
                :value="
                  pagination && pagination.itemsPerPage
                    ? pagination.itemsPerPage.toString()
                    : ''
                "
                class="products__items-per-page"
                @input="th.changeItemsPerPage"
              >
                <SfSelectOption
                  v-for="option in pagination.pageOptions"
                  :key="option"
                  :value="option"
                  class="products__items-per-page__option"
                >
                  {{ option }}
                </SfSelectOption>
              </SfSelect>
            </LazyHydrate>
          </div>
        </div>
        <div class="products__empty" v-else>
          <nuxt-img
            :src="'/error/error.svg' | addBasePathFilter"
            :height="230"
            :width="230"
            class="before-results__picture"
            alt="error"
            loading="lazy"
            provider="static"
          />
          <p v-if="isChannelFilteringEnabled">
            {{ $t('No products found for selected store.') }}
            <br />
            <i18n
              tag="p"
              path="You can choose another store or remove the selection to view products from all stores.">
              <SfButton
                class="sf-button--pure products__store-selector-button"
                :aria-label="$t('Open store selector')"
                @click="toggleStoreLocatorModal"
              >
                {{ $t('choose') }}
              </SfButton>
            </i18n>
          </p>
          <p v-else>{{ $t('No products found.') }}</p>
        </div>
      </SfLoader>
    </div>
  </div>
</template>

<script>
import {
  SfButton,
  SfIcon,
  SfList,
  SfHeading,
  SfMenuItem,
  SfProductCard,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfSelect,
  SfBreadcrumbs,
  SfLoader,
  SfProperty,
  SfAddToCart
} from '@storefront-ui/vue';
import { computed, useContext, watch, defineComponent, useMeta } from '@nuxtjs/composition-api';
import {
  useFacet,
  useCurrency,
  facetGetters,
  useChannel
} from '@vsf-enterprise/commercetools';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiHelpers, useUiState } from '~/composables';
import CategoryPageHeader from '~/components/CategoryPageHeader';
import ProductCard from '~/components/ProductCard';

export default defineComponent({
  name: 'Category',
  transition: 'fade',
  setup() {
    const {
      $vsf: {
        $ct: {
          config: {
            enableChannelFilter
          }
        }
      },
      app: {
        i18n,
        localePath
      },
      error: nuxtError
    } = useContext();
    const th = useUiHelpers();
    const { isCategoryGridView, toggleStoreLocatorModal } = useUiState();
    const { currency } = useCurrency();
    const { result, search, loading, error } = useFacet();
    const { channel } = useChannel();
    const products = computed(() => facetGetters.getProducts(result.value));
    const categoryTree = computed(() => {
      const filterEmptyCategories = (category) => {
        if (category.items) {
          category.items = category.items
            .filter(item => item.count)
            .map(item => filterEmptyCategories(item));
        }

        return category;
      };
      return filterEmptyCategories(facetGetters.getCategoryTree(result.value));
    }
    );
    const breadcrumbs = computed(() => facetGetters.getBreadcrumbs(result.value)
      .map(breadcrumb => ({ ...breadcrumb, link: localePath(breadcrumb.link) }))
    );
    const isChannelFilteringEnabled = computed(() => enableChannelFilter && channel.value);
    const pagination = computed(() => facetGetters.getPagination(result.value));
    const sorting = computed(() => facetGetters.getSortOptions(result.value));
    const activeCategory = computed(() => {
      const items = categoryTree.value.items;
      if (!items || !items.length) {
        return '';
      }
      const category = items.find(({ isCurrent, items }) => isCurrent || items.find(({ isCurrent }) => isCurrent));
      return category?.label || items[0].label;
    });
    const metaTags = computed(() => ({
      title: `${result.value.data?.currentCategory?.name || ''} | Vue Storefront Demo`,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${result.value.data?.currentCategory?.name || ''} | Vue Storefront Demo`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${result.value.data?.currentCategory?.metaDescription || ''} ${result.value.data?.currentCategory?.name || ''} ${i18n.t('on the Demo of Vue Storefront')}`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `${result.value.data?.currentCategory?.metaDescription || ''} ${result.value.data?.currentCategory?.name || ''} ${i18n.t('on the Demo of Vue Storefront')}`
        }
      ]
    }));

    useMeta(() => metaTags.value);
    async function searchProducts() {
      await search({ ...th.getFacetsFromURL(), customQuery: { productProjections: 'getFacetProducts' } });
    }
    watch(currency, async () => {
      await searchProducts();
    });
    if (enableChannelFilter) {
      watch(channel, async () => {
        await searchProducts();
      });
    }

    onSSR(async () => {
      await searchProducts();
      if (error?.value?.search) {
        nuxtError({ statusCode: 404 });
      }
    });
    return {
      toggleStoreLocatorModal,
      isCategoryGridView,
      th,
      products,
      categoryTree,
      loading,
      isChannelFilteringEnabled,
      pagination,
      activeCategory,
      breadcrumbs,
      sorting
    };
  },
  head: {},
  components: {
    ProductCard,
    CategoryPageHeader,
    SfAddToCart,
    SfButton,
    SfIcon,
    SfList,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfHeading,
    SfProperty,
    LazyHydrate
  }
});
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.main {
  display: flex;
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    display: flex;
    flex: 0 0 15%;
    align-items: center;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }
}
.list {
  --menu-item-font-size: var(--font-size--sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacer-xl) 0;
    p {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      color: var(--c-text-muted);
      text-align: center;
    }
  }
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
      margin: var(--spacer-sm) var(--spacer-sm) 0 var(--spacer-sm);
    }
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__product-card {
    --image-width: 20px;
    --image-height: 20px;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    max-width: var(--product-card-max-width, 10.625rem);
    @include for-desktop {
      flex: 1 1 25%;
      --product-card-max-width: 25%;
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
    ::v-deep .sf-product-card {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      &__image-wrapper {
        position: static;
      }
    }
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
    margin: var(--spacer-lg) 0;
    @include for-mobile {
      margin: 0;
      ::v-deep .sf-image {
        --image-width: 5.3125rem;
        --image-height: 7.0625rem;
      }
      ::v-deep .sf-product-card-horizontal__actions {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
    ::v-deep .sf-product-card-horizontal__image-wrapper {
      align-self: flex-end;
    }
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  @include for-desktop {
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__list {
      margin: 0 var(--spacer-sm) 0 var(--spacer-sm);
    }
  }
  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
  &__store-selector-button {
    display: inline;
  }
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
  border-right: 1px solid var(--c-light);
}
.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }
  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}
</style>
