<template>
  <div class="container">
    <SfButton
      class="container__lang container__lang--selected"
      :aria-label="$t('Open store locale selection')"
      @click="openLangModal"
    >
      <nuxt-img
        :src="`/icons/langs/${selectedLocale}.webp` | addBasePathFilter"
        :height="20"
        :width="20"
        alt="Flag"
        class="container__lang-icon"
        loading="eager"
        provider="static"
      />
    </SfButton>
    <SfBottomModal
      :is-open="isLangModalOpen"
      @click:close="closeLangModal"
    >
      <template v-if="isMultiStoreAvailable">
        <SfHeading
          :level="3"
          :title="$t('Choose store')"
          class="container__title"
        />
        <SfList v-if="enableMultiDomain">
          <SfListItem v-for="store in stores" :key="store.id">
            <a
              :href="`${store.protocol}://${store.domain}`"
              class="container__button"
              :class="isStoreSelected(store) && 'container__button--selected'"
            >
              <SfCharacteristic class="language">
                <template #title>
                  <span>{{ store.name }}</span>
                </template>
                <template #icon>
                  <nuxt-img
                    :src="`/icons/langs/${getStoreLocale(store)}.webp` | addBasePathFilter"
                    :width="20"
                    :height="20"
                    alt="Flag"
                    class="language__flag"
                    provider="static"
                  />
                </template>
              </SfCharacteristic>
            </a>
          </SfListItem>
        </SfList>
        <SfList v-else>
          <SfListItem v-for="store in availableStores" :key="store.id">
            <button
              class="container__button"
              :class="isStoreSelected(store) && 'container__button--selected'"
              @click.prevent="changeStore(store)"
            >
              <SfCharacteristic class="language">
                <template #title>
                  <span>{{ $t(store.name) }}</span>
                </template>
                <template #icon>
                  <nuxt-img
                    :src="`/icons/langs/${getStoreLocale(store)}.webp` | addBasePathFilter"
                    :height="20"
                    :width="20"
                    alt="Flag"
                    class="language__flag"
                    provider="static"
                  />
                </template>
              </SfCharacteristic>
            </button>
          </SfListItem>
        </SfList>
      </template>
      <SfHeading
        :level="3"
        :title="$t('Choose language')"
        class="container__title"
      />
      <SfList>
        <SfListItem v-for="lang in availableLocales" :key="lang.code">
          <button
            class="container__button"
            @click="changeLanguage(lang.code)"
          >
            <SfCharacteristic class="language">
              <template #title>
                <span>{{ $t(lang.label) }}</span>
              </template>
              <template #icon>
                <nuxt-img
                  :src="`/icons/langs/${lang.code}.webp` | addBasePathFilter"
                  :height="20"
                  :width="20"
                  alt="Flag"
                  class="language__flag"
                  provider="static"
                />
              </template>
            </SfCharacteristic>
          </button>
        </SfListItem>
      </SfList>
      <template v-if="isMultiCurrency">
        <SfHeading
          :level="3"
          :title="$t('Choose currency')"
          class="container__title"
        />
        <client-only>
          <p v-if="!isCurrencyChangeAvailable" class="container__currency-subtitle">
            {{ $t('Changing currency is disabled if the shopping cart is not empty.') }}
          </p>
        </client-only>
        <SfList>
          <SfListItem v-for="currency in currencies" :key="currency.name">
            <button
              class="container__button"
              :class="[
                isCurrencySelected(currency) && 'container__button--selected',
                !isCurrencyChangeAvailable && 'container__button--disabled'
                ]"
              @click="changeSelectedCurrency(currency)">
              <SfCharacteristic class="currency">
                <template #title>
                  <span>{{ currency.label }}</span>
                </template>
                <template #icon>
                  <nuxt-img
                    v-if="currency.iso"
                    :src="`/icons/langs/${currency.iso}.webp` | addBasePathFilter"
                    :height="20"
                    :width="20"
                    alt="Flag"
                    class="language__flag"
                    provider="static"
                  />
                </template>
              </SfCharacteristic>
            </button>
          </SfListItem>
        </SfList>
      </template>
    </SfBottomModal>
  </div>
</template>

<script>
import {
  SfBottomModal,
  SfButton,
  SfCharacteristic,
  SfHeading,
  SfList
} from '@storefront-ui/vue';
import { useStore, useCart, useCurrency, useLocale, cartGetters } from '@vsf-enterprise/commercetools';
import { computed, useContext, useRouter } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { useUiNotification, useUiState } from '~/composables';

