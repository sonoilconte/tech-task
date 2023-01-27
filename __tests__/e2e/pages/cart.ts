import Header from './components/header';

export default class Cart {

  get path(): string {
    return '/cart';
  }

  get header() {
    return Header;
  }

  visit(): Cypress.Chainable {
    return cy.visit(this.path);
  }

}
