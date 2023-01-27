import page from '../pages/factory';

context(['cart', 'category', 'product', 'regression'], '[Cart]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-make-order').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should add product to cart', function() {
    const data = this.fixtures.data[this.test.title];
    const category1 = page.category(data.product1.category1);
    const category2 = page.category(data.product2.category2);
    category1.visit();
    category1.addToCartButton(data.product1.name).click();
    page.components.notification.container.contains(data.cartNotifications.productAdded).should('be.visible');
    category2.header.openCart();
    page.components.cart.product(data.product1.name).should('be.visible'), { timeout: 1000 };
    page.components.cart.goToCheckoutButton.click();

    cy.get('.sf-steps__title', { timeout: 5000 }).should('be.visible');
    cy.get('#email', { timeout: 500 }).should('be.visible');

    cy.get('#email', { timeout: 500 }).type('jankowalski123@gmail.com');
    cy.get('.customer>form [type="submit"]', { timeout: 500 }).click();

    page.checkout.billing.fillForm(data.customer);
    page.checkout.shipping.continueToShippingButton.click();
    page.checkout.shipping.heading.should('be.visible');
    page.checkout.shipping.deliveryOption.click();

    page.checkout.billing.copyAddressLabel.click();
    page.checkout.shipping.selectShippingButton.click();
    page.checkout.billing.continueToPaymentButton.click();
    page.checkout.payment.billingAddressHeader.should('be.visible');

    page.checkout.payment.paymentMethods.first().click();
    page.checkout.payment.terms.click();
    page.checkout.payment.makeAnOrderButton.click();
    page.checkout.thankyou.heading.should('be.visible');

  });
});
