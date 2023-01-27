<template>
  <div class="sf-store-locator" ref="container">
    <SfLoader :loading="loading">
      <div class="sf-store-locator__wrapper">
        <div class="sf-store-locator__list">
          <SfScrollable v-if="enableScrollable">
            <div class="sf-store-locator__stores" v-if="places">
              {{ $t('Stores found') }}: <span>{{ places.length }}</span>
            </div>
            <StoreComponent
              v-for="place in places"
              v-bind="place"
              class="sf-store-locator__store-container"
              :active="isStoreActive(place)"
              :key="place.key"
              @click="checkCart(() => showStoreDetails(place, true))"
              @clear="checkCart(clearStore)"
            />
          </SfScrollable>
          <div v-else-if="selectedPlace">
            <StoreComponent
              v-bind="selectedPlace"
              class="sf-store-locator__store-container sf-store-locator__store-container--modal"
              :active="isStoreActive(selectedPlace)"
              @click="checkCart(() => showStoreDetails(selectedPlace))"
              @clear="clearStore"
            />
            <SfButton
              class="show-more sf-button--full-width color-secondary"
              @click="showMoreStores"
            >
              {{ $t('Show more stores in this area') }}
            </SfButton>
          </div>
        </div>
        <div class="sf-store-locator__map-wrapper">
        <GMap
          v-if="places.length"
          ref="gMap"
          language="en"
          :center="centerMap"
          :options="gMapOptions"
          :zoom="mapZoom"
          @click="setSelectedChannelView(false)"
        >
          <GMapMarker
            v-for="place in places"
            :key="place.key"
            :description='place.description'
            :position="place.position"
            :options="{ icon: '/icons/pin.svg' }"
            @click="checkCart(() => showStoreDetails(place))"
          />
        </GMap>
      </div>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import { ref, computed, onMounted, useContext, useRoute } from '@nuxtjs/composition-api';
import StoreComponent from '~/components/StoreComponent.vue';
import getGMapOptions from '~/constants/googleMapTheme';
import {
  SfButton,
  SfSearchBar,
  SfScrollable,
  SfBottomModal,
  SfBar,
  SfBreadcrumbs,
  SfLoader
} from '@storefront-ui/vue';
import { useChannel, useCart, cartGetters } from '@vsf-enterprise/commercetools';
import { usePlaces, useUiNotification } from '~/composables';

