<template>
  <SfModal
    :visible="isStoreLocatorModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t('Pick your store')"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <StoreLocator />
    </transition>
  </SfModal>
</template>
<script>
import { SfModal, SfBar } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import StoreLocator from '~/components/StoreLocator';

export default {
  name: 'StoreLocatorModal',
  components: {
    StoreLocator,
    SfModal,
    SfBar
  },
  setup() {
    const { isStoreLocatorModalOpen, toggleStoreLocatorModal } = useUiState();

    const closeModal = () => {
      toggleStoreLocatorModal();
    };

    return {
      isStoreLocatorModalOpen,
      toggleStoreLocatorModal,
      closeModal
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
  .sf-modal__bar {
    z-index: 4;
  }
}
::v-deep .sf-modal__container {
  width: 100%;
  @include for-desktop {
    width: 95%;
  }
  .sf-modal__content {
    padding: 0;
    @include for-desktop {
      margin: var(--spacer-xl);
    }
  }
}
</style>
