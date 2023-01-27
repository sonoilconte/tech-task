const strategyCustomer = {
  execute ({ isLoggedIn, setCheckoutStep, redirect, localePath, steps, savedCheckoutStep }) {
    if (isLoggedIn) {
      setCheckoutStep(steps.billing);
      return redirect(localePath({ name: savedCheckoutStep }));
    }
    setCheckoutStep(steps.customer);
    if (savedCheckoutStep !== steps.customer) {
      return redirect(localePath({ name: savedCheckoutStep }));
    }
  }
};

export default strategyCustomer;
