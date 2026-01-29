const { Given, When, Then, Before, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { error, booking } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const BOOKING_KEYS = booking.keys;

// Given steps - Setup booking ID
Given('I have a valid booking ID {string}', function(id) {
  this.bookingId = id;
});

Given('I have an undefined booking ID', function() {
  this.bookingId = undefined;
});

Given('I have a non-existing booking ID {string}', function(id) {
  this.bookingId = id;
});

Given('I have a {word} booking ID', function(bookingIDType) {
  if (bookingIDType === 'undefined') {
    this.bookingId = undefined;
  } else if (bookingIDType === 'non-existing') {
    this.bookingId = '99999';
  }
});

// When steps - Make the request
When('I send a GET request for the booking', async function() {
  await this.makeRequest('GET', `/booking/${this.bookingId}`);
});

// Then steps - Assert response status
// (Moved to commonSteps.js)

// Then steps - Assert response structure
Then('the response should contain all booking fields', function() {
  const responseBody = this.getResponseBody();
  expect(responseBody).to.have.all.keys(BOOKING_KEYS);
});

Then('booking response fields should correspond to the schema', function() {
  const responseBody = this.getResponseBody();
  
  // Validate all required keys are present
  expect(responseBody).to.have.all.keys(BOOKING_KEYS);
  
  // Validate each field type
  expect(responseBody.id).to.be.a('number');
  expect(responseBody.date).to.be.a('string');
  expect(responseBody.destination).to.be.a('string');
  expect(responseBody.origin).to.be.a('string');
  expect(responseBody.userId).to.be.a('number');
});

Then('the response field {string} should be a number', function(fieldName) {
  const fieldValue = this.getResponseField(fieldName);
  expect(fieldValue).to.be.a('number');
});

Then('the response field {string} should be a string', function(fieldName) {
  const fieldValue = this.getResponseField(fieldName);
  expect(fieldValue).to.be.a('string');
});

// Then steps - Assert error structure
// (Moved to commonSteps.js)

Then('the response message should be {string} with booking ID {string}', function(messagePrefix, bookingId) {
  const responseBody = this.getResponseBody();
  const expectedMessage = bookingId ? `${messagePrefix} ${bookingId}` : messagePrefix;
  expect(responseBody.message).to.equal(expectedMessage);
});

Then('the response message should be {string}', function(expectedMessage) {
  const responseBody = this.getResponseBody();
  expect(responseBody.message).to.equal(expectedMessage);
});
