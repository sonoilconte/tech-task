<template>
  <div>
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>
    <LazyHydrate when-idle>
      <AppHeader />
    </LazyHydrate>
    <div id="layout">
      <nuxt :key="$route.fullPath"/>
      <LazyHydrate when-visible>
        <BottomNavigation />
      </LazyHydrate>
      <CartSidebar />
      <WishlistSidebar />
      <FiltersSidebar />
      <LoginModal />
      <StoreLocatorModal v-if="isStoreLocatorModalOpen" />
      <Notification />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import { onMounted, watch } from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import { useCurrency, useLocale, useStore, useUser, useWishlist } from '@vsf-enterprise/commercetools';
import { onSSR } from '@vue-storefront/core';

import AppHeader from '~/components/AppHeader.vue';
import BottomNavigation from '~/components/BottomNavigation.vue';
import AppFooter from '~/components/AppFooter.vue';
import TopBar from '~/components/TopBar.vue';
import CartSidebar from '~/components/CartSidebar.vue';
import WishlistSidebar from '~/components/WishlistSidebar.vue';
import FiltersSidebar from '~/components/FiltersSidebar.vue';
import LoginModal from '~/components/Auth/AuthModal.vue';
import Notification from '~/components/Notification';
import { useUiState } from '../composables';

const StoreLocatorModal = () => ({
  component: import(/* webpackChunkName: "StoreLocatorModal" */ '~/components/StoreLocatorModal.vue'),
  timeout: 5000
});

export default {
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    TopBar,
    AppHeader,
    BottomNavigation,
    AppFooter,
    CartSidebar,
    WishlistSidebar,
    FiltersSidebar,
    LoginModal,
    StoreLocatorModal,
    Notification
  },

  setup () {
    const { isStoreLocatorModalOpen } = useUiState();
    const { load: loadStores } = useStore();
    const { load: loadUser } = useUser();
    const { load: loadWishlist, setWishlist } = useWishlist();
    const { selectedLocale } = useLocale();
    const { currency } = useCurrency();

    onSSR(async () => {
      await Promise.all([
        loadStores()
      ]);
    });

    onMounted(async () => {
      await Promise.all([
        loadUser(),
        loadWishlist()
      ]);
    });

    watch(selectedLocale, async () => {
      setWishlist(null);
      await Promise.all([
        loadUser(),
        loadWishlist()
      ]);
    });

    watch(currency, async () => {
      setWishlist(null);
      await loadWishlist();
    });

    return {
      isStoreLocatorModalOpen
    };
  },
  head () {
    return this.$nuxtI18nHead({ addSeoAttributes: true });
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/vue/styles";

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}

.sf-product-card {
  .sf-image--placeholder {
    @include for-mobile {
      height: 205px;
      width: 154px;
    }
    @include for-desktop {
      height: 290px;
      width: 216px;
    }
  }
}
</style>
