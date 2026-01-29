@user1
Feature: Get All Users
  As a user
  I want to retrieve a list of all users
  So that I can view all registered users in the system

  @regression
  Scenario Outline: Successfully retrieve users
    When I send a GET request for all users
    Then the response status should be "<statusCode>"
    And list of users response fields should correspond to the schema
    And the response should contain users with valid data

    Examples: Successful retrieval
      | statusCode |
      | 200        |
