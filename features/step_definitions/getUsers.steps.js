const { When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ApiWorld = require('../support/world');
const { user } = require('../../models/dataSchemas');
require('./commonSteps');

setWorldConstructor(ApiWorld);

// Constants for validation
const USER_KEYS = user.keys;

// When steps - Make the request
When('I send a GET request for all users', async function() {
  // Make GET request to retrieve all users
  await this.makeRequest('GET', this.endpoints.user.list);
});

// Then steps - Validate response
Then('list of users response fields should correspond to the schema', function() {
  expect(this.response.status).to.equal(200);
  expect(this.response.data).to.be.an('array');
  
  if (this.response.data.length > 0) {
    this.response.data.forEach(user => {
      // Check that each user object has all required keys
      USER_KEYS.forEach(key => {
        expect(user).to.have.property(key);
      });
      
      // Validate data types
      expect(user.id).to.be.a('number');
      expect(user.name).to.be.a('string');
      expect(user.surname).to.be.a('string');
      expect(user.email).to.be.a('string');
    });
  }
});

Then('the response should contain users with valid data', function() {
  expect(this.response.data).to.be.an('array');
  
  if (this.response.data.length > 0) {
    this.response.data.forEach(user => {
      // Validate that required fields are not empty
      expect(user.id).to.be.greaterThan(0);
      expect(user.name).to.not.be.empty;
      expect(user.surname).to.not.be.empty;
      expect(user.email).to.not.be.empty;
      
      // Basic email format validation
      expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  }
});
