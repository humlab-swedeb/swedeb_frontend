describe("Expected results compared to previous version", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  context("WordTrends", () => {
    it("Small search gives expected result (12 hits)", () => {
      cy.contains("Ordtrender").click();
      cy.url().should("include", "wordtrends");
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-speaker-filter").click().type("Laila Freivalds");
      cy.contains("Laila Freivalds, S").click();
      cy.getByData("meta-party-filter").click().type("Socialdemokraterna");
      cy.contains("Socialdemokraterna").click();
      cy.getByData("search-bar-add").type("kriminell{enter}");
      cy.getByData("search-button-wt").click();
      cy.contains("kriminell S Laila Freivalds (12)").click({ force: true });
      cy.getByData("wt-table-tab").click();
      cy.getByData("wt-speech-tab").click();
    });

    it("Klimat -> 6854 total, 5936 speeches", () => {
      cy.contains("Ordtrender").click();
      cy.getByData("search-bar-add").type("klimat{enter}");
      cy.getByData("search-button-wt").click();
      cy.getByData("line-chart", { timeout: 10000 }).should("be.visible");
      cy.contains("klimat (6854)").click({ force: true });
      cy.getByData("wt-speech-tab").click();
      cy.contains("5936 träffar", { timeout: 10000 });

      cy.getByData("wt-table-tab").click();
      cy.getByData("wt-count-table").get("thead").as("Header");
      cy.get("@Header").contains("År");
      cy.get("@Header").contains("klimat");

      cy.getByData("wt-table-content").eq(0).contains("1867");
      cy.getByData("wt-table-content").eq(1).contains("11");
    });

    it("Klimat normalized -> 0.0018518... ", () => {
      cy.contains("Ordtrender").click();
      cy.getByData("wt-normalize-toggle")
        .children()
        .find('[role="switch"]')
        .click();

      cy.getByData("search-bar-add").type("klimat{enter}");
      cy.getByData("search-button-wt").click();
      cy.contains("klimat (0.0018518)");
    });

    it("Search with party metadata", () => {
      cy.contains("Ordtrender").click();
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-party-filter").click().type("Centerpartiet");
      cy.contains("Centerpartiet").click();
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-party-filter").click().type("Liberalerna");
      cy.contains("Liberalerna").click();
      cy.getByData("search-bar-add").type("skoldebatt{enter}");
      cy.getByData("search-button-wt").click();
      // lineChart innehåller förväntade rader
      cy.contains("Totalt (69)", { timeout: 10000 });
      cy.contains("skoldebatt C ");
      cy.contains("skoldebatt L");

      cy.getByData("wt-table-tab").click();
      cy.getByData("wt-count-table").get("thead").as("Header");
      cy.get("@Header").contains("År").should("be.visible");
      cy.get("@Header").contains("Totalt").should("be.visible");
      cy.get("@Header").contains("skoldebatt C").should("be.visible");
      cy.get("@Header").contains("skoldebatt L").should("be.visible");
    });

    it("Search with party/gender/chamber metadata", () => {
      cy.contains("Ordtrender").click();
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-party-filter").click().type("Centerpartiet");
      cy.contains("Centerpartiet").click();
      cy.getByData("meta-open-icon").click().click();
      cy.getByData("meta-party-filter").click().type("Liberalerna");
      cy.contains("Liberalerna").click();

      cy.getByData("meta-open-icon").click().click();

      cy.getByData("meta-toggle").eq(0).click();
      cy.contains("Metadata saknas").click();
      cy.contains("Kvinna").click();

      cy.getByData("meta-toggle").eq(1).click();
      cy.contains("Andra kammaren").click();

      cy.getByData("search-bar-add").type("skoldebatt{enter}");
      cy.getByData("search-button-wt").click();
      // lineChart innehåller förväntade rader
      cy.contains("Totalt (42)", { timeout: 10000 });
      cy.contains("skoldebatt ek Man C (10)");
      cy.contains("skoldebatt ek Man L (20)");
      cy.contains("skoldebatt fk Man C (6)");
      cy.contains("skoldebatt fk Man L (6)");

      cy.getByData("wt-table-tab").click();
      cy.getByData("wt-count-table").get("thead").as("Header");
      cy.get("@Header").contains("År").should("be.visible");
      cy.get("@Header").contains("Totalt").should("be.visible");
      cy.get("@Header").contains("skoldebatt ek Man C").should("be.visible");
      cy.get("@Header").contains("skoldebatt ek Man L").should("be.visible");
      cy.get("@Header").contains("skoldebatt fk Man C").should("be.visible");
      cy.get("@Header").contains("skoldebatt fk Man L").should("be.visible");
    });
  });

  context("Speeches", () => {
    it("Number of speeches all -> 1051331", () => {
      cy.contains("Anföranden").click();
      cy.getByData("search-button-speeches").click();
      cy.contains("Sökningen resulterade i 1051331 träffar.", {
        timeout: 10000,
      });
    });

    it("Number of speeches, C -> 97224", () => {
      cy.contains("Anföranden").click();
      cy.getByData("meta-party-filter").click().type("Centerpartiet");
      cy.contains("Centerpartiet").click();
      cy.getByData("search-button-speeches").click();
      cy.contains("Sökningen resulterade i 97224 träffar.", { timeout: 10000 });
    });

    it("Number of speeches, women -> 225143 ", () => {
      cy.contains("Anföranden").click();
      cy.getByData("meta-toggle").eq(0).click();
      cy.contains("Metadata saknas").click();
      cy.contains("Man").click();
      cy.getByData("search-button-speeches").click();
      cy.contains("Sökningen resulterade i 225143 träffar.", {
        timeout: 10000,
      });
    });
  });

  context("KWIC", () => {
    it("KWIC kriminell -> 1498 hits", () => {
      cy.contains("Key Word").click();
      cy.getByData("search-bar").type("kriminell");
      cy.getByData("search-button-kwic").click();
      cy.contains("Sökningen resulterade i 1498 träffar.", { timeout: 10000 });
    });

    it("KWIC kriminell + lemmatize -> 8695 hits", () => {
      cy.contains("Key Word").click();
      cy.getByData("kwic-lemma-toggle")
        .children()
        .find('[role="switch"]')
        .click();
      cy.getByData("search-bar").type("kriminell");
      cy.getByData("search-button-kwic").click();
      cy.contains("Sökningen resulterade i 8695 träffar.", { timeout: 10000 });
    });

    it("KWIC kriminell Mp -> 68 träffar", () => {
      cy.contains("Key Word").click();
      cy.getByData("meta-open-icon").click();
      cy.getByData("meta-party-filter").click().type("Miljöpartiet");
      cy.contains("Miljöpartiet").click();
      cy.getByData("search-bar").type("kriminell");
      cy.getByData("search-button-kwic").click();
      cy.contains("Sökningen resulterade i 68 träffar.", { timeout: 10000 });
    });
  });
  context("N-gram (limited testing currently due to errors in previous version)", () => {


    it.only("leva på sin -> 1010 hits, 831 speeches", () => {
      cy.contains("N-Gram").click();
      cy.getByData("search-bar").type("leva på{enter}");
      cy.getByData("ngram-table", { timeout: 10000})
        .find("span")
        .contains("leva på sin")
        .as("levaRes")

      cy.get("@levaRes").parentsUntil("tbody").as("resultRow");
      cy.get("@resultRow").contains("1010")
      cy.get("@resultRow").contains("831")


    });
  });
});
