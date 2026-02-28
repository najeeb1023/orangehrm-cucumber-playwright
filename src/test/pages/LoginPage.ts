import { expect, Page } from "@playwright/test";
import { pageFixture } from "../hooks/pageFixture";
import { PageElement } from "../resources/interfaces/iPageElement";
import * as loginPageLocators from "../resources/interfaces/loginPageLocators.json"

    function getResource(resourceName: string){
        return loginPageLocators.webElements.find((element: PageElement) => element.elementName == resourceName) as PageElement;
    };

export class LoginPage {

    constructor(public page: Page){
        pageFixture.page = page;
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
        await this.loginPageLocators.usernameField().fill('Admin');
    };

    public async enterPassword ():Promise<void> {
        await this.loginPageLocators.passwordField().fill('admin123');
    };

    public async loginUser ():Promise<void> {
        await this.loginPageLocators.loginBtn().click();
    };

    public async assertUserLoggedIn ():Promise<void> {
        await expect(this.loginPageLocators.myActionsTab()).toBeVisible({ timeout: 5000 });
    };

};