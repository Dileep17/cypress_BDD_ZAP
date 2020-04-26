import { Given, When } from "cypress-cucumber-preprocessor/steps";


When("Login into juice shop", () =>{
    cy.get("#email").type("admin@juice-sh.op");
    cy.get("#password").type("admin123");
    cy.get("#loginButton").click();
});