import { Given, When } from "cypress-cucumber-preprocessor/steps";

When("add {int} item to basket", (itemNumber) =>{
    cy.get("[aria-label='Add to Basket']").eq(0).click();
    cy.get(".mat-simple-snackbar", {timeout: 7000})
    .should("be.visible");
});

When("proceed to view basket", () => {
    cy.contains("Your Basket").click();
});

