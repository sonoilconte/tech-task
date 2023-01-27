<template>
  <!-- TODO: create logic with isActive prop for BottomNavigationItems -->
  <SfBottomNavigation class='navigation-bottom smartphone-only'>
    <SfBottomNavigationItem
      icon='home'
      size='20px'
      :label="$t('Home')"
      @click='handleHomeClick'
    />
    <SfBottomNavigationItem icon='menu' size='20px' :label="$t('Menu')" @click='toggleMobileMenu' />
    <SfBottomNavigationItem icon='heart' size='20px' :label="$t('Wishlist')" @click='toggleWishlistSidebar' />
    <SfBottomNavigationItem icon='profile' size='20px' :label="$t('Account')" @click='handleAccountClick' />
    <!-- TODO: add logic for label - if on Home then Basket, if on PDC then AddToCart etc. -->
    <SfBottomNavigationItem
      :label="$t('Basket')"
      icon='add_to_cart'
      @click='toggleCartSidebar'
    >
      <template #icon>
        <SfCircleIcon :aria-label="$t('Basket')">
          <SfIcon
            icon='add_to_cart'
            color='white'
            size='25px'
            :style="{margin: '0 0 0 -2px'}"
          />
        </SfCircleIcon>
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import { useContext, useRouter } from '@nuxtjs/composition-api';
import { SfBottomNavigation, SfIcon, SfCircleIcon } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUser } from '@vsf-enterprise/commercetools';

export default {
  components: {
    SfBottomNavigation,
    SfIcon,
    SfCircleIcon
  },
  setup() {
    const { app: { localePath } } = useContext();
    const router = useRouter();
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      toggleMobileMenu,
      isMobileMenuOpen,
      closeLangModal
    } = useUiState();
    const { isAuthenticated } = useUser();

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        closeLangModal();
        return router.push(localePath({ name: 'my-account' }));
      }
      toggleLoginModal();
    };

    const handleHomeClick = () => {
      closeLangModal();
      isMobileMenuOpen.value ?? toggleMobileMenu();
      router.push(localePath({ name: 'home' }));
    };

    return {
      isMobileMenuOpen,
      toggleWishlistSidebar,
      toggleCartSidebar,
      toggleMobileMenu,
      handleAccountClick,
      handleHomeClick
    };
  }
};
</script>
