import requests, { CreateCartResponse } from '../api/requests';
import page from '../pages/factory';

context(['checkout', 'regression'], '[Checkout] Access guard', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-checkout-access-guard').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should successfully redirect to empty cart page - shipping and billing address are not set', function () {
    page.checkout.payment.visit();
    // cy.url().should('equal', `${Cypress.config('baseUrl')}${page.home.path}`);
    cy.url().should('contain', page.checkout.cart.path);
  });

  it('Shouldnt visit payment page - shipping and billing address are set', function () {
    const data = this.fixtures.data[this.test.title];
    requests.createCart().then((response: CreateCartResponse) => {
      requests.addToCart(response.body.data.cart.id, data.product);
      requests.updateCart(response.body.data.cart.id, { addresses: { shipping: data.customer.address.shipping, billing: data.customer.address.billing }});
    });
    page.checkout.payment.visit();
    cy.url().should('contain', page.checkout.cart.path);
  });

});
