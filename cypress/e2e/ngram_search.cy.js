describe("N-gram search", () => {

    it("Search -> table is displayed and row is clickable", () => {

    cy.contains("Ordtrender")
    cy.contains("Key Words")
    cy.contains("Anföranden")
    cy.contains("N-Gram").click()
    cy.getByData("search-bar").type("månsken")
    cy.getByData("search-button-ngram").click()
    cy.getByData("ngram-table", { timeout: 10000 }).scrollIntoView().should("exist")
    cy.getByData("ngram-table").find(".cursor-pointer").click()
  })

});
