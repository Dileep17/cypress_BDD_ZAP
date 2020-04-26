import { Given, When } from "cypress-cucumber-preprocessor/steps";

Given("I open juiceshop landing page", () => {
    cy.server();
    cy.visit("/");
    try{
        cy.contains("Me want it!").click();
        cy.contains("Dismiss").click();
    } catch(err){
        console.log("Failed to dissmiss alters on landing page")
    }
});

Given("proceed to login", () => {
    cy.get("#navbarAccount").click();
    cy.get("#navbarLoginButton").click();
});
