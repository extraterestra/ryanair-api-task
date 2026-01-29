const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { user } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const USER_KEYS = user.keys;

// Given steps - Setup user ID
Given('I have the user ID {string}', function(id) {
  this.userId = id;
});

Given('I have an? {word} user ID type', function(userIDType) {
  if (userIDType === 'undefined') {
    this.userId = undefined;
  } else if (userIDType === 'empty') {
    this.userId = '';
  } else if (userIDType === 'non-existing') {
    this.userId = '99999';
  }
});

// When steps - Make the request
When('I send a GET request for the user', async function() {
  await this.makeRequest('GET', this.endpoints.user.getById(this.userId));
});

// Then steps - Assert response structure
Then('user response fields should correspond to the schema', function() {
  const responseBody = this.getResponseBody();
  
  // Validate all required keys are present
  expect(responseBody).to.have.all.keys(...USER_KEYS);
  
  // Validate each field type
  expect(responseBody.id).to.be.a('number');
  expect(responseBody.name).to.be.a('string');
  expect(responseBody.surname).to.be.a('string');
  expect(responseBody.email).to.be.a('string');
});

Then('the user response should contain valid data', function() {
  const responseBody = this.getResponseBody();
  
  // Validate that required fields are not empty
  expect(responseBody.id).to.be.greaterThan(0);
  expect(responseBody.name).to.not.be.empty;
  expect(responseBody.surname).to.not.be.empty;
  expect(responseBody.email).to.not.be.empty;
  
  // Basic email format validation
  expect(responseBody.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

Then('the response message should be {string} with user ID {string}', function(messagePrefix, userId) {
  const responseBody = this.getResponseBody();
  const expectedMessage = userId ? `${messagePrefix} ${userId}` : messagePrefix;
  expect(responseBody.message).to.equal(expectedMessage);
});
