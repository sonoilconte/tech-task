import { el } from '../utils/element';

class Notification {
  get container(): Cypress.Chainable {
    return el('notification');
  }
  get message(): Cypress.Chainable {
    return el('notification', '.sf-notification__message');
  }
}

export default new Notification();
