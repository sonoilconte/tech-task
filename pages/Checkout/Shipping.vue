<template>
  <div>
    <SfHeading
      v-e2e="'shipping-heading'"
      :level="3"
      :title="$t('Shipping details')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div v-if="enableClickCollect" class="form__element">
      <p>
        {{ $t('Choose delivery option') }}:
      </p>
      <SfRadio
        name="Delivery"
        :label="$t('Delivery')"
        value="delivery"
        :selected="selectedDeliveryType"
        @input="setSelectedDeliveryType('delivery')"
      />
      <SfRadio
        name="Click & Collect"
        :label="$t('Pickup in the store')"
        :details="$t('Free')"
        value="collect"
        :selected="selectedDeliveryType"
        @input="setSelectedDeliveryType('collect')"
      />
    </div>
    <SfDivider v-if="selectedDeliveryType" class="divider" />
    <form @submit.prevent="handleAddressSubmit">
      <template v-if="selectedDeliveryType">
        <template v-if="isDelivery">
          <UserShippingAddresses
            v-e2e="'shipping-addresses'"
            v-if="hasSavedAddresses"
            v-model="setAsDefault"
            :currentAddressId="currentAddressId"
            @setCurrentAddress="handleSetCurrentAddress"
          />
          <SfCheckbox
            v-e2e="'copy-address'"
            :selected="sameAsBilling"
            @change="handleCheckSameAddress"
            :label="$t('Copy address data from billing')"
            name="copyShippingAddress"
            class="form__element"
          />
          <div class="form" v-if="canAddNewAddress">
            <SfInput
              v-e2e="'shipping-firstName'"
              :value="formData.firstName"
              @input="firstName => changeShippingDetails('firstName', firstName)"
              :label="$t('First name')"
              name="firstName"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-e2e="'shipping-lastName'"
              :value="formData.lastName"
              @input="lastName => changeShippingDetails('lastName', lastName)"
              :label="$t('Last name')"
              name="lastName"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-e2e="'shipping-streetName'"
              :value="formData.streetName"
              @input="streetName => changeShippingDetails('streetName', streetName)"
              :label="$t('Street name')"
              name="streetName"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-e2e="'shipping-streetNumber'"
              :value="formData.streetNumber"
              @input="streetNumber => changeShippingDetails('streetNumber', streetNumber)"
              :label="$t('House number')"
              name="apartment"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-e2e="'shipping-city'"
              :value="formData.city"
              @input="city => changeShippingDetails('city', city)"
              :label="$t('City')"
              name="city"
              class="form__element form__element--half"
              required
            />
            <SfSelect
              v-e2e="'shipping-country'"
              :value="formData.country"
              @input="country => changeShippingDetails('country', country)"
              :label="$t('Country')"
              name="country"
              class="form__element form__element--half form__select sf-select--underlined"
              required
            >
              <SfSelectOption
                v-for="countryOption in countries"
                :key="countryOption.name"
                :value="countryOption.name"
              >
                {{ $t(countryOption.label) }}
              </SfSelectOption>
            </SfSelect>
            <SfSelect
              v-e2e="'shipping-state'"
              :value="formData.state"
              @input="state => changeShippingDetails('state', state)"
              :label="$t('State/Province')"
              name="state"
              class="form__element form__element--half form__select sf-select--underlined"
              required
              v-if="statesInSelectedCountry"
            >
              <SfSelectOption
                v-for="state in statesInSelectedCountry"
                :key="state"
                :value="state"
              >
                {{ state }}
              </SfSelectOption>
            </SfSelect>
            <SfInput
              v-e2e="'shipping-zipcode'"
              :value="formData.postalCode"
              @input="postalCode => changeShippingDetails('postalCode', postalCode)"
              :label="$t('Zip-code')"
              name="zipCode"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-e2e="'shipping-phone'"
              :value="formData.phone"
              @input="phone => changeShippingDetails('phone', phone)"
              :label="$t('Phone number')"
              name="phone"
              type="tel"
              class="form__element form__element--half"
              required
            />
          </div>
          <SfButton
            v-if="!canAddNewAddress"
            class="color-light form__action-button form__action-button--add-address"
            type="button"
            @click="handleAddNewAddressBtnClick"
          >
            {{ $t('Add new address') }}
          </SfButton>
          <div class="form">
            <div class="form__action">
              <SfButton
                class="form__action-button"
                type="submit"
                :disabled="!canMoveForward"
                v-if="enableMoveForward"
              >
                {{ $t('Select shipping method') }}
              </SfButton>
            </div>
          </div>
        </template>
        <div v-else class="form__element form__element--collect">
          <UserShippingCollect />
        </div>
      </template>
      <template v-if="isShippingDetailsStepCompleted">
        <VsfShippingProvider v-if="isDelivery" />
        <SfButton
          class="form__action-button"
          type="button"
          @click="handleContinueToPayment"
          :disabled="!canContinueToPayment"
        >
          {{ $t('Continue to payment') }}
        </SfButton>
      </template>
      <nuxt-link
        :to="localePath({ name: 'billing' })"
        class="sf-button sf-button--underlined form__back-button smartphone-only"
      >
        {{ $t('Go back') }}
      </nuxt-link>
    </form>
  </div>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfCheckbox,
  SfRadio,
  SfProperty,
  SfDivider
} from '@storefront-ui/vue';
import {
  useShippingProvider,
  useUserShipping,
  userShippingGetters,
  useUser,
  useShipping,
  useBilling,
  useChannel,
  cartGetters,
  useCart,
  useInventory
} from '@vsf-enterprise/commercetools';
import { ref, computed, useRouter, watch, useContext } from '@nuxtjs/composition-api';
import { useCheckoutAddresses, useDeliveryType, usePlaces } from '~/composables';
import CartProducts from '~/components/CartProducts';
import UserShippingCollect from '~/components/Checkout/UserShippingCollect';

