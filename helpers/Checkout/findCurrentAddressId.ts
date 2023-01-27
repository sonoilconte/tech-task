import { Address } from '@vsf-enterprise/commercetools-types';

const FIELD_WHITELIST = ['firstName', 'lastName', 'streetName', 'streetNumber', 'city', 'country', 'state', 'postalCode', 'phone'];

const compareAddresses = (address1: Address, address2: Address) =>
  !FIELD_WHITELIST.some(field => address1[field]?.trim() !== address2[field]?.trim());

export default (savedUserAddresses: Address[], currentFormAddress: Address, defaultAddressId: string) => {
  if (savedUserAddresses) {
    for (const shippingAddress of savedUserAddresses) {
      if (compareAddresses(shippingAddress, currentFormAddress)) {
        return shippingAddress.id;
      }
    }
  }
  return defaultAddressId;
};
