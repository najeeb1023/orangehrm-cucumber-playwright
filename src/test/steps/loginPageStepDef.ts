import { pageFixture } from "../hooks/pageFixture";
import { LoginPage } from "../pages/LoginPage";
import { Given, When, Then } from "@cucumber/cucumber";

let loginPage = new LoginPage(pageFixture.page);

Given("The user lands at the login page.", async function () {
    await loginPage.goToLoginPage();
});

When("The user enters correct username.", async function () {
    await loginPage.enterUsername();
});

When("User enters correct password.", async function () {
    await loginPage.enterPassword();
});

When("User clicks on the login button.", async function () {
    await loginPage.loginUser();
});

Then("The user is logged in.", async function () {
    await loginPage.assertUserLoggedIn();
});