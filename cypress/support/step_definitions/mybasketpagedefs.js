import { Given, When } from "cypress-cucumber-preprocessor/steps";

When("checkout", () => {
    cy.get('.mat-table.cdk-table img', {timeout: 7000})
    cy.get('Checkout', {timeout: 7000}).should("be.enabled")
    cy.contains("Checkout").click();
});