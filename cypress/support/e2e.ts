// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

describe("Registration Form", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("shoutld show error message for invalid inputs", () => {
    cy.get("[data-cypress=username]").type("John Doe");
    cy.get('[data-cypress=password]').type('password');
    cy.get('[data-cypress=venueIds]').type('');

    cy.get('[data-cypress=submitBTN]').click();
  });
});
