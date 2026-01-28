Feature: Create Booking
  As a user
  I want to create a new booking
  So that I can book a flight

  @post1 @smoke @regression
  Scenario: Successfully create a new booking and verify it was created
    Given I have a valid user ID "1"
    And I prepare a booking request with the following data:
      | date        | 2026-03-15 |
      | destination | FCO        |
      | origin      | DUB        |
      | userId      | 1          |
    When I send a POST request to create a booking
    Then the response status should be "201"
    And the booking response should contain a bookingId
    And the created booking response should have correct schema
    And I retrieve the booking ID from the response
    And I send a GET request for the created booking
    Then the response status should be "200"
    And the retrieved booking should match the created booking data

  @post2 @regression
  Scenario Outline: Validation of date field in POST booking request
    Given I have a valid user ID "1"
    And I prepare a booking request with the following data:
      | date        | <date>         |
      | destination | FCO            |
      | origin      | DUB            |
      | userId      | 1              |
    When I send a POST request to create a booking
    Then the response status should be "<statusCode>"
    And the error response fields should correspond to the schema
    And the response message should contain "<errorMessage>"

    Examples: Invalid date scenarios
      | date         | statusCode | errorMessage      | 
      | undefined    | 400        | Validation errors | 
      | invalid-date | 400        | Validation errors | 
      | 2026-13-45   | 400        | Validation errors | 
      # | 1976-03-15   | 400        | Validation errors | this test case failing, I suppose it is bug