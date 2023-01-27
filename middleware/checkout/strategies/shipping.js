const strategyShiping = {
  execute ({
    canEnterShipping,
    setCheckoutStep,
    redirect,
    localePath,
    steps,
    activeCart
  }) {
    if (!canEnterShipping(activeCart)) {
      setCheckoutStep(steps.billing);
      return redirect(localePath({ name: steps.billing }));
    }
    setCheckoutStep(steps.shipping);
  }
};

export default strategyShiping;
