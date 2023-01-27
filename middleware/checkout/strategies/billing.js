const strategyBilling = {
  execute ({
    $ct,
    setCheckoutStep,
    redirect,
    localePath,
    steps,
    savedCheckoutStep,
    canEnterBilling,
    activeCart
  }) {
    setCheckoutStep(steps.billing);
    if ($ct.config.enableCustomerCheckoutStep && !canEnterBilling(activeCart)) {
      setCheckoutStep(steps.customer);
      return redirect(localePath({ name: steps.customer }));
    }
    if (!$ct.config.enableCustomerCheckoutStep && savedCheckoutStep !== steps.billing) {
      return redirect(localePath({ name: savedCheckoutStep }));
    }
    if (savedCheckoutStep !== steps.billing) {
      setCheckoutStep(savedCheckoutStep);
    }
  }
};

export default strategyBilling;
