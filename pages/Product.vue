<template>
  <div id='product'>
    <ErrorPage
      v-if='productNotAvailable'
      :error='{ statusCode: 404 }'
    />
    <template v-else>
      <SfBreadcrumbs
        class='breadcrumbs desktop-only'
        :breadcrumbs='breadcrumbs'
      />
      <div class='product'>
        <LazyHydrate when-idle>
          <SfGallery
            :images='productGallery'
            class='product__gallery'
            :image-width='422'
            :image-height='664'
            :thumb-width='160'
            :thumb-height='160'
          />
        </LazyHydrate>

        <div class='product__info'>
          <div class='product__header'>
            <SfHeading
              :title='productGetters.getName(product)'
              :level='3'
              class='sf-heading--no-underline sf-heading--left'
            />
            <SfIcon
              icon='drag'
              size='xxl'
              color='var(--c-text-disabled)'
              class='product__drag-icon smartphone-only'
            />
          </div>
          <div class='product__price-and-rating'>
            <SfPrice
              :regular='productPriceTransform(product).regular'
              :special='productPriceTransform(product).special'
            />
            <div>
              <div class='product__rating'>
                <SfRating
                  :score='averageRating'
                  :max='5'
                />
                <span v-if='!!totalReviews' class='product__count'>
                  ({{ totalReviews }})
                </span>
              </div>
              <SfButton
                class='sf-button--text'
                @click='goToReviewsTab(tabs.reviews.tab)'
              >
                {{ $t('Read all reviews') }}
              </SfButton>
            </div>
          </div>
          <div>
            <p class='product__description desktop-only'>
              {{ $t(description) }}
            </p>
            <SfButton class='sf-button--text desktop-only product__guide'>
              {{ $t('Size guide') }}
            </SfButton>
            <SfSelect
              v-e2e="'size-select'"
              v-if='options.size'
              :value='configuration.size'
              @input='size => updateFilter({ size })'
              :label="$t('Size')"
              class='sf-select--underlined product__select-size'
              :required='true'
            >
              <SfSelectOption
                v-for='size in options.size'
                :key='size.value'
                :value='size.value'
              >
                {{ size.label }}
              </SfSelectOption>
            </SfSelect>
            <div v-if='options.color && options.color.length > 1' class='product__colors desktop-only'>
              <p class='product__color-label'>{{ $t('Color') }}:</p>
              <SfColor
                v-for='(color, i) in options.color'
                :key='i'
                :color='color.value'
                class='product__color'
                @click='updateFilter({ color: color.value })'
              />
            </div>
            <SfAddToCart
              v-e2e="'product_add-to-cart'"
              v-model='qty'
              :disabled='cartLoading'
              class='product__add-to-cart'
            >
              <template #add-to-cart-btn>
                <ProductLoader :loading='cartLoading'>
                  <SfButton @click='addToCart' :disabled='!isProductAvailable'>
                    {{ $t('Add to cart') }}
                  </SfButton>
                </ProductLoader>
              </template>
            </SfAddToCart>
            <SfAlert
              class='product__add-to-cart--alert'
              v-if='!isProductAvailable'
              :message='productAvailabilityMessage'
              type='danger'
            />
          </div>

          <LazyHydrate when-idle>
            <SfTabs
              @click:tab='currentTab = $event'
              :open-tab='currentTab'
              class='product__tabs'
              ref='reviewsContainer'
            >
              <SfTab :title="$t('Description')">
                <div class='product__description'>
                  {{ $t('Product description') }}
                </div>
                <SfProperty
                  v-for='(property, i) in properties'
                  :key='i'
                  :name='$t(property.name)'
                  :value='property.value'
                  class='product__property'
                >
                  <template v-if="property.name === 'Category'" #value>
                    <SfButton class='product__property__button sf-button--text'>
                      {{ property.value }}
                    </SfButton>
                  </template>
                </SfProperty>
              </SfTab>
              <SfTab :title="$t('Read reviews')">
                <ClientSideOnly>
                  <ProductReviews @scrollTo='goToReviewsTab' />
                </ClientSideOnly>
              </SfTab>
              <SfTab
                :title="$t('Additional Information')"
                class='product__additional-info'
              >
                <div class='product__additional-info'>
                  <p class='product__additional-info__title'>{{ $t('Brand') }}</p>
                  <p>{{ $t(brand) }}</p>
                  <p class='product__additional-info__title'>{{ $t('Instruction1') }}</p>
                  <p class='product__additional-info__paragraph'>
                    {{ $t('Instruction2') }}
                  </p>
                  <p class='product__additional-info__paragraph'>
                    {{ $t('Instruction3') }}
                  </p>
                  <p>{{ $t(careInstructions) }}</p>
                </div>
              </SfTab>
            </SfTabs>
          </LazyHydrate>
        </div>
      </div>

      <LazyHydrate when-visible>
        <RelatedProducts
          :products='relatedProducts'
          :loading='productLoading'
          :title="$t('Match it with')"
        />
      </LazyHydrate>

      <LazyHydrate when-visible>
        <InstagramFeed />
      </LazyHydrate>
    </template>
  </div>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration';
