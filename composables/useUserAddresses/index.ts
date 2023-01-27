import { computed, ref, Ref, ComputedRef } from '@nuxtjs/composition-api';
import { Address } from '@vsf-enterprise/commercetools-types';
import { AddressType, AddressComposable, AddressesGetters } from './types';

const useUserAddresses = (
  addressType: AddressType,
  addressesComposable: AddressComposable,
  addressesGetters: AddressesGetters
) => {
  const { [addressType]: data, deleteAddress, addAddress, updateAddress } = addressesComposable();

  const editingAddress: Ref<boolean> = ref(false);
  const activeAddress: Ref<Address> = ref(undefined);

  const addresses: ComputedRef<Address[]> = computed(() => addressesGetters.getAddresses(data.value));
  const isNewAddress: ComputedRef<boolean> = computed(() => !activeAddress.value);

  const changeAddress = (address: Address = undefined) => {
    activeAddress.value = address;
    editingAddress.value = true;
  };
  const saveAddress = async (address: Address) => {
    if (isNewAddress.value) {
      await addAddress({ address });
    } else {
      await updateAddress({ address });
    }
    editingAddress.value = false;
    activeAddress.value = undefined;
  };
  const removeAddress = (address: Address) => deleteAddress({ address });

  return {
    editingAddress,
    activeAddress,
    addresses,
    isNewAddress,
    changeAddress,
    saveAddress,
    removeAddress
  };
};

export default useUserAddresses;
