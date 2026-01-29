@regression @user
Feature: Get User by ID
  As a user
  I want to retrieve user information by user ID
  So that I can view user details

  @user6 @smoke @regression
  Scenario: Successfully retrieve an existing user
    Given I have the user ID "1"
    When I send a GET request for the user
    Then the response status should be "200"
    And user response fields should correspond to the schema
    And the user response should contain valid data