import {
  ref,
  computed,
  defineComponent,
  useRoute,
  useRouter,
  useContext,
  useMeta,
  watch
} from '@nuxtjs/composition-api';
import {
  SfAlert,
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfBreadcrumbs,
  SfButton,
  SfColor
} from '@storefront-ui/vue';
import {
  useProduct,
  useReview,
  useCart,
  useChannel,
  useCurrency,
  productGetters,
  facetGetters,
  productPriceTransform,
  useFacet,
  cartGetters
} from '@vsf-enterprise/commercetools';
import { onSSR, addBasePath } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';
import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import ProductReviews from '~/components/ProductReviews';
import ClientSideOnly from '~/components/ClientSideOnly';
import ProductLoader from '~/components/ProductLoader';

const ErrorPage = () => import('~/layouts/error.vue');

export default defineComponent({
  name: 'Product',
  transition: 'fade',
  setup() {
    const {
      app: {
        localePath,
        i18n
      },
      res
    } = useContext();
    const route = useRoute();
    const router = useRouter();
    const { currency } = useCurrency();

    const { products, search, error: productError, loading } = useProduct('products');
    const { channel: selectedChannel } = useChannel();
    const { result: relatedProducts, search: searchRelatedProducts } = useFacet('relatedProducts');
    const { search: searchReviews } = useReview('productReviews');
    const { addItem, loading: cartLoading, error: cartError, cart } = useCart();

    const { send } = useUiNotification();
    const tabs = {
      description: 1,
      reviews: {
        tab: 2,
        limit: 10
      },
      additionalInfo: 3
    };
    const currentTab = ref(tabs.description);
    const qty = ref(1);
    const productLoading = ref(false);
    const reviewsContainer = ref(null);

    const product = computed(() => productGetters.getFiltered(products.value, { skus: [route.value.params.sku] })[0]);
    const options = computed(() => productGetters.getAttributes(products.value, ['color', 'size']));
    const configuration = computed(() => productGetters.getAttributes(product.value, ['color', 'size']));
    const categories = computed(() => productGetters.getCategorySlugs(product.value));
    const breadcrumbs = computed(() => productGetters.getBreadcrumbs(product.value)
      .map(breadcrumb => ({ ...breadcrumb, link: localePath(breadcrumb.link) }))
    );

    const quantityInCart = computed(() => cartGetters.getItems(cart.value).find(cartItem => cartItem.productId === product.value?._id)?.quantity || 0);
    const selectedStore = computed(() => product.value?.availability?.channels?.results.find(result => result.channel.id === selectedChannel.value));

    const isProductAvailable = computed(() => {
      if (!selectedChannel.value) {
        return true;
      }
      return selectedStore.value && selectedStore.value.availability.availableQuantity >= parseInt(qty.value) + quantityInCart.value;
    });

    const productAvailabilityMessage = computed(() => {
      if (!selectedChannel.value) {
        return '';
      }

      if (!selectedStore.value || selectedStore.value.availability.availableQuantity === 0) {
        return i18n.t('This product is not available in selected store');
      }

      const { availableQuantity } = selectedStore.value.availability;
      if (availableQuantity < qty.value + quantityInCart.value) {
        return i18n.t('Available items in selected store:') + ' ' + availableQuantity;
      }
    });

    const addToCart = async () => {
      await addItem({
        product: {
          id: product.value.id,
          sku: product.value.sku
        },
        quantity: parseInt(qty.value)
      });

      if (!cartError.value.addItem) {
        send({
          type: 'success',
          message: i18n.t('Product has been added to the cart.')
        });
      }
    };

    const productGallery = computed(() => productGetters.getGallery(product.value).map(img => ({
      mobile: { url: addBasePath(img.small) },
      desktop: { url: addBasePath(img.normal) },
      big: { url: addBasePath(img.big) },
      alt: product.value._name || product.value.name
    })));

    const filteredRelatedProducts = computed(() => facetGetters.getProducts(relatedProducts.value)
      .filter((relatedProduct) => (
        relatedProduct.sku !== route.value.params.sku
      )));

    const productNotAvailable = computed(() => !loading.value && (!product.value || productError.value.search));

    const fetchProducts = async () => {
      try {
        productLoading.value = true;
        await search({ skus: [route.value.params.sku] });
        // fail early to save bandwith by skipping redundant api calls
        if (!products.value.length) {
          throw new Error('product not found');
        }
        await searchRelatedProducts({
          categorySlug: categories.value?.[0],
          filters: {},
          page: 1,
          itemsPerPage: 8,
          sort: 'latest',
          customQuery: { productProjections: 'getFacetProducts' }
        });
        await searchReviews({
          limit: tabs.reviews.limit,
          offset: 0,
          productId: product.value?._id,
          sort: 'createdAt desc'
        });
      } catch (error) {
        if (process.server) {
          res.statusCode = 404;
        }
      } finally {
        productLoading.value = false;
      }
    };

    watch(currency, async () => {
      await fetchProducts();
    });

    onSSR(async () => {
      await fetchProducts();
    });

    const updateFilter = (filter) => {
      const { _slug: slug, sku } = productGetters.getFiltered(products.value, { attributes: filter })[0];
      router.push({ params: { slug, sku } });
    };

    const goToReviewsTab = (tab = false) => {
      if (tab) {
        currentTab.value = tab;
      }
      setTimeout(() => {
        reviewsContainer.value?.$el?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    const metaTags = computed(() => ({
      title: `${productGetters.getName(product.value)} | Vue Storefront Demo`,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${productGetters.getName(product.value)} | Vue Storefront Demo`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${product.value?._original?.masterData?.current?.metaDescription || ''} | Vue Storefront Demo`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `${product.value?._original?.masterData?.current?.metaDescription || ''} | Vue Storefront Demo`
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: product.value?.images[0]?.url || ''
        }
      ]
    }));

    useMeta(() => metaTags.value);

    return {
      addToCart,
      updateFilter,
      configuration,
      product,
      products,
      averageRating: computed(() => productGetters.getAverageRating(product.value)),
      totalReviews: computed(() => productGetters.getTotalReviews(product.value)),
      relatedProducts: filteredRelatedProducts,
      productLoading,
      options,
      qty,
      cartLoading,
      productGetters,
      productGallery,
      breadcrumbs,
      productPriceTransform,
      tabs,
      currentTab,
      goToReviewsTab,
      reviewsContainer,
      isProductAvailable,
      productAvailabilityMessage,
      productError,
      productNotAvailable
    };
  },
  head: {},
  components: {
    ProductLoader,
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    RelatedProducts,
    LazyHydrate,
    ProductReviews,
    ClientSideOnly,
    ErrorPage
  },
  data() {
    return {
      stock: 5,
      properties: [
        {
          name: 'Product code',
          value: '578902-00'
        },
        {
          name: 'Category',
          value: 'Pants'
        },
        {
          name: 'Material',
          value: 'Cotton'
        },
        {
          name: 'Country',
          value: 'Germany'
        }
      ],
      description: 'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
      detailsIsActive: false,
      brand:
        'Brand name is the perfect pairing of quality and design. This label creates major everyday vibes with its collection of modern brooches, silver and gold jewellery, or clips it back with hair accessories in geo styles.',
      careInstructions: 'Do not wash!'
    };
  }
});
</script>

<style lang='scss' scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.product {
  @include for-desktop {
    display: flex;
  }

  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }

  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }

  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }

  &__count {
    @include font(
        --count-font,
        var(--font-weight--normal),
        var(--font-size--sm),
        1.4,
        var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }

  &__description {
    @include font(
        --product-description-font,
        var(--font-weight--light),
        var(--font-size--base),
        1.6,
        var(--font-family--primary)
    );
  }

  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }

  &__colors {
    @include font(
        --product-color-font,
        var(--font-weight--normal),
        var(--font-size--lg),
        1.6,
        var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }

  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }

  &__color {
    margin: 0 var(--spacer-2xs);
  }

  &__add-to-cart {
    margin: var(--spacer-sm) var(--spacer-sm) 0;
    @include for-desktop {
      margin-left: 0;
      margin-top: var(--spacer-xl);
    }

    &--alert {
      margin-top: var(--spacer-base);
      padding: 0 var(--spacer-sm);

      @include for-desktop {
        padding: 0;
      }
    }
  }

  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }

  &__compare {
    margin-top: 0;
  }

  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;

    &__button {
      --button-font-size: var(--font-size--base);
    }
  }

  &__additional-info {
    color: var(--c-link);
    @include font(
        --additional-info-font,
        var(--font-weight--light),
        var(--font-size--sm),
        1.6,
        var(--font-family--primary)
    );

    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);

      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }

    &__paragraph {
      margin: 0;
    }
  }

  &__gallery {
    min-height: 600px;
    flex: 1;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
