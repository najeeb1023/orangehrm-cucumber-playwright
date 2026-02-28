@LoginUser @PROD

Feature: Verify if the user is able to login with correct credentials and unable to login with incorrect credentials.

    User enters their details to login.

    Background: User is landed on the webpage.
        Given The user logs in.
    
    @LoginWithCorrectCredentials
    Scenario: User is able to login with correct credentials.
        Then The user is logged in.