const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { user } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const USER_KEYS = user.keys;

// Helper function to generate unique email
function generateEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.user.${timestamp}.${random}@example.com`;
}

// Given steps - Setup user data
Given('I prepare a user request with the following data:', function(dataTable) {
  // Convert table data to user request object
  const rowsHash = dataTable.rowsHash();
  
  this.userRequest = {
    name: rowsHash.name === 'undefined' ? undefined : (rowsHash.name === 'empty' ? '' : rowsHash.name),
    surname: rowsHash.surname === 'undefined' ? undefined : (rowsHash.surname === 'empty' ? '' : rowsHash.surname),
    email: rowsHash.email === 'generated' ? generateEmail() : (rowsHash.email === 'undefined' ? undefined : (rowsHash.email === 'empty' ? '' : rowsHash.email))
  };
});

// When steps - Make POST request
When('I send a POST request to create a user', async function() {
  await this.makeRequest('POST', '/user', this.userRequest);
});

// When step - Retrieve user ID and fetch the created user
When('I retrieve the user ID from the response', function() {
  const response = this.getResponseBody();
  
  // Validate response has an ID field
  expect(response).to.have.property('id');
  expect(response.id).to.be.a('number');
  
  this.createdUserId = response.id;
});

When('I send a GET request for the created user', async function() {
  expect(this.createdUserId).to.exist;
  await this.makeRequest('GET', `/user/${this.createdUserId}`);
});

// Then steps - Response validation
Then('the user response should contain a userId', function() {
  const response = this.getResponseBody();
  
  expect(response).to.have.property('id');
  expect(response.id).to.be.a('number');
});

Then('the created user response should have correct schema', function() {
  const response = this.getResponseBody();
  
  // Validate response has all required user fields
  expect(response).to.have.all.keys(...USER_KEYS);
  
  // Validate each field type
  expect(response.id).to.be.a('number');
  expect(response.name).to.be.a('string');
  expect(response.surname).to.be.a('string');
  expect(response.email).to.be.a('string');
});

Then('the retrieved user should match the created user data', function() {
  const retrievedUser = this.getResponseBody();
  const requestData = this.userRequest;
  
  // Validate all user fields match what was sent in POST request
  expect(retrievedUser.name).to.equal(
    requestData.name,
    `Retrieved user name ${retrievedUser.name} should match requested ${requestData.name}`
  );
  expect(retrievedUser.surname).to.equal(
    requestData.surname,
    `Retrieved user surname ${retrievedUser.surname} should match requested ${requestData.surname}`
  );
  expect(retrievedUser.email).to.equal(
    requestData.email,
    `Retrieved user email ${retrievedUser.email} should match requested ${requestData.email}`
  );
  
  // Validate user has all required schema fields
  expect(retrievedUser).to.have.all.keys(...USER_KEYS);
});
