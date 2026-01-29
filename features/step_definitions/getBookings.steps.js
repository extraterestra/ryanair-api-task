const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { booking } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const BOOKING_KEYS = booking.keys;

// Given steps - Setup user ID and date
Given('I have a {string} user ID', function(userId) {
  // Handle "undefined" as string literal to mean no filter
  if (userId === 'undefined') {
    this.userId = undefined;
  } else {
    // Convert to number if it's a valid numeric string
    this.userId = isNaN(userId) ? userId : parseInt(userId, 10);
  }
});

Given('I have a {string} date', function(date) {
  // Handle "undefined" as string literal to mean no filter
  if (date === 'undefined') {
    this.bookingDate = undefined;
  } else {
    this.bookingDate = date;
  }
});

// When steps - Make the request
When('I send a GET request for bookings', async function() {
  // Build query parameters only for non-undefined values
  const params = [];
  if (this.userId !== undefined) {
    params.push(`userId=${this.userId}`);
  }
  if (this.bookingDate !== undefined) {
    params.push(`date=${this.bookingDate}`);
  }
  
  const path = params.length > 0 ? `${this.endpoints.booking.list}?${params.join('&')}` : this.endpoints.booking.list;
  
  // Store the filters for later validation
  this.requestFilters = {
    userId: this.userId,
    date: this.bookingDate
  };
  
  await this.makeRequest('GET', path);
});

// Then steps - Assert response structure
Then('list of bookings response fields should correspond to the schema', function() {
  const responseBody = this.getResponseBody();
  
  // Validate response is an array
  expect(responseBody).to.be.an('array');
  
  // Validate each booking has correct structure and fields
  responseBody.forEach((booking, index) => {
    // Validate all required keys are present
    expect(booking).to.have.all.keys(...BOOKING_KEYS);
    
    // Validate each field type
    expect(booking.id).to.be.a('number', `Booking at index ${index}: id should be a number`);
    expect(booking.date).to.be.a('string', `Booking at index ${index}: date should be a string`);
    expect(booking.destination).to.be.a('string', `Booking at index ${index}: destination should be a string`);
    expect(booking.origin).to.be.a('string', `Booking at index ${index}: origin should be a string`);
    expect(booking.userId).to.be.a('number', `Booking at index ${index}: userId should be a number`);
  });
});

// Shared status validation (from commonSteps.js)
// Then('the response status should be {string}', ...);

// Shared error validation (from commonSteps.js)
// Then('the error response fields should correspond to the schema', ...);

Then('the bookings should match the applied filters', function() {
  const responseBody = this.getResponseBody();
  const filters = this.requestFilters;
  
  expect(responseBody).to.be.an('array');
  
  // If userId filter was applied, verify all bookings have matching userId
  if (filters.userId !== undefined) {
    responseBody.forEach((booking, index) => {
      expect(booking.userId).to.equal(
        filters.userId,
        `Booking at index ${index} has userId ${booking.userId}, expected ${filters.userId}`
      );
    });
  }
  
  // If date filter was applied, verify all bookings have matching date
  if (filters.date !== undefined) {
    responseBody.forEach((booking, index) => {
      expect(booking.date).to.equal(
        filters.date,
        `Booking at index ${index} has date ${booking.date}, expected ${filters.date}`
      );
    });
  }
});