export default {
  components: {
    SfBottomModal,
    SfButton,
    SfCharacteristic,
    SfHeading,
    SfList
  },
  setup() {
    const { app: { i18n } } = useContext();
    const router = useRouter();
    const {
      $ct: {
        config: {
          enableMultiStore,
          enableMultiCurrency,
          enableMultiDomain,
          stores,
          reloadOnLanguageChange
        }
      }
    } = useVSFContext();
    const { availableLocales, defaultLocale, selectedLocale, changeLocale: changeLocaleComposable } = useLocale();
    const { change, response, store: storeKey } = useStore();
    const { currency: selectedCurrency, change: changeCurrency, currencies } = useCurrency();
    const { clear, cart } = useCart();
    const { send } = useUiNotification();
    const { isLangModalOpen, closeLangModal, openLangModal } = useUiState();
    const isMultiCurrency = computed(() => enableMultiCurrency && currencies?.length > 0);
    const isCurrencySelected = (currency) => currency.name === selectedCurrency.value;
    const isCurrencyChangeAvailable = computed(() => cartGetters.getTotalItems(cart.value) === 0);

    const availableStores = computed(() => response.value?.results ?? []);
    const isMultiStoreAvailable = computed(() => enableMultiStore && availableStores.value.length > 0);

    const changeStore = ({ key }) =>
      send({
        type: 'info',
        message: i18n.t('Do you want to change the store?'),
        action: {
          text: i18n.t('Yes'),
          onClick: async () => {
            if (cart?.value) await clear();
            await change(key);
          }
        },
        persist: true
      });
    const changeLanguage = (locale) =>
      send({
        type: 'info',
        message: i18n.t('Do you want to change the language?'),
        action: {
          text: i18n.t('Yes'),
          onClick: () => {
            if (!reloadOnLanguageChange) {
              changeLocaleComposable(locale);
              closeLangModal();
            }
            router.push(router.app.switchLocalePath(locale));
          }
        },
        persist: true
      });
    const changeSelectedCurrency = async (currency) => {
      if (isCurrencyChangeAvailable.value) {
        if (cart?.value) {
          await clear();
        }
        if (!isCurrencySelected(currency)) {
          send({
            type: 'info',
            message: i18n.t('Do you want to change currency?'),
            action: {
              text: i18n.t('Yes'),
              onClick: () => {
                changeCurrency(currency);
                closeLangModal();
              }
            },
            persist: true
          });
        }
      }
    };
    const isStoreSelected = ({ key }) => key === storeKey?.value;
    const getStoreLocale = (store) => store?.languages[0] ?? defaultLocale;

    return {
      changeStore,
      changeLanguage,
      changeSelectedCurrency,
      response,
      availableStores,
      isStoreSelected,
      getStoreLocale,
      availableLocales,
      selectedLocale,
      defaultLocale,
      isLangModalOpen,
      closeLangModal,
      openLangModal,
      isMultiStoreAvailable,
      isCurrencySelected,
      isMultiCurrency,
      currencies,
      isCurrencyChangeAvailable,
      enableMultiDomain,
      stores
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  --image-width: 20px;
  --image-height: 20px;
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  @include for-mobile {
    box-sizing: content-box;
    margin: 0;
  }
  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }
  .sf-bottom-modal::v-deep .sf-bottom-modal__close {
    position: var(--circle-icon-position, absolute);
    top: var(--spacer-xs);
    right: var(--spacer-xs);
  }
  .sf-list {
    margin-bottom: var(--spacer-lg);
    .language, .currency {
      padding: var(--spacer-sm) var(--spacer-lg);
      @include for-desktop {
        padding: var(--spacer-sm);
      }
      &__flag {
        margin-right: var(--spacer-sm);
      }
    }
    @include for-desktop {
      display: flex;
    }
  }

  .sf-heading__title.h3 {
    font-weight: var(--font-weight--normal);
    padding-left: var(--spacer-lg);
    text-align: left;
  }

  &__currency-subtitle {
    padding: 0 var(--spacer-lg);
  }
  &__lang {
    width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 5px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--normal);
    color: var(--bottom-modal-title-color, var(--c-text));
    text-align: var(--bottom-modal-title-text-align, center);
    @include for-mobile {
      --heading-title-font-weight: var(--font-weight--bold);
    }
  }
  &__button {
    cursor: pointer;
    border: none;
    background: none;
    font: var(--font-weight--normal) var(--font-size--base)/1.4 var(--font-family--secondary);
    padding: 0;
    width: 100%;
    &--selected {
      font-weight: bold;
      pointer-events: none;
    }
    &--disabled {
      pointer-events: none;
      cursor: default;
      .currency {
        opacity: 0.5;
      }
    }
  }
  &__lang-icon {
    ::v-deep .sf-image--placeholder {
      visibility: hidden;
    }
  }
  ::v-deep .sf-bottom-modal__container {
    @include for-mobile {
      padding-top: var(--spacer-xl);
      overflow-y: scroll;
      max-height: 100vh;
    }
  }
}
</style>
