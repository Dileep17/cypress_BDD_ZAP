import { Given, When } from "cypress-cucumber-preprocessor/steps";

Given("I have 4", () => {
    console.log("I have 1");
});

When("I have 5", () => {
    console.log("I have 2");
});