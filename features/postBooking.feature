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
