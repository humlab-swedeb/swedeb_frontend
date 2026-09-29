describe("N-gram search", () => {

    beforeEach(() => {
    cy.visit("/tools/ngram");
  });

    it("Search -> table is displayed and row is clickable", () => {
      cy.getByData("search-bar").type("leva på{enter}");
      cy.getByData("ngram-table", { timeout: 10000})
        .find("span")
        .contains("leva på sin")
        .as("levaRes")

      cy.get("@levaRes").click()
    
  })

});
