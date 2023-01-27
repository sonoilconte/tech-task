import requests from '../api/requests';
import page from '../pages/factory';
import generator from '../utils/data';

context(['billing-details', 'my-account', 'regression'], '[MyAccount] Billing details', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-my-account-billing-details').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });
  it('Should successfully add new address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    requests.customerSignMeUp(data.customer);
    page.myAccount.billingDetails.visit();

    page.home.header.account.click();
    page.myAccount.myProfile.heading.should('be.visible');
    cy.get('.sf-content-pages__sidebar button[data-testid="Billing details"]').click();
    cy.get('.sf-content-page.display-none', { timeout: 5000 }).should('not.be.visible');
    cy.get('.sf-tabs__content__tab .action-button').should('be.visible');
    page.myAccount.billingDetails.addNewAddressButton.click({force: true, multiple: true});
    cy.get('.action-button').first().click({force: true, multiple: true});

    cy.get('.sf-content-category .sf-content-page:nth-child(3) #firstName', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #lastName', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #streetName', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #apartment', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #city', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #Country').select('Austria');

    cy.get('.sf-content-category .sf-content-page:nth-child(3) #zipCode', {timeout: 5000}).type('AAAAAAAAAAA', {force: true});
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #phone', {timeout: 5000}).type('1234567890', {force: true});
    cy.get('button[type="submit"]').click({force: true, multiple: true });
    page.myAccount.billingDetails.address.should('be.visible');
    cy.get('.billing__address').contains('AAAAAAAAAAA').should('be.visible');

    /* Update address - notification with error
    cy.get('.sf-content-page:nth-child(3) .billing__actions .sf-button').click({force: true, multiple: true });
    cy.get('.sf-content-category .sf-content-page:nth-child(3) #firstName', {timeout: 5000}).clear().type('BBBBBBBBB', {force: true});
    cy.get('button[type="submit"]').click({force: true, multiple: true });
    page.myAccount.billingDetails.address.should('be.visible');
    cy.get('.billing__address').contains('BBBBBBBBB').should('be.visible');
*/

    //  Delete address
    cy.get('.billing__actions button:nth-child(3)').click({force: true, multiple: true });
    cy.wait(3000);
    cy.get('.sf-tabs__content__tab .action-button').should('be.visible');

  });
});

