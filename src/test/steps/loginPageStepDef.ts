import { pageFixture } from "../hooks/pageFixture";
import { LoginFacade, LoginPage } from "../pages/LoginPage";
import { Given, When, Then } from "@cucumber/cucumber";

let loginPage = new LoginPage(pageFixture.page);
let loginFacade = new LoginFacade(pageFixture.page);

Given("The user logs in.", async function () {
    await loginPage.goToLoginPage();
    await loginFacade.correctLoginCreds();
});

Then("The user is logged in.", async function () {
  await loginFacade.assertSuccssfulUserLogIn();
});