import requests, { CreateWishlistResponse } from '../api/requests';
import page from '../pages/factory';

context(['regression', 'w'], '[Wishlist]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-wishlist').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should successfully add product to wishlist - Category grid view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.wishlistIcon(data.product.name).click();
    category.header.openWishlist();
    page.components.wishlist.product(data.product.name).should('be.visible');
  });

  it('Should successfully add product to wishlist - Category list view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.changeView('list');
    category.wishlistIcon(data.product.name).click();
    category.header.openWishlist();
    page.components.wishlist.product(data.product.name).should('be.visible');
  });

  it('Should successfully remove product from wishlist - Category page', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    requests.createWishlist().then((response: CreateWishlistResponse) => {
      requests.addToWishlist(response.body.data.wishlist.id, data.product);
    });
    category.visit();
    category.wishlistIcon(data.product.name);
    category.header.openWishlist();
    page.components.wishlist.yourBagIsEmptyHeading.should('be.visible');
  });
});

context(['cart', 'category', 'product', 'regression'], '[Cart]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-wishlist').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should display wishlist badge', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.wishlistIcon(data.product.name).click();
    page.home.header.wishlistBadge.should('be.visible');
  });

  it('Should successfully remove product from wishlist - Wishlist sidebar', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.wishlistIcon(data.product.name).click();
    page.home.header.wishlistBadge.should('be.visible');
    page.home.header.openWishlist();
    page.components.wishlist.removeProduct(data.product.name);
    page.components.wishlist.yourBagIsEmptyHeading.should('be.visible');
  });
});
