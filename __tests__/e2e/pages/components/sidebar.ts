export class Sidebar {

  get yourBagIsEmptyHeading(): Cypress.Chainable {
    return cy.contains('Your wishlist is empty');
  }

}
