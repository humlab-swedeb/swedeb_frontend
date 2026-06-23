describe('Start page has correct content', () => {

  beforeEach(()=>{
    cy.visit('/')
  })

  context("There are four tools", () => {

  it('Visit WordTrends', () => {
      cy.contains("Ordtrender").click()
      cy.url().should("include", "wordtrends")
  })

  it('Visit KWIC', () => {
      cy.contains("Key Words").click()
      cy.url().should("include", "kwic")
  })

  it('Visit Speeches', () => {
      cy.contains("Anföranden").click()
      cy.url().should("include", "speeches")
  })

  it("Visit ngrams", () =>{
      cy.contains("N-Gram").click()
      cy.url().should("include", "ngram")
  })
})

  context("Other start page components", () =>{
      it("Checking page tabs", () =>{

        cy.contains("FAQ")
        cy.contains("Verktyg")
        cy.contains("Om Riksdagsdebatter")
        cy.contains("Har du frågor")
      })

  })

  it("NGram search", () => {

    cy.contains("Ordtrender")
    cy.contains("Key Words")
    cy.contains("Anföranden")
    cy.contains("N-Gram").click()
    cy.getByData("search-bar").type("månsken")
    cy.getByData("search-button-ngram").click()
    cy.getByData("ngram-table", { timeout: 10000 }).scrollIntoView().should("exist")
    cy.getByData("ngram-table").find(".cursor-pointer").click()
  })


})
