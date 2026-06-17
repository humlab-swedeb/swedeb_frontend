describe('Start page has correct content', () => {

  it("get stuff", () => {
    cy.visit("/")
    cy.get(".grid-container").find(".q-card").as("cards")
    cy.get("@cards").first().click()


  })
})
