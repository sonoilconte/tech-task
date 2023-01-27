<template>
  <form
      id="shipping-details-form"
      class="form"
      @submit.prevent="submitForm"
    >
      <div class="form__horizontal">
        <div class="form__element">
          <SfInput
            v-model="form.firstName"
            name="firstName"
            :label="$t('First name')"
            required
          />
        </div>
        <div class="form__element">
          <SfInput
            v-model="form.lastName"
            name="lastName"
            :label="$t('Last name')"
            required
          />
        </div>
      </div>
      <div class="form__element">
        <SfInput
          v-model="form.streetName"
          name="streetName"
          :label="$t('Street name')"
          required
        />
      </div>
      <div class="form__element">
        <SfInput
          v-model="form.streetNumber"
          name="apartment"
          :label="$t('House/Apartment number')"
          required
        />
      </div>
      <div class="form__horizontal">
        <div class="form__element">
          <SfInput
            v-model="form.city"
            name="city"
            :label="$t('City')"
            required
          />
        </div>
        <div class="form__element">
          <SfSelect
            class="form__select sf-select--underlined"
            v-model="form.country"
            name="country"
            :label="$t('Country')"
            required
          >
            <SfSelectOption
              v-for="{ name, label } in countries"
              :key="name"
              :value="name"
            >
              {{ $t(label) }}
            </SfSelectOption>
          </SfSelect>
        </div>
      </div>
      <div class="form__horizontal">
        <SfSelect
          v-model="form.state"
          :label="$t('State/Province')"
          name="state"
          class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
          required
          :disabled="!statesInSelectedCountry"
          :key="`state-key-${statesInSelectedCountry}`"
        >
          <SfSelectOption
            v-for="state in statesInSelectedCountry"
            :key="state"
            :value="state"
          >
            {{ state }}
          </SfSelectOption>
        </SfSelect>
        <div class="form__element">
          <SfInput
            v-model="form.postalCode"
            name="zipCode"
            :label="$t('Zip-code')"
            required
          />
        </div>
      </div>
      <div class="form__element">
        <SfInput
          v-model="form.phone"
          name="phone"
          type="tel"
          :label="$t('Phone number')"
          required
        />
      </div>
      <SfCheckbox
        v-model="form.isDefault"
        name="isDefault"
        :label="$t('Set as default')"
        class="form__checkbox-isDefault"
      />
      <SfButton
        class="form__button"
        :aria-label="$t('Submit the address form')"
        type="submit"
        :disabled="isSubmitDisabled"
      >
        {{ isNew ? $t('Add the address') : $t('Update the address') }}
      </SfButton>
  </form>
</template>

<script>
import {
  SfInput,
  SfButton,
  SfSelect,
  SfCheckbox
} from '@storefront-ui/vue';
import { reactive, computed, watch } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { userShippingGetters } from '@vsf-enterprise/commercetools';

export default {
  name: 'ShippingAddressForm',

  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox
  },

  props: {
    address: {
      type: Object,
      default: () => ({
        id: undefined,
        firstName: '',
        lastName: '',
        streetName: '',
        streetNumber: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false
      })
    },
    isNew: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const { $ct: { config } } = useVSFContext();
    const form = reactive({
      id: props.address.id,
      firstName: props.address.firstName,
      lastName: props.address.lastName,
      streetName: props.address.streetName,
      streetNumber: props.address.streetNumber,
      city: props.address.city,
      state: props.address.state,
      postalCode: props.address.postalCode,
      country: props.address.country,
      phone: props.address.phone,
      isDefault: userShippingGetters.isDefault(props.address)
    });

    const statesInSelectedCountry = computed(() => {
      if (!form.country) return null;
      const selectedCountry = config.countries.find(country => country.name === form.country);
      return selectedCountry && selectedCountry.states;
    });

    const isSubmitDisabled = computed(() => {
      const requiredFields = ['firstName', 'lastName', 'streetName', 'streetNumber', 'city', 'country', 'postalCode', 'phone'];
      return requiredFields.some(field => !form[field]) || (statesInSelectedCountry.value && !form.state);
    });

    const submitForm = () => {
      emit('submit', form);
    };

    watch(statesInSelectedCountry, _statesInSelectedCountry => {
      const countryHasStates = _statesInSelectedCountry && _statesInSelectedCountry.length;
      if (!countryHasStates && form.state) {
        form.state = null;
      }
    });

    return {
      form,
      submitForm,
      countries: config.countries,
      statesInSelectedCountry,
      isSubmitDisabled
    };
  }
};
</script>

<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin-bottom: var(--spacer-base);
  }
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    flex-wrap: wrap;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    display: block;
    margin-top: var(--spacer-lg);
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
