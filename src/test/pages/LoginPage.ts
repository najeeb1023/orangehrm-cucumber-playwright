import { expect, Page } from "@playwright/test";
import { pageFixture } from "../hooks/pageFixture";
import { PageElement } from "../resources/interfaces/iPageElement";
import * as loginPageLocators from "../resources/interfaces/loginPageLocators.json"
import dotenv from "dotenv";

    if (!process.env.CI) {
    dotenv.config({
        path: `.env.${process.env.ENV || "production"}`
    });
    };

    function getResource(resourceName: string){
        return loginPageLocators.webElements.find((element: PageElement) => element.elementName == resourceName) as PageElement;
    };

export class LoginPage {

    private email: string;
    private password: string;

    constructor(public page: Page){
        pageFixture.page = page;
        this.email = process.env.TEST_USERNAME;
        this.password = process.env.TEST_PASSWORD;
        console.log("ENV FILE:", process.env.ENV);
    };

    loginPageLocators = {
        usernameField:()  => pageFixture.page.locator(getResource("usernameField").selectorValue),
        passwordField:()  => pageFixture.page.locator(getResource("passwordField").selectorValue),
        loginBtn:()  => pageFixture.page.locator(getResource("loginBtn").selectorValue),
        myActionsTab:() => pageFixture.page.locator(getResource("myActionsTab").selectorValue)
        
    };

    public async goToLoginPage ():Promise<void> {
        await pageFixture.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    };

    public async enterUsername ():Promise<void> {
        await this.loginPageLocators.usernameField().fill(this.email);
    };

    public async enterPassword ():Promise<void> {
        await this.loginPageLocators.passwordField().fill(this.password);
    };

    public async loginUser ():Promise<void> {
        await this.loginPageLocators.loginBtn().click();
    };

    public async assertUserLoggedIn ():Promise<void> {
        await expect(this.loginPageLocators.myActionsTab()).toBeVisible({ timeout: 5000 });
    };
};