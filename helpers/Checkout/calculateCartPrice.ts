import { priceTransform } from '@vsf-enterprise/commercetools';
import getShippingMethodPrice from './getShippingMethodPrice';

export default (cart, totals, price, calculate = false) => {
  const shippingMethod = cart || cart.value?.shippingInfo?.shippingMethod;
  const priceWithDiscount =
    getShippingMethodPrice(shippingMethod, totals.value.special) === 0 &&
    shippingMethod?.zoneRates &&
    !calculate;
  const shippingPrice =
    shippingMethod.zoneRates &&
    shippingMethod.zoneRates[0].shippingRates[0].price.centAmount / 100;
  return priceTransform(
    priceWithDiscount ? (price || shippingPrice) - shippingPrice : price,
    cart.value?.totalPrice?.currencyCode || null
  );
};
