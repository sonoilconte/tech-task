import { LocaleItem, User, BillingAddress, ShippingAddress } from '@vsf-enterprise/commercetools-api';
import { Address } from '@vsf-enterprise/commercetools-types';
import { UseShipping, UseBilling, UseUserShipping, UseUserBilling, UserShippingGetters, UserBillingGetters } from '@vue-storefront/core';

export type CheckoutStep = 'shipping' | 'billing';
export type CartAddressComposable = () => UseBilling<Address, any> & UseShipping<Address, any>;
export type UserAddressComposable = () => UseUserBilling<User, BillingAddress> & UseUserShipping<User, ShippingAddress>;
export type UserAddressesGetters = UserShippingGetters<User, ShippingAddress> & UserBillingGetters<User, BillingAddress>;
export type SetCurrentAddress = (address: Address) => void;
export interface Country extends LocaleItem {
  states: string[]
}
