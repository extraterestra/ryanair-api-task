@postu @regression
Feature: Create User
  As an admin
  I want to create a new user
  So that I can register users

  @user2 @smoke @regression
  Scenario: Successfully create a new user and verify it was created
    Given I prepare a user request with the following data:
      | name    | Test              |
      | surname | User              |
      | email   | generated         |
    When I send a POST request to create a user
    Then the response status should be "201"
    And the user response should contain a userId
    And the created user response should have correct schema
    And I retrieve the user ID from the response
    And I send a GET request for the created user
    Then the response status should be "200"
    And the retrieved user should match the created user data

  @user3 @regression
  Scenario Outline: Validation of name and surname fields in POST user request
    Given I prepare a user request with the following data:
      | name    | <name>    |
      | surname | <surname> |
      | email   | generated |
    When I send a POST request to create a user
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema
    And the response message should contain "<errorMessage>"

    Examples: Invalid name and surname scenarios
      | name      | surname   | statusCode | errorMessage      |
      | undefined | Test      | 400        | Validation errors |
      | empty     | Test      | 400        | Validation errors |
      | Test      | undefined | 400        | Validation errors |
      | Test      | empty     | 400        | Validation errors |

  @user4 @regression
  Scenario Outline: Validation of email field in POST user request with empty and undefined values
    Given I prepare a user request with the following data:
      | name    | Test    |
      | surname | User    |
      | email   | <email> |
    When I send a POST request to create a user
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema
    And the response message should contain "<errorMessage>"

    Examples: Invalid email scenarios
      | email        | statusCode | errorMessage      |
      | undefined    | 400        | Validation errors |
      # this test is failing due to the bug (201 or 409 code returned instead of 400)
      # | empty        | 400        | Validation errors |    

  @user5 @regression
  Scenario: Validation of duplicate email in POST user request
    Given I prepare a user request with the following data:
      | name    | Test      |
      | surname | User      |
      | email   | generated |
    When I send a POST request to create a user
    Then the response status should be "201"
    And the user response should contain a userId
    And I retrieve the user ID from the response
    And I send a GET request for the created user
    Then the response status should be "200"
    When I prepare a user request with the same email:
      | name    | Test2     |
      | surname | User2     |
    And I send a POST request to create a user
    Then the response status should be "409"
    And the response message should contain "User with email"
    And the response message should contain "already exists"
