@regression @user
Feature: Get User by ID

  @smoke
  Scenario: Successfully retrieve an existing user
    Given I have the user ID "1"
    When I send a GET request for the user
    Then the response status should be "200"
    And user response fields should correspond to the schema
    And the user response should contain valid data

  Scenario Outline: Error handling for invalid user IDs
    Given I have a "<userID>" user ID
    When I send a GET request for the user
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema
    And the response message should be "<responseMessage>" with user ID "<userIdValue>"

    Examples: Invalid user ID scenarios
      | userID       | statusCode | responseMessage    | userIdValue |
      | undefined    | 400        | Validation errors  |             |
      | empty        | 400        | Validation errors  |             |
      | 99999        | 404        | No user with id    | 99999       |

