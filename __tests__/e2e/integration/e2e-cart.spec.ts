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
  });

  it('Should successfully add product to cart - Category list view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.changeView('list');
    category.addToCartButton(data.product.name).click();
    category.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
  });

  it('Should successfully add product to cart - Product details page', function() {
    const data = this.fixtures.data[this.test.title];
    page.product(data.product.slug, data.product.id).visit();
    page.product().addToCartButton.click();
    page.product().header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
  });

  it('Should remove (single + all products) from cart', function() {
    const data = this.fixtures.data[this.test.title];
    const category1 = page.category(data.product1.category1);
    const category2 = page.category(data.product2.category2);
    category1.visit();
    category1.addToCartButton(data.product1.name).click();
    page.components.notification.container.contains(data.cartNotifications.productAdded).should('be.visible');
    category2.addToCartButton(data.product2.name).click();
    page.components.notification.container.contains(data.cartNotifications.productAdded).should('be.visible');
    category2.header.openCart();
    page.components.cart.product(data.product1.name).should('be.visible'), { timeout: 1000 };
    page.components.cart.product(data.product2.name).should('be.visible'), { timeout: 3000 };
    page.components.cart.removeProduct(data.product1.name);
    page.components.cart.product(data.product1.name).should('not.exist');
    page.components.cart.removeProduct(data.product2.name);
    page.components.cart.product(data.product2.name).should('not.exist');
    page.components.cart.yourCartIsEmptyHeading.should('be.visible');
  });
});
