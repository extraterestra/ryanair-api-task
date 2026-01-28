Feature: Get Booking by ID
  As a user
  I want to retrieve booking information by booking ID
  So that I can view my booking details

  @book1 @smoke @regression
  Scenario: Successfully retrieve an existing booking
    Given I have a valid booking ID "1"
    When I send a GET request for the booking
    Then the response status should be "200"
    And booking response fields should correspond to the schema

  @book2 @regression
  Scenario Outline: Error handling for invalid booking IDs
    Given I have a <bookingID> booking ID
    When I send a GET request for the booking
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema
    And the response message should be "<responseMessage>" with booking ID "<bookingIdValue>"

    Examples: Invalid booking ID scenarios
      | bookingID    | statusCode | responseMessage         | bookingIdValue |
      | undefined    | 400        | Validation errors       |                |
      | non-existing | 404        | No booking with id      | 99999          |
      | invalid      | 400        | Validation errors       |                |