export default {
  name: 'Shipping',
  components: {
    UserShippingCollect,
    CartProducts,
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    SfRadio,
    SfProperty,
    SfDivider,
    UserShippingAddresses: () => import('~/components/Checkout/UserShippingAddresses'),
    VsfShippingProvider: () => import('~/components/Checkout/VsfShippingProvider')
  },
  setup() {
    const router = useRouter();
    const { isAuthenticated } = useUser();
    const { state, loading: loadingShippingProvider } = useShippingProvider();

    const {
      formData,
      currentAddressId,
      canAddNewAddress,
      statesInSelectedCountry,
      handleAddNewAddressBtnClick,
      hasSavedAddresses,
      setAsDefault,
      canMoveForward,
      submitAddress,
      updateFormField,
      prepareAuthenticatedUserForm,
      setForm,
      countries
    } = useCheckoutAddresses('shipping', useShipping, useUserShipping, userShippingGetters);

    const {
      app: {
        localePath,
        context: {
          $vsf: {
            $ct: {
              config: {
                enableClickCollect
              }
            }
          }
        }
      }
    } = useContext();
    const { billing: billingDetails, load: loadBilling } = useBilling();
    const { channel: selectedChannel, channels, search: searchChannels } = useChannel();
    const { search: searchInventory, inventory } = useInventory('shipping');
    const { selectedPlace } = usePlaces();
    const { selected: selectedDeliveryType, change: changeDeliveryType } = useDeliveryType();
    const { cart } = useCart();
    const { saveCollectable, clear: clearShippingMethod } = useShipping();
    const sameAsBilling = ref(false);
    const isDelivery = computed(() => enableClickCollect ? selectedDeliveryType.value === 'delivery' : true);
    const isShippingDetailsStepCompleted = ref(selectedDeliveryType.value === 'collect');
    const isShippingMethodStepCompleted = computed(() => state.value && state.value._status);
    const unavailableProducts = computed(() => cartGetters.getUnavailableProducts(cart.value, inventory.value));
    const availableProducts = computed(() => cartGetters.getItems(cart.value));
    let oldShipping = null;

    const collectShippingFinished = computed(() => (
      selectedPlace.value?.address && unavailableProducts.value.length === 0 && availableProducts.value.length > 0
    ));

    const canContinueToPayment = computed(() =>
      isDelivery.value
        ? isShippingMethodStepCompleted.value && !loadingShippingProvider.value
        : collectShippingFinished.value
    );

    const handleCheckSameAddress = async () => {
      sameAsBilling.value = !sameAsBilling.value;
      if (sameAsBilling.value) {
        if (!billingDetails.value) {
          await loadBilling();
        }
        oldShipping = { ...formData.value };
        formData.value = { ...billingDetails.value };
        setAsDefault.value = false;
        canAddNewAddress.value = true;
        return;
      }
      formData.value = oldShipping;
    };

    const fetchInventory = () => {
      if (availableProducts.value.length > 0) {
        searchInventory({
          sku: availableProducts.value.map(p => p.variant.sku),
          supplyChannel: selectedChannel.value
        });
      }
    };

    const setCollectShippingMethod = async () => {
      await fetchInventory();

      if (collectShippingFinished.value) {
        await saveCollectable({
          shippingDetails: selectedPlace.value?.address
        });
      }
    };

    const handleContinueToPayment = async () => {
      if (!isDelivery.value) {
        await setCollectShippingMethod();
      }
      router.push(localePath({ name: 'payment' }));
    };

    const setSelectedDeliveryType = async (option) => {
      changeDeliveryType(option);
      isShippingDetailsStepCompleted.value = !isDelivery.value;
      await clearShippingMethod();

      if (!isDelivery.value && channels.value.length === 0) {
        await searchChannels();
      }
    };

    const handleAddressSubmit = async () => {
      await submitAddress();
      isShippingDetailsStepCompleted.value = true;
    };

    const changeShippingDetails = (field, value) => {
      updateFormField(field, value);
      isShippingDetailsStepCompleted.value = false;
    };

    const handleSetCurrentAddress = address => {
      setForm(address);
      isShippingDetailsStepCompleted.value = false;
      sameAsBilling.value = false;
    };

    const enableMoveForward = computed(() => !isShippingDetailsStepCompleted.value);

    watch(isAuthenticated, prepareAuthenticatedUserForm.bind(this, handleSetCurrentAddress), { immediate: true });
    watch([selectedChannel, cart], fetchInventory);

    return {
      formData,
      countries,
      setAsDefault,
      canAddNewAddress,
      currentAddressId,
      statesInSelectedCountry,
      hasSavedAddresses,
      handleAddressSubmit,
      handleAddNewAddressBtnClick,
      handleSetCurrentAddress,
      changeShippingDetails,
      isShippingDetailsStepCompleted,
      canMoveForward,
      handleCheckSameAddress,
      sameAsBilling,
      selectedDeliveryType,
      setSelectedDeliveryType,
      isDelivery,
      canContinueToPayment,
      enableClickCollect,
      handleContinueToPayment,
      enableMoveForward,
      availableProducts
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;
  &__select {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }

    ::v-deep .sf-select__label {
      left: initial;
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
    justify-content: space-between;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
      margin: 0 0 var(--spacer-sm) 0;
      ::v-deep &.sf-checkbox {
        margin: 0 0 var(--spacer-lg) 0
      }
    }
    &--half {
      @include for-desktop {
        flex: 0 1 calc(50% - var(--spacer-xl) / 2);
      }
    }
    &--collect {
      margin-bottom: var(--spacer-base);
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    width: 100%;
    @include for-desktop {
      width: 25rem;
    }
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }
    &--add-address {
      width: 100%;
      margin: 0 0 var(--spacer-sm) 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-sm) 0 var(--spacer-xl);
    width: 100%;
    &:hover {
      color: var(--c-white);
    }
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
.divider {
  --divider-margin: 0 0 var(--spacer-xl) 0;
}
</style>
