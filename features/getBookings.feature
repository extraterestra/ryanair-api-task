Feature: Get Bookings by User ID and Date
  As a user
  I want to retrieve a list of bookings with optional filters by user ID and date
  So that I can view my bookings with or without specific filters

  @book3 @regression
  Scenario Outline: Successfully retrieve bookings with optional filters
    Given I have a "<userID>" user ID
    And I have a "<date>" date
    When I send a GET request for bookings
    Then the response status should be "200"
    And list of bookings response fields should correspond to the schema
    And the bookings should match the applied filters

    Examples: Optional filter combinations
      | userID    | date         |
      | 1         | 2022-02-01   |
      | 1         | undefined    |
      | undefined | 2022-02-01   |
      | undefined | undefined    |
      | 1         | 2027-02-01   |

  @regression @book4
  Scenario Outline: Error handling for invalid booking retrieval requests
    Given I have a "<userID>" user ID
    And I have a "<date>" date
    When I send a GET request for bookings
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema

    Examples: Invalid user ID and date scenarios
      | userID    | date         | statusCode | 
      | invalid   | 2022-01-01   | 400        | 
      | 99999     | 2024-01-01   | 404        | 
      | 1         | invalid-date | 400        | 
