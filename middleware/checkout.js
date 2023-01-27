import {
  strategyManager,
  strategyCustomer,
  strategyBilling,
  strategyShiping,
  strategyPayment,
  strategyThankYou
} from './checkout/strategies';

const steps = {
  customer: 'customer',
  billing: 'billing',
  shipping: 'shipping',
  payment: 'payment',
  thankYou: 'thank-you'
};
const checkoutStrategies = {
  [steps.customer]: strategyCustomer,
  [steps.billing]: strategyBilling,
  [steps.shipping]: strategyShiping,
  [steps.payment]: strategyPayment,
  [steps.thankYou]: strategyThankYou
};

const canEnterPayment = cart => cart && cart.shippingInfo && cart.shippingAddress;
const canEnterBilling = cart => cart && (cart.customerEmail || cart.customerId);
const canEnterShipping = cart => cart && Boolean(cart.billingAddress);
const hasItemsInCart = cart => cart && cart.lineItems.length;

export default async ({ localePath, getRouteBaseName, $vsf: { $ct }, route, redirect }) => {
  const currentPath = getRouteBaseName(route);
  const isLoggedIn = await $ct.api.isLoggedIn();
  const savedCheckoutStep = process.client && localStorage.getItem('checkoutStep');

  const setCheckoutStep = step => {
    if (process.client && savedCheckoutStep !== step) {
      localStorage.setItem('checkoutStep', step);
    }
  };
  const resetCheckoutStep = () => process.client && localStorage.removeItem('checkoutStep');

  const { data } = await $ct.api.getMe();
  const { activeCart } = data?.me;

  if (currentPath !== steps.thankYou && !hasItemsInCart(activeCart)) {
    return redirect(localePath({ name: 'cart' }));
  }
  if (currentPath === 'checkout') {
    return redirect(localePath({ name: savedCheckoutStep || steps.billing }));
  }

  strategyManager.setStrategy(checkoutStrategies[currentPath]);

  return strategyManager.execute({
    $ct,
    isLoggedIn,
    redirect,
    localePath,
    setCheckoutStep,
    savedCheckoutStep,
    steps,
    canEnterBilling,
    activeCart,
    canEnterShipping,
    canEnterPayment,
    resetCheckoutStep
  });
};
