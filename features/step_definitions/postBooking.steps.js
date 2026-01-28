const { Given, When, Then, setWorldConstructor, Before } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { booking } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const BOOKING_KEYS = booking.keys;

// Given steps - Setup booking data
Given('I have a valid user ID {string}', function(userId) {
  this.userId = parseInt(userId, 10);
});

Given('I prepare a booking request with the following data:', function(dataTable) {
  // Convert table data to booking request object
  const rowsHash = dataTable.rowsHash();
  
  this.bookingRequest = {
    date: rowsHash.date === 'undefined' ? undefined : rowsHash.date,
    destination: rowsHash.destination,
    origin: rowsHash.origin,
    userId: parseInt(rowsHash.userId, 10)
  };
});

// When steps - Make POST request
When('I send a POST request to create a booking', async function() {
  await this.makeRequest('POST', '', this.bookingRequest);
});

// When step - Retrieve booking ID and fetch the created booking
When('I retrieve the booking ID from the response', function() {
  const response = this.getResponseBody();
  
  // Validate response has an ID field
  expect(response).to.have.property('id');
  expect(response.id).to.be.a('number');
  
  this.createdBookingId = response.id;
});

When('I send a GET request for the created booking', async function() {
  expect(this.createdBookingId).to.exist;
  await this.makeRequest('GET', `/${this.createdBookingId}`);
});

// Then steps - Response validation
Then('the booking response should contain a bookingId', function() {
  const response = this.getResponseBody();
  
  expect(response).to.have.property('id');
  expect(response.id).to.be.a('number');
});

Then('the created booking response should have correct schema', function() {
  const response = this.getResponseBody();
  
  // Validate response has all required booking fields
  expect(response).to.have.all.keys(...BOOKING_KEYS);
  
  // Validate each field type
  expect(response.id).to.be.a('number');
  expect(response.date).to.be.a('string');
  expect(response.destination).to.be.a('string');
  expect(response.origin).to.be.a('string');
  expect(response.userId).to.be.a('number');
});

Then('the retrieved booking should match the created booking data', function() {
  const retrievedBooking = this.getResponseBody();
  const requestData = this.bookingRequest;
  
  // Validate all booking fields match what was sent in POST request
  expect(retrievedBooking.date).to.equal(
    requestData.date,
    `Retrieved booking date ${retrievedBooking.date} should match requested ${requestData.date}`
  );
  expect(retrievedBooking.destination).to.equal(
    requestData.destination,
    `Retrieved booking destination ${retrievedBooking.destination} should match requested ${requestData.destination}`
  );
  expect(retrievedBooking.origin).to.equal(
    requestData.origin,
    `Retrieved booking origin ${retrievedBooking.origin} should match requested ${requestData.origin}`
  );
  expect(retrievedBooking.userId).to.equal(
    requestData.userId,
    `Retrieved booking userId ${retrievedBooking.userId} should match requested ${requestData.userId}`
  );
  
  // Validate booking has all required schema fields
  expect(retrievedBooking).to.have.all.keys(...BOOKING_KEYS);
});