export default {
  name: 'StoreLocator',
  components: {
    StoreComponent,
    SfButton,
    SfSearchBar,
    SfScrollable,
    SfBottomModal,
    SfBar,
    SfBreadcrumbs,
    SfLoader
  },
  setup() {
    const singleChannelView = ref(false);
    const gMap = ref(null);
    const {
      channel,
      channels,
      loading,
      change: changeChannel,
      search: searchChannels
    } = useChannel();
    const { app: { i18n } } = useContext();
    const route = useRoute();
    const { send } = useUiNotification();
    const { places, selectedPlace } = usePlaces();
    const { cart, clear: clearCart } = useCart();
    const container = ref(null);
    let dismissNotification = null;

    const centerMap = computed(() => {
      const store = selectedPlace.value || places.value[0];
      return store?.position;
    });
    const mapZoom = computed(() => selectedPlace.value ? 14 : 8);
    const enableScrollable = computed(() => !singleChannelView.value && places.value.length);

    const setSelectedChannelView = (value) => {
      singleChannelView.value = value;
    };
    const showMoreStores = () => {
      setSelectedChannelView(false);
      gMap.value.map.setZoom(8);
    };
    const isShippingStep = route.value.fullPath.includes('checkout/shipping');

    const checkCart = (callback) => {
      if (!isShippingStep && cartGetters.getTotalItems(cart.value)) {
        dismissNotification && dismissNotification();
        dismissNotification = send({
          type: 'info',
          message: i18n.t('Your cart will be cleared if you change the store'),
          action: {
            text: i18n.t('Yes'),
            onClick: () => {
              clearCart();
              callback();
            }
          },
          persist: true
        });
      } else {
        callback();
      }
    };

    const showStoreDetails = (place, scrollToTop = false) => {
      gMap.value.map.setZoom(14);
      setSelectedChannelView(true);
      gMap.value.map.panTo(place.position);
      changeChannel(place.id);
      if (scrollToTop && window?.innerWidth < 1024) {
        container.value?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    const isStoreActive = ({ id }) => channel.value === id;
    const clearStore = () => {
      changeChannel('');
      showMoreStores();
    };

    onMounted(() => {
      if (channels.value.length === 0) {
        searchChannels();
      }
    });

    return {
      gMapOptions: getGMapOptions(),
      selectedPlace,
      places,
      singleChannelView,
      gMap,
      showMoreStores,
      showStoreDetails,
      setSelectedChannelView,
      centerMap,
      loading,
      isStoreActive,
      clearStore,
      mapZoom,
      enableScrollable,
      container,
      checkCart
    };
  }
};
</script>

<style lang="scss" scoped>
// original styles from SFUI
.sf-store-locator {
  &__wrapper {
    display: flex;
    flex-direction: var(--store-locator-wrapper-flex-direction, column-reverse);
    justify-content: var(--store-locator-wrapper-justify-content, flex-start);
    align-items: var(--store-locator-wrapper-align-items, flex-start);
  }
  &__list {
    flex: var(--store-locator-list-flex);
    padding: var(--store-locator-list-padding, 0 var(--spacer-sm));
    margin: var(--store-locator-list-margin);
  }
  &__map-wrapper {
    position: relative;
    flex: var(--store-locator-map-flex, 0 0 60vh);
    width: var(--store-locator-map-width, 100%);
    height: var(--store-locator-map-height);
  }
  &__map {
    // Workaround to known bug about min-height / height interaction in Chrome / Firefox
    position: absolute;
    height: 100%;
    z-index: 0;
  }
  &__stores {
    width: var(--store-locator-stores-width, 100%);
    padding: var(--store-locator-stores-padding, var(--spacer-sm) 0 var(--spacer-sm) var(--spacer-sm));
    margin: var(--store-locator-stores-margin);
    @include border(
        --store-locator-stores-border,
        0 0 2px 0,
        solid,
        var(--c-primary)
    );
    color: var(--store-locator-store-color, var(--c-text));
    @include font(
        --store-locator-stores-font,
        var(--font-weight--normal),
        var(--font-size--base),
        1.4,
        var(--font-family--secondary)
    );
    span {
      font-weight: var(--font-weight--bold);
      color: var(--c-text);
    }
  }
  @include for-desktop {
    --store-locator-stores-width: calc(100% - var(--spacer-sm));
    --store-item-name-color: var(--c-link);
    --store-locator-wrapper-flex-direction: row;
    --store-locator-list-flex: 1;
    --store-locator-list-padding: 0;
    --store-locator-list-margin: 0 var(--spacer-sm) 0 0;
    --store-locator-map-flex: 1;
    --store-locator-map-height: 46.25rem;
  }
}

// custom styles
.sf-store-locator {
  --store-locator-map-height: 60vh;
  display: flex;
  height: 100%;
  @include for-desktop {
    height: 60vh;
  }

  &__stores {
    margin: 0 0 var(--spacer-sm) 0;
    order: 0;
    padding-left: 0;
    width: 100%;
    @include for-mobile {
      margin: 0;
    }
  }
  &__list {
    position: relative;
    width: 100%;
    height: 100%;
    --store-locator-list-margin: 0 var(--spacer-xl) 0 0;
    @include for-mobile {
      display: flex;
      flex-direction: column;
      --store-locator-list-margin: var(--spacer-base);
      --store-locator-list-padding: 0;
      width: auto;
    }
  }
  &__wrapper {
    --store-locator-wrapper-flex-direction: column-reverse;
    @include for-desktop {
      --store-locator-wrapper-flex-direction: row;
    }
  }
  &__store-container.sf-store {
    padding: var(--spacer-base) 0 var(--spacer-base);
    &:first-of-type {
      padding-top: 0;
    }
    &--modal {
      padding-top: 0;
      @include for-desktop {
        padding-top: 8px;
      }
    }
  }
}
.sf-modal .sf-modal__content {
  height: 100%;
}
::v-deep .GMap__Wrapper {
  height: var(--store-locator-map-height);
}
.show-more {
  width: 100%;
  margin: var(--spacer-base) 0 var(--spacer-xs);
  @include for-desktop {
    margin: var(--spacer-base) 0 0 0;
  }
}
.mapHidden {
  @include for-mobile {
    display: none;
  }
}
::v-deep .sf-scrollable {
  &__content {
    --scrollable-max-height: 100%;
    @include for-desktop {
      --scrollable-max-height: 60vh;
      padding-right: 10px;
      margin-right: -10px;
    }
  }
  ::-webkit-scrollbar {
    visibility: hidden;
    width: 0.3125rem;
    height: 0.3125rem;
  }
  &:hover ::-webkit-scrollbar {
    visibility: visible;
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 0.625rem;
  }
  &:hover ::-webkit-scrollbar-thumb {
    background: var(--c-text-muted);
  }
  &__content {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
  &__view-all {
    display: none;
  }
}
</style>
