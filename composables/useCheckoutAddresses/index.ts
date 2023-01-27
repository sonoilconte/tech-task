import { ref, onMounted, watch, computed, Ref, ComputedRef } from '@nuxtjs/composition-api';
import { useUser } from '@vsf-enterprise/commercetools';
import { useVSFContext } from '@vue-storefront/core';
import { Address } from '@vsf-enterprise/commercetools-types';
import findCurrentAddressId from '~/helpers/Checkout/findCurrentAddressId';
import {
  CheckoutStep,
  CartAddressComposable,
  UserAddressComposable,
  UserAddressesGetters,
  Country,
  SetCurrentAddress
} from './types';

const NOT_SELECTED_ADDRESS = '';

const useCheckoutAddresses = (
  checkoutStep: CheckoutStep,
  cartAddressComposable: CartAddressComposable,
  userAddressesComposable: UserAddressComposable,
  userAddressesGetters: UserAddressesGetters
) => {
  const {
    [checkoutStep]: cartAddress,
    load: loadCartAddress,
    loading: isCartAddressLoading,
    save: saveCartAddress
  } = cartAddressComposable();
  const { [checkoutStep]: userAddresses, setDefaultAddress } = userAddressesComposable();
  const { isAuthenticated } = useUser();
  const { $ct: { config: { countries } } } = useVSFContext();

  const formData: Ref<Address> = ref((cartAddress.value || {}) as Address);
  const canAddNewAddress: Ref<boolean> = ref(true);
  const setAsDefault: Ref<boolean> = ref(false);

  const addresses: ComputedRef<Address[]> = computed(() =>
    userAddressesGetters.getAddresses(userAddresses.value));
  const currentAddressId: ComputedRef<string> = computed(() =>
    findCurrentAddressId(addresses.value, formData.value, NOT_SELECTED_ADDRESS));
  const isCountrySelected: ComputedRef<Country> = computed(() => countries.find(country => country.name === formData.value.country));
  const statesInSelectedCountry: ComputedRef<string[]> = computed(() => {
    if (!formData.value.country) return null;
    return isCountrySelected.value && isCountrySelected.value.states;
  });
  const isStateSelected: ComputedRef<boolean> = computed(() =>
    Boolean(statesInSelectedCountry.value?.length) && Boolean(formData.value.state)
  );
  const canMoveForward: ComputedRef<boolean> = computed(() => {
    if (statesInSelectedCountry.value?.length) {
      return isStateSelected.value;
    }
    return !isCartAddressLoading.value && Boolean(isCountrySelected.value) && formData.value && Boolean(Object.keys(formData.value).length);
  });
  const hasSavedAddresses: ComputedRef<boolean> = computed(() => {
    if (!isAuthenticated.value || !userAddresses.value) return false;
    const addresses = userAddressesGetters.getAddresses(userAddresses.value);
    return Boolean(addresses?.length);
  });

  const setForm = (address: Address) => {
    formData.value = { ...address };
    canAddNewAddress.value = false;
  };
  const updateFormField = (field: string, value: string) => {
    formData.value = {
      ...formData.value,
      [field]: value
    };
  };
  const handleAddNewAddressBtnClick = () => {
    canAddNewAddress.value = true;
  };
  const updateStateOnCountryChange = (statesInSelectedCountry: string[]) => {
    const countryHasStates = statesInSelectedCountry && statesInSelectedCountry.length;
    if (!countryHasStates && formData.value.state) {
      formData.value.state = null;
    }
  };
  const submitAddress = async () => {
    const addressId = currentAddressId.value;
    const paramName = `${checkoutStep}Details`;
    // @ts-ignore
    await saveCartAddress({ [paramName]: formData.value });
    if (addressId !== NOT_SELECTED_ADDRESS && setAsDefault.value) {
      const chosenAddress = userAddressesGetters.getAddresses(userAddresses.value, { id: addressId });
      if (chosenAddress && chosenAddress.length) {
        await setDefaultAddress({ address: chosenAddress[0] });
      }
    }
  };
  const selectDefaultAddress = (setCurrentAddress: SetCurrentAddress) => {
    const defaultAddress = userAddressesGetters.getAddresses(userAddresses.value, { isDefault: true });
    if (defaultAddress && defaultAddress.length) {
      setCurrentAddress(defaultAddress[0]);
    }
  };
  const prepareAuthenticatedUserForm = async (setCurrentAddress: SetCurrentAddress) => {
    if (process.server) return;

    if (!addresses.value || !addresses.value.length) return;
    const hasEmptyForm = !formData.value || Object.keys(formData.value).length === 0;

    if (hasEmptyForm) {
      selectDefaultAddress(setCurrentAddress);
      return;
    }
    if (currentAddressId.value !== NOT_SELECTED_ADDRESS) canAddNewAddress.value = false;
  };

  watch(cartAddress, newCartAddress => {
    formData.value = (newCartAddress || {} as Address);
  });
  watch(statesInSelectedCountry, updateStateOnCountryChange);

  onMounted(async () => {
    await loadCartAddress();
  });

  return {
    countries,
    formData,
    addresses,
    canMoveForward,
    setAsDefault,
    currentAddressId,
    canAddNewAddress,
    statesInSelectedCountry,
    handleAddNewAddressBtnClick,
    hasSavedAddresses,
    submitAddress,
    updateFormField,
    prepareAuthenticatedUserForm,
    setForm,
    isCountrySelected
  };
};

export default useCheckoutAddresses;
