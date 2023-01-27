import { ShippingMethod } from '@vsf-enterprise/commercetools-types';

export default (shippingMethod: ShippingMethod, total: number) => {
  if (shippingMethod?.zoneRates && shippingMethod?.zoneRates.length > 0) {
    const { price: initialPrice, freeAbove: freeAbovePrice } = shippingMethod?.zoneRates[0].shippingRates[0];
    const calculatedTotal = total - (initialPrice.centAmount / 100);
    const freeAbove = freeAbovePrice?.centAmount / 100;
    const price = initialPrice.centAmount / 100;
    if ((calculatedTotal >= freeAbove && calculatedTotal + price >= freeAbove) || calculatedTotal + price > freeAbove) {
      return 0;
    }
    return price;
  }
  return 0;
};
