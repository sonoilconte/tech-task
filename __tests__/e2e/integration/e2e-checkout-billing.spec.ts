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
    cy.get('#firstName', {timeout: 500}).should('be.visible');
    cy.get('#lastName', {timeout: 500}).should('be.visible');
    cy.get('#streetName', {timeout: 500}).should('be.visible');
    cy.get('#apartment', {timeout: 500}).should('be.visible');
    cy.get('#city', {timeout: 500}).should('be.visible');
    cy.get('#Country', {timeout: 500}).should('be.visible');
    cy.get('#zipCode', {timeout: 500}).should('be.visible');
    cy.get('#phone', {timeout: 500}).should('be.visible');
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
