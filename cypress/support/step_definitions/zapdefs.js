import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given("zap is setup for scanning", () => {
    cy.task("initZapClient");
});

When("Active scan is triggered", () => {
    cy.task("runActiveScan", null,  { timeout: 2000000 });
});

Then("Report should be generated", () => {
    cy.task("generateReports");
    cy.task("generateCustomReports");
});