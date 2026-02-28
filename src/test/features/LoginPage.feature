@LoginUser @PROD

Feature: Verify if the user is able to login with correct credentials and unable to login with incorrect credentials.

    User enters their details to login.

    Background: User is landed on the webpage.
        Given The user lands at the login page.
    
    @LoginWithCorrectCredentials
    Scenario: User is able to login with correct credentials.
        When The user enters correct username.
        And User enters correct password.
        And User clicks on the login button.
