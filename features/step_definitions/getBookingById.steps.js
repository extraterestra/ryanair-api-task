const { Given, When, Then, Before, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');

setWorldConstructor(ApiWorld);

// Constants for validation
const BOOKING_KEYS = ['id', 'date', 'destination', 'origin', 'userId'];
const ERROR_KEYS = ['message', 'errors'];
const ERROR_DETAIL_KEYS = ['message', 'location'];
const LOCATION_KEYS = ['in', 'name', 'docPath', 'path'];

// Background steps - no longer needed as config handles initialization

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
  await this.makeRequest('GET', `/${this.bookingId}`);
});

// Then steps - Assert response status
Then('the response status should be {string}', function(expectedStatus) {
  const actualStatus = this.getResponseStatus();
  expect(actualStatus).to.equal(parseInt(expectedStatus));
});

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
Then('the response should have error structure', function() {
  const responseBody = this.getResponseBody();
  expect(responseBody).to.have.all.keys(ERROR_KEYS);
});

Then('the response should contain an errors array', function() {
  const responseBody = this.getResponseBody();
  expect(responseBody.errors).to.be.an('array');
});

Then('the response message should be {string} with booking ID {string}', function(messagePrefix, bookingId) {
  const responseBody = this.getResponseBody();
  const expectedMessage = bookingId ? `${messagePrefix} ${bookingId}` : messagePrefix;
  expect(responseBody.message).to.equal(expectedMessage);
});

Then('the response message should be {string}', function(expectedMessage) {
  const responseBody = this.getResponseBody();
  expect(responseBody.message).to.equal(expectedMessage);
});

Then('the error response fields should correspond to the schema', function() {
  const responseBody = this.getResponseBody();
  expect(responseBody).to.have.all.keys(ERROR_KEYS);

  // Top-level message must be string
  expect(responseBody).to.have.property('message');
  expect(responseBody.message).to.be.a('string');

  // errors must be an array according to schema
  expect(responseBody).to.have.property('errors');
  expect(responseBody.errors).to.be.an('array', 'errors field must be an array, not null or undefined');

  if (responseBody.errors.length > 0) {
    const error = responseBody.errors[0];
    expect(error).to.have.all.keys(ERROR_DETAIL_KEYS);
    expect(error.location).to.have.all.keys(LOCATION_KEYS);
  }
  
  // Each error object
  responseBody.errors.forEach(error => {
    expect(error).to.be.an('object');

    // error.message
    expect(error).to.have.property('message');
    expect(error.message).to.be.a('string');

    // error.location
    expect(error).to.have.property('location');
    expect(error.location).to.be.an('object');

    const loc = error.location;
    expect(loc).to.have.property('in');
    expect(loc.in).to.be.a('string');
    expect(loc).to.have.property('name');
    expect(loc.name).to.be.a('string');
    expect(loc).to.have.property('docPath');
    expect(loc.docPath).to.be.a('string');
    expect(loc).to.have.property('path');
    expect(loc.path).to.be.a('string');
  });
});
