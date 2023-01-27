const strategyPayment = {
  execute ({
    canEnterPayment,
    canEnterShipping,
    setCheckoutStep,
    redirect,
    localePath,
    steps,
    activeCart
  }) {
    if (!canEnterPayment(activeCart)) {
      setCheckoutStep(steps.shipping);
      return redirect(localePath({ name: steps.shipping }));
    }
    if (!canEnterShipping(activeCart)) {
      setCheckoutStep(steps.billing);
      return redirect(localePath({ name: steps.billing }));
    }
    setCheckoutStep(steps.payment);
  }
};

export default strategyPayment;
