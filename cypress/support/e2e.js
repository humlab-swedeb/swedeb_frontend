// ***********************************************************
// This example support/e2e.js is processed and
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
import './commands'

// Ignore harmless ResizeObserver errors that don't affect test functionality
Cypress.on('uncaught:exception', (err) => {
  // Returning false prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return false
  }
  // Let other exceptions fail the test
  return true
})