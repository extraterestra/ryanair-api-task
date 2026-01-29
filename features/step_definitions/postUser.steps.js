const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { user } = require('../../models/dataSchemas');
const { UserRequestBuilder } = require('../../models/requestBuilders');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const USER_KEYS = user.keys;

// Given steps - Setup user data
Given('I prepare a user request with the following data:', function(dataTable) {
  // Convert table data to user request object
  const rowsHash = dataTable.rowsHash();
  
  const builder = new UserRequestBuilder()
    .withContentType();
  
  // Handle name field
  if (rowsHash.name !== 'undefined') {
    builder.withName(rowsHash.name === 'empty' ? '' : rowsHash.name);
  }
  
  // Handle surname field
  if (rowsHash.surname !== 'undefined') {
    builder.withSurname(rowsHash.surname === 'empty' ? '' : rowsHash.surname);
  }
  
  // Handle email field
  if (rowsHash.email === 'generated') {
    builder.withGeneratedEmail();
  } else if (rowsHash.email !== 'undefined') {
    builder.withEmail(rowsHash.email === 'empty' ? '' : rowsHash.email);
  }
  
  const request = builder.build();
  this.userRequest = request.body;
});

When('I prepare a user request with the same email:', function(dataTable) {
  // Prepare a new user request with the same email as the previous request
  const previousEmail = this.userRequest.email;
  const rowsHash = dataTable.rowsHash();
  
  const builder = new UserRequestBuilder()
    .withContentType()
    .withName(rowsHash.name)
    .withSurname(rowsHash.surname)
    .withEmail(previousEmail);
  
  const request = builder.build();
  this.userRequest = request.body;
});

// When steps - Make POST request
When('I send a POST request to create a user', async function() {
  await this.makeRequest('POST', this.endpoints.user.create, this.userRequest);
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
  await this.makeRequest('GET', this.endpoints.user.getById(this.createdUserId));
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
