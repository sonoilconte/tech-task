<template>
  <div>
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{
        'header-on-top': isSearchOpen,
        'sf-header--has-mobile-navigation' : isMobileMenuOpen
      }"
      :isNavVisible="isMobileMenuOpen"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #logo>
        <nuxt-link :to="localePath('/')" class="sf-header__logo">
          <nuxt-img
            :src="'/icons/logo.svg' | addBasePathFilter"
            alt="Vue Storefront Next"
            :width="32"
            :height="32"
            class="sf-header__logo-image"
            loading="eager"
            provider="static"
          />
        </nuxt-link>
      </template>
      <template #navigation>
        <HeaderNavigation />
      </template>
      <template #aside>
        <div class="aside-container smartphone-only">
          <SfButton
            class="sf-button--pure"
            v-if="enableClickCollect"
            :aria-label="$t('Open store selector')"
            @click="toggleStoreLocatorModal"
          >
            <SfIcon class="" icon="store" size="1.5rem" />
            <ClientSideOnly v-if="channel">
              <SfBadge class="sf-badge--number cart-badge" />
            </ClientSideOnly>
          </SfButton>
          <StoreLocaleSelector />
        </div>
      </template>
      <template #header-icons>
        <div v-e2e="'header-icons'" class="sf-header__icons">
          <SfButton
            class="sf-button--pure sf-header__action"
            v-if="enableClickCollect"
            :aria-label="$t('Open store selector')"
            @click="toggleStoreLocatorModal"
          >
            <SfIcon class="sf-header__icon" icon="store" size="1.875rem" />
            <ClientSideOnly v-if="channel">
              <SfBadge class="sf-badge--number cart-badge" />
            </ClientSideOnly>
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            :aria-label="$t('Open account')"
            @click="handleAccountClick('My profile')"
          >
            <SfIcon :icon="accountIcon" size="1.25rem" />
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            :aria-label="$t('Toggle wishlist sidebar')"
            @click="toggleWishlistSidebar"
          >
            <SfIcon
              class="sf-header__icon"
              :icon="wishlistIcon"
              size="1.25rem"
            />
            <ClientSideOnly v-if="wishlistTotalItems">
              <SfBadge class="sf-badge--number cart-badge">{{ wishlistTotalItems }}</SfBadge>
            </ClientSideOnly>
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            :aria-label="$t('Toggle cart sidebar')"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <ClientSideOnly v-if="cartTotalItems > 0">
              <SfBadge class="sf-badge--number cart-badge">{{ cartTotalItems }}</SfBadge>
            </ClientSideOnly>
          </SfButton>
        </div>
      </template>
      <template #search>
        <SfSearchBar
          ref="searchBarRef"
          :placeholder="$t('Search for items')"
          :aria-label="$t('Search')"
          class="sf-header__search"
          :value="term"
          :icon="searchBarIcon"
          @input="handleSearch"
          @keydown.enter="handleSearch($event)"
          @click="openSearchModal"
          @focus="openSearchModal"
          @keydown.esc="closeSearch"
          @click:icon="focusSearchBar"
        />
      </template>
    </SfHeader>
    <SearchResults
      @close="closeSearch"
      v-click-outside="closeSearch"
    />
    <SfOverlay :visible="isSearchOpen" />
  </div>
</template>

<script>
import {
  SfHeader,
  SfIcon,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfOverlay
} from '@storefront-ui/vue';
import {
  useCart,
  useWishlist,
  wishlistGetters,
  useUser,
  cartGetters,
  useFacet,
  useChannel
} from '@vsf-enterprise/commercetools';
import {
  computed,
  ref,
  watch,
  useRouter,
  useRoute,
  useContext
} from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive.js';
import { useUiHelpers, useUiState } from '~/composables';
import StoreLocaleSelector from './StoreLocaleSelector';
import SearchResults from '~/components/SearchResults';
import HeaderNavigation from './HeaderNavigation';
import debounce from 'lodash.debounce';
import ClientSideOnly from '~/components/ClientSideOnly';

export default {
  components: {
    SfHeader,
    StoreLocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    HeaderNavigation,
    ClientSideOnly
  },
  directives: { clickOutside },
  setup() {
    const {
      app: { i18n, localePath }
    } = useContext();
    const {
      $ct: {
        config: { enableClickCollect }
      }
    } = useVSFContext();
    const route = useRoute();
    const router = useRouter();
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      isMobileMenuOpen,
      isSearchOpen,
      closeSearchModal,
      openSearchModal,
      toggleStoreLocatorModal
    } = useUiState();
    const { setTermForUrl, getFacetsFromURL } = useUiHelpers();
    const { search, reset } = useFacet('search');
    const { isAuthenticated } = useUser();
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { channel } = useChannel();

    const term = ref(getFacetsFromURL().phrase);
    const searchBarRef = ref(null);
    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });
    const wishlistTotalItems = computed(() => {
      const count = wishlistGetters.getTotalItems(wishlist.value);
      return count ? count.toString() : null;
    });
    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );
    const wishlistIcon = computed(() =>
      wishlistGetters.getTotalItems(wishlist.value) ? 'heart_fill' : 'heart'
    );
    const searchBarIcon = computed(() => ({
      icon: term.value ? 'cross' : 'search',
      size: '20px',
      color: 'var(--c-text)'
    }));
    const closeSearch = (event) => {
      const searchBar = searchBarRef.value.$el;
      if (!isSearchOpen.value) return;

      if (!event || (event.key === 'Escape' || !searchBar.contains(event.target))) {
        term.value = '';
        closeSearchModal();
        reset();
      }
    };
    // TODO: https://github.com/vuestorefront/vue-storefront/issues/4927
    const handleAccountClick = async (title) => {
      if (isAuthenticated.value) {
        const slugifiedTitle = i18n.t(title).toLowerCase().replace(' ', '-');
        return router.push(localePath(`/my-account/${slugifiedTitle}`));
      }
      toggleLoginModal();
    };
    const handleSearch = debounce(async (paramValue) => {
      term.value = paramValue.target?.value || paramValue;
      if (term.value) {
        await search({
          filters: {},
          page: 1,
          itemsPerPage: 20,
          sort: 'latest',
          phrase: term.value,
          customQuery: { productProjections: 'getFacetProducts' }
        });
      } else {
        reset();
      }
    }, 1000);
    const focusSearchBar = () => {
      const inputElement = searchBarRef.value.$el.querySelector('input');
      term.value = '';
      inputElement.focus();
      reset();
    };

    watch(
      () => route.value.fullPath,
      () => {
        closeSearch();
      }
    );
    return {
      accountIcon,
      wishlistIcon,
      searchBarIcon,
      cartTotalItems,
      wishlistTotalItems,
      toggleCartSidebar,
      toggleWishlistSidebar,
      setTermForUrl,
      term,
      isSearchOpen,
      handleAccountClick,
      closeSearch,
      focusSearchBar,
      openSearchModal,
      handleSearch,
      searchBarRef,
      isMobileMenuOpen,
      enableClickCollect,
      channel,
      toggleStoreLocatorModal
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  z-index: 2;
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
  &--has-mobile-navigation {
    z-index: 1;
  }
}
.header-on-top {
  z-index: 2;
}
.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}
.cart-badge {
  position: absolute;
  bottom: 50%;
  left: 50%;

  @include for-mobile {
    bottom: 70%;
    left: 70%;
    --badge-min-width: .7rem;
    --badge-min-height: .7rem;
  }
}
.sf-header__logo-image {
  ::v-deep .sf-image--placeholder {
    visibility: hidden;
  }
}
.aside-container {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
