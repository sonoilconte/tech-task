import { UseUserShipping, UseUserBilling, UserShippingGetters, UserBillingGetters } from '@vue-storefront/core';
import { User, BillingAddress, ShippingAddress } from '@vsf-enterprise/commercetools-api';

export type AddressType = 'shipping' | 'billing';
export type AddressComposable = () => UseUserBilling<User, BillingAddress> & UseUserShipping<User, ShippingAddress>;
export type AddressesGetters = UserShippingGetters<User, ShippingAddress> & UserBillingGetters<User, BillingAddress>;
