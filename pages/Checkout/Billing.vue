<template>
  <div>
    <SfHeading
      :level="3"
      :title="$t('Billing address')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleAddressSubmit">
      <UserBillingAddresses
        v-if="hasSavedAddresses"
        v-model="setAsDefault"
        :currentAddressId="currentAddressId"
        @setCurrentAddress="handleSetCurrentAddress"
      />
      <div class="form" v-if="canAddNewAddress">
        <SfInput
          v-e2e="'billing-firstName'"
          :value="formData.firstName"
          @input="firstName => updateFormField('firstName', firstName)"
          :label="$t('First name')"
          name="firstName"
          class="form__element form__element--half"
          required
        />
        <SfInput
          v-e2e="'billing-lastName'"
          :value="formData.lastName"
          @input="lastName => updateFormField('lastName', lastName)"
          :label="$t('Last name')"
          name="lastName"
          class="form__element form__element--half"
          required
        />
        <SfInput
          v-e2e="'billing-streetName'"
          :value="formData.streetName"
          @input="streetName => updateFormField('streetName', streetName)"
          :label="$t('Street name')"
          name="streetName"
          class="form__element form__element--half"
          required
        />
        <SfInput
          v-e2e="'billing-streetNumber'"
          :value="formData.streetNumber"
          @input="streetNumber => updateFormField('streetNumber', streetNumber)"
          :label="$t('House/Apartment number')"
          name="apartment"
          class="form__element form__element--half"
          required
        />
        <SfInput
          v-e2e="'billing-city'"
          :value="formData.city"
          @input="city => updateFormField('city', city)"
          :label="$t('City')"
          name="city"
          class="form__element form__element--half"
          required
        />
        <SfSelect
          v-e2e="'billing-country'"
          :value="formData.country"
          @input="country => updateFormField('country', country)"
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
          v-e2e="'billing-state'"
          :value="formData.state"
          @input="state => updateFormField('state', state)"
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
          v-e2e="'billing-zipcode'"
          :value="formData.postalCode"
          @input="postalCode => updateFormField('postalCode', postalCode)"
          :label="$t('Zip-code')"
          name="zipCode"
          class="form__element form__element--half"
          required
        />
        <SfInput
          type="tel"
          v-e2e="'billing-phone'"
          :value="formData.phone"
          @input="phone => updateFormField('phone', phone)"
          :label="$t('Phone number')"
          name="phone"
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
          >
            {{ $t('Continue to shipping') }}
          </SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect
} from '@storefront-ui/vue';
import { useUserBilling, userBillingGetters, useUser, useBilling } from '@vsf-enterprise/commercetools';
import { watch, useRouter, useContext } from '@nuxtjs/composition-api';
import { useCheckoutAddresses } from '~/composables';

export default {
  name: 'Billing',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    UserBillingAddresses: () => import('@/components/Checkout/UserBillingAddresses')
  },
  setup() {
    const { app: { localePath } } = useContext();
    const router = useRouter();
    const { isAuthenticated } = useUser();
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
    } = useCheckoutAddresses('billing', useBilling, useUserBilling, userBillingGetters);

    const handleAddressSubmit = async () => {
      await submitAddress();
      router.push(localePath({ name: 'shipping' }));
    };

    const handleSetCurrentAddress = address => {
      setForm(address);
    };

    watch(isAuthenticated, prepareAuthenticatedUserForm.bind(this, handleSetCurrentAddress), { immediate: true });

    return {
      formData,
      countries,
      setAsDefault,
      canAddNewAddress,
      currentAddressId,
      hasSavedAddresses,
      handleAddressSubmit,
      handleAddNewAddressBtnClick,
      handleSetCurrentAddress,
      updateFormField,
      statesInSelectedCountry,
      canMoveForward
    };
  }
};
</script>
<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
.form {
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
    justify-content: space-between;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 0 1 calc(50% - var(--spacer-xl) / 2);
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    margin: var(--spacer-sm) 0 var(--spacer-xl);
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
     &--add-address {
      width: 100%;
      margin: 0 0 var(--spacer-sm) 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
}
</style>
