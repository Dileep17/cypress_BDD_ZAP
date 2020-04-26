import { Given, When } from "cypress-cucumber-preprocessor/steps";

When("select {int} option in delivery", (indexOfAddress) => {
    cy.get(".mat-radio-outer-circle", {timeout: 7000}).eq(indexOfAddress).click();
});

When("proceed to Payment Options page", () => {
    cy.contains("Continue", {timeout: 7000}).click();
 });