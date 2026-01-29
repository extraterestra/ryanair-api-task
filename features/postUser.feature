Feature: Create User
  As an admin
  I want to create a new user
  So that I can register users

  @user2 @smoke @regression
  Scenario: Successfully create a new user and verify it was created
    Given I prepare a user request with the following data:
      | name    | Test              |
      | surname | User            |
      | email   | generated         |
    When I send a POST request to create a user
    Then the response status should be "201"
    And the user response should contain a userId
    And the created user response should have correct schema
    And I retrieve the user ID from the response
    And I send a GET request for the created user
    Then the response status should be "200"
    And the retrieved user should match the created user data
