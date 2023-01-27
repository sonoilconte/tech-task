/*
import page from '../pages/factory';
import generator from '../utils/data';
import requests from '../api/requests';

context(['cart', 'category', 'product', 'regression', 'auth', 'regression'], '[Cart, Authentication User login]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-carts-merging2').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should merge cart', function () {
    const data = this.fixtures.data[this.test.title];
    const category1 = page.category(data.product1.category1);
    const category2 = page.category(data.product2.category2);
    category1.visit();
    cy.clearLocalStorage();
    cy.clearCookies();
    category1.addToCartButton(data.product1.name).click();
    page.components.notification.container.contains(data.cartNotifications.productAdded).should('be.visible').then(() => {
      cy.wait(2000);
      category2.header.openCart();
      // page.components.notification.container.contains(data.cartNotifications.productAdded).should('not.be.visible');
      cy.wait(5000);
      data.customer.email = generator.email();
      requests.customerSignMeUp(data.customer);
      page.home.header.openLoginModal();
      page.components.loginModal.loginToAccountButton.click();
      cy.get('[data-e2e="login-modal-email"]', { timeout: 500 });
      cy.get('.sf-fade-leave-active', { timeout: 500 }).should('not.exist');
      page.components.loginModal.fillForm(data.customer);
      page.components.loginModal.loginButton.click();
      page.components.notification.container.should('be.visible');
      page.components.loginModal.container.should('not.exist');
      // page.components.notification.container.should('not.be.visible');
      cy.reload();
      cy.wait(5000);
      category2.header.openCart();

      category2.addToCartButton(data.product2.name).click();
      // page.components.notification.container.contains(data.cartNotifications.productAdded).should('not.be.visible');
      cy.wait(5000);
      category2.header.openCart();
      page.components.cart.product(data.product1.name).should('be.visible'), {timeout: 1000};
      page.components.cart.product(data.product2.name).should('be.visible'), {timeout: 3000};
    });
  });

});
*/
