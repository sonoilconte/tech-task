import page from '../pages/factory';

context(['cart', 'category', 'product', 'regression'], '[Cart]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-make-order').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should add product to cart', function () {
    const data = this.fixtures.data[this.test.title];
    const category1 = page.category(data.product1.category1);
    const category2 = page.category(data.product2.category2);
    category1.visit();
    category1.addToCartButton(data.product1.name).click();
    page.components.notification.container.contains(data.cartNotifications.productAdded).should('be.visible');
    category2.header.openCart();
    page.components.cart.product(data.product1.name).should('be.visible'), {timeout: 1000};
    page.components.cart.goToCheckoutButton.click();
    cy.get('.sf-steps__title', {timeout: 5000}).should('be.visible');
    cy.get('#email', {timeout: 500}).should('be.visible');
    cy.get('#email', {timeout: 500}).type('jankowalski123@gmail.com');
    cy.get('.customer>form [type="submit"]', {timeout: 500}).click();

    page.checkout.billing.firstName.should('be.visible');
    page.checkout.billing.lastName.should('be.visible');
    page.checkout.billing.streetName.should('be.visible');
    cy.get('#apartment', {timeout: 500}).should('be.visible');
    page.checkout.billing.city.should('be.visible');
    page.checkout.billing.country.should('be.visible');
    page.checkout.billing.postalCode.should('be.visible');
    page.checkout.billing.phone.should('be.visible');

    page.checkout.billing.fillForm(data.customer);
    page.checkout.shipping.continueToShippingButton.click();
    page.checkout.shipping.heading.should('be.visible');
    page.checkout.shipping.deliveryOption.click();
    page.checkout.billing.copyAddressLabel.click();

    page.checkout.shipping.firstName.should('be.visible');
    page.checkout.shipping.lastName.should('be.visible');
    page.checkout.shipping.streetName.should('be.visible');
    cy.get('#apartment', {timeout: 500}).should('be.visible');
    page.checkout.shipping.city.should('be.visible');
    page.checkout.shipping.country.should('be.visible');
    page.checkout.shipping.postalCode.should('be.visible');
    page.checkout.shipping.phone.should('be.visible');

    page.checkout.shipping.selectShippingButton.click();
    page.checkout.billing.continueToPaymentButton.click();
    page.checkout.payment.billingAddressHeader.should('be.visible');

  });
});
