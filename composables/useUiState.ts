import { reactive, computed } from '@nuxtjs/composition-api';

const state = reactive({
  isLangModalOpen: false,
  isCartSidebarOpen: false,
  isWishlistSidebarOpen: false,
  isAuthModalOpen: false,
  isStoreLocatorModalOpen: false,
  isNewsletterModalOpen: false,
  isCategoryGridView: true,
  isFilterSidebarOpen: false,
  isMobileMenuOpen: false,
  isStoreChosen: false,
  isSearchOpen: false
});

const useUiState = () => {
  const isLangModalOpen = computed(() => state.isLangModalOpen);
  const closeLangModal = () => {
    if (state.isLangModalOpen) {
      state.isLangModalOpen = false;
    }
  };
  const openLangModal = () => state.isLangModalOpen = true;

  const isSearchOpen = computed(() => state.isSearchOpen);
  const closeSearchModal = () => state.isSearchOpen = false;
  const openSearchModal = () => state.isSearchOpen = true;

  const isMobileMenuOpen = computed(() => state.isMobileMenuOpen);
  const toggleMobileMenu = () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    closeLangModal();
  };

  const isCartSidebarOpen = computed(() => state.isCartSidebarOpen);
  const toggleCartSidebar = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    closeLangModal();
    state.isCartSidebarOpen = !state.isCartSidebarOpen;
  };
  const closeCartSidebar = () => state.isCartSidebarOpen = false;

  const isWishlistSidebarOpen = computed(() => state.isWishlistSidebarOpen);
  const toggleWishlistSidebar = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    closeLangModal();
    state.isWishlistSidebarOpen = !state.isWishlistSidebarOpen;
  };
  const closeWishlistSidebar = () => state.isWishlistSidebarOpen = false;

  const isAuthModalOpen = computed(() => state.isAuthModalOpen);
  const toggleLoginModal = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    closeLangModal();
    state.isAuthModalOpen = !state.isAuthModalOpen;
  };

  const isStoreLocatorModalOpen = computed(() => state.isStoreLocatorModalOpen);
  const toggleStoreLocatorModal = () => {
    state.isStoreLocatorModalOpen = !state.isStoreLocatorModalOpen;
  };

  const isNewsletterModalOpen = computed(() => state.isNewsletterModalOpen);
  const toggleNewsletterModal = () => {
    state.isNewsletterModalOpen = !state.isNewsletterModalOpen;
  };

  const isCategoryGridView = computed(() => state.isCategoryGridView);
  const changeToCategoryGridView = () => {
    state.isCategoryGridView = true;
  };
  const changeToCategoryListView = () => {
    state.isCategoryGridView = false;
  };

  const isFilterSidebarOpen = computed(() => state.isFilterSidebarOpen);
  const toggleFilterSidebar = () => {
    state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
  };
  const isStoreChosen = computed(() => state.isStoreChosen);
  const chooseStore = () => state.isStoreChosen = true;
  const removeStore = () => state.isStoreChosen = false;

  return {
    isLangModalOpen,
    isCartSidebarOpen,
    isWishlistSidebarOpen,
    isAuthModalOpen,
    isStoreLocatorModalOpen,
    isNewsletterModalOpen,
    isCategoryGridView,
    isFilterSidebarOpen,
    isMobileMenuOpen,
    isStoreChosen,
    isSearchOpen,
    closeLangModal,
    openLangModal,
    toggleCartSidebar,
    closeCartSidebar,
    closeWishlistSidebar,
    toggleWishlistSidebar,
    toggleLoginModal,
    toggleStoreLocatorModal,
    toggleNewsletterModal,
    changeToCategoryGridView,
    changeToCategoryListView,
    toggleFilterSidebar,
    toggleMobileMenu,
    chooseStore,
    removeStore,
    closeSearchModal,
    openSearchModal
  };
};

export default useUiState;
