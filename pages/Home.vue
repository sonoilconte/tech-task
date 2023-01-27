<template>
  <div id="home">
    <LazyHydrate when-idle>
      <SfBanner
        class="hero"
        :title="$t(mocks.hero.title)"
        :subtitle="$t(mocks.hero.subtitle)"
        :background="mocks.hero.background"
        :image="mocks.hero.image | addBasePathFilter"
      />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in mocks.banners" v-slot:[item.slot]>
          <SfBanner
            :key="item.slot"
            :title="$t(item.title)"
            :subtitle="$t(item.subtitle)"
            :description="$t(item.description)"
            :button-text="$t(item.buttonText)"
            :link="localePath(item.link)"
            :image="item.image | addBasePathFilter"
            :class="item.class"
            :height="200"
            :width="200"
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <div class="similar-products">
        <SfHeading :title="$t('Match with it')" :level="2" />
        <nuxt-link :to="localePath('/c/women')" class="smartphone-only">
          {{ $t('See all') }}
        </nuxt-link>
      </div>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCarousel
        class="carousel"
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
      >
        <template #prev="{go}">
          <SfArrow
            :aria-label="$t('prev')"
            class="sf-arrow--left sf-arrow--long"
            @click="go('prev')"
          />
        </template>
        <template #next="{go}">
          <SfArrow
            :aria-label="$t('next')"
            class="sf-arrow--right sf-arrow--long"
            @click="go('next')"
          />
        </template>
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <ProductCard
            class="carousel__item__product"
            :product="product"
            :nuxt-img-config="{
              format: 'webp',
              fit: 'fill'
            }"
          />
        </SfCarouselItem>
      </SfCarousel>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCallToAction
        :title="$t('Subscribe to Newsletters')"
        :button-text="$t('Subscribe')"
        :description="$t('Be aware of upcoming sales and events. Receive gifts and special offers!')"
        :image="'/homepage/newsletter.webp' | addBasePathFilter"
        class="call-to-action"
      >
        <template #button>
          <SfButton
            class="sf-call-to-action__button"
            data-testid="cta-button"
            @click="handleNewsletterClick"
          >
            {{ $t('Subscribe') }}
          </SfButton>
        </template>
      </SfCallToAction>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <NewsletterModal @email-submitted="onSubscribe" />
    </LazyHydrate>
  </div>
</template>

<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfCarousel,
  SfProductCard,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import LazyHydrate from 'vue-lazy-hydration';
import { computed, watch, defineComponent, useContext, useMeta } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import {
  useFacet,
  useCurrency,
  facetGetters,
  productPriceTransform
} from '@vsf-enterprise/commercetools';
import NewsletterModal from '~/components/NewsletterModal.vue';
import { useUiState } from '~/composables';
import ProductCard from '~/components/ProductCard';

export default defineComponent({
  name: 'Home',
  setup() {
    const { app: { i18n } } = useContext();
    const { toggleNewsletterModal } = useUiState();

    const { result, search } = useFacet('home');
    const { currency } = useCurrency();
    const products = computed(() => facetGetters.getProducts(result.value));

    const fetchProducts = async () => {
      await search({
        filters: {},
        page: 1,
        itemsPerPage: 12,
        sort: 'latest',
        phrase: '',
        customQuery: { productProjections: 'getFacetProducts' }
      });
    };

    watch(currency, async () => {
      await fetchProducts();
    });

    onSSR(async () => {
      await fetchProducts();
    });

    const mocks = {
      hero: {
        title: 'Colorful summer dresses are already in store',
        subtitle: 'SUMMER COLLECTION 2022',
        background: '#eceff1',
        image: '/homepage/bannerH.webp'
      },
      banners: [
        {
          slot: 'banner-A',
          subtitle: 'Dresses',
          title: 'Cocktail & Party',
          description: 'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
          buttonText: 'Shop now',
          image: '/homepage/bannerF.webp',
          class: 'sf-banner--slim desktop-only',
          link: '/c/women/women-clothing-skirts'
        },
        {
          slot: 'banner-B',
          subtitle: 'Dresses',
          title: 'Linen Dresses',
          description: 'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
          buttonText: 'Shop now',
          image: '/homepage/bannerE.webp',
          class: 'sf-banner--slim banner-central desktop-only',
          link: '/c/women/women-clothing-dresses'
        },
        {
          slot: 'banner-C',
          subtitle: 'T-Shirts',
          title: 'The Office Life',
          image: '/homepage/bannerC.webp',
          class: 'sf-banner--slim banner__tshirt',
          link: '/c/women/women-clothing-shirts'
        },
        {
          slot: 'banner-D',
          subtitle: 'Summer Sandals',
          title: 'Eco Sandals',
          image: '/homepage/bannerG.webp',
          class: 'sf-banner--slim',
          link: '/c/women/women-shoes-sandals'
        }
      ]
    };

    const handleNewsletterClick = () => {
      toggleNewsletterModal();
    };

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    useMeta({
      title: i18n.t('Vue Storefront and commercetools'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: i18n.t('Vue Storefront and commercetools Demo')
        },
        {
          hid: 'description',
          name: 'description',
          content: i18n.t('Demo of Vue Storefront, Lightning-Fast Frontend for commercetools')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: i18n.t('Demo of Vue Storefront, Lightning-Fast Frontend for commercetools')
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            'https://res.cloudinary.com/dcqchkrzw/image/upload/v1650360290/homepage/commercetools_pwh3rt.png'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://demo-ct.vuestorefront.io/'
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary' }
      ]
    });

    return {
      mocks,
      products,
      handleNewsletterClick,
      onSubscribe,
      productPriceTransform
    };
  },
  head: {},
  components: {
    ProductCard,
    LazyHydrate,
    NewsletterModal,
    SfArrow,
    SfBanner,
    SfBannerGrid,
    SfButton,
    SfCallToAction,
    SfCarousel,
    SfHeading,
    SfHero,
    SfProductCard
  }
});
</script>

<style lang="scss">
.carousel__item__product {
  .sf-product-card__title {
    margin: var(--spacer-base) 0 var(--spacer-xs) 0;
  }

  .sf-product-card__add-button {
    margin-bottom: var(--spacer-xl);
  }
}
</style>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  ::v-deep .sf-banner__title {
    width: 60%;
    text-transform: none;
    font: var(--font-weight--semibold) var(--h2-font-size)/1.2 var(--font-family--secondary);
    padding-top: var(--spacer-sm);
  }
  ::v-deep .sf-banner__subtitle {
    font: var(--font-weight--normal) var(--h6-font-size)/1.4 var(--font-family--secondary);
    color: var(--c-gray);
  }
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
    min-height: 586px;
  }
  @include for-mobile {
    margin: var(--spacer-xl) auto var(--spacer-lg);
    min-height: 230px;
    --banner-background-position: 30%;
    ::v-deep .sf-banner__subtitle,
    ::v-deep .sf-banner__title {
      width: 60%;
      text-align: left;
      white-space: normal;
    }
    ::v-deep .sf-banner__wrapper {
      padding: var(--spacer-xl) var(--spacer-sm) 0;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      display: flex;
      justify-content: center;
      --product-card-add-button-transform: translate3d(0, 30%, 0);
      ::v-deep .sf-product-card {
        &__title {
          margin: var(--spacer-base) 0 var(--spacer-xs) 0;
        }
        &__add-button {
          margin-bottom: var(--spacer-xl);
        }
      }
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}
</style>
