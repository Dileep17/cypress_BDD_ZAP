import { Given, When } from "cypress-cucumber-preprocessor/steps";

When("select first address", () => {
    cy.get(".mat-radio-outer-circle", {timeout: 7000}).click();
});

When("proceed to delivery speed page", () => {
   cy.contains("Continue", {timeout: 7000}).click();
});