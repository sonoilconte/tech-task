import page from '../pages/factory';

context(['cart', 'category', 'product', 'regression'], '[Cart]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-cart').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should successfully add product to cart - Category grid view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.addToCartButton(data.product.name).click();
    category.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
    page.components.cart.increaseQtyButton().click();
    cy.wait(1000);
    page.components.notification.container.contains(data.quantityChanged).should('be.visible');
    // I've no idea how to verify quantity which is not visible in code at all
    // page.components.cart.quantity().should('contain', 2);
  });

  it('Should successfully add product to cart - Category grid view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.addToCartButton(data.product.name).click();
    category.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
    page.components.cart.increaseQtyButton().click();
    cy.wait(500);
    page.components.cart.increaseQtyButton().click();
    cy.wait(500);
    page.components.cart.decreaseQtyButton().click();
    cy.wait(500);
    page.components.cart.decreaseQtyButton().click();
    cy.wait(500);
    page.components.notification.container.contains(data.quantityChanged).should('be.visible');
    // I've no idea how to verify quantity which is not visible in code at all
    // page.components.cart.quantity().should('contain', 1);
  });
});
