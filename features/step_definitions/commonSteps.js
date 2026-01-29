const { Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { error } = require('../../models/dataSchemas');

// Shared constants
const ERROR_KEYS = error.keys;
const ERROR_DETAIL_KEYS = error.detailKeys;
const LOCATION_KEYS = error.locationKeys;

// Shared Then steps
Then('the response status should be {string}', function(expectedStatus) {
  const actualStatus = this.getResponseStatus();
  expect(actualStatus).to.equal(parseInt(expectedStatus));
});

Then('the error response fields should correspond to the schema', function() {
  const responseBody = this.getResponseBody();
  expect(responseBody).to.have.all.keys(ERROR_KEYS);

  // Top-level message must be string
  expect(responseBody).to.have.property('message');
  expect(responseBody.message).to.be.a('string');

  // errors must be an array according to schema
  expect(responseBody).to.have.property('errors');
  // errors can be null for some error responses (e.g., 404 with no details)
  if (responseBody.errors === null) {
    return;
  }

  expect(responseBody.errors).to.be.an('array', 'errors field must be an array when present');

  if (responseBody.errors.length > 0) {
    const err = responseBody.errors[0];
    expect(err).to.have.all.keys(ERROR_DETAIL_KEYS);
    expect(err.location).to.have.all.keys(LOCATION_KEYS);
  }

  // Each error object
  responseBody.errors.forEach(err => {
    expect(err).to.be.an('object');

    // error.message
    expect(err).to.have.property('message');
    expect(err.message).to.be.a('string');

    // error.location
    expect(err).to.have.property('location');
    expect(err.location).to.be.an('object');

    const loc = err.location;
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

Then('the response message should contain {string}', function(expectedMessage) {
  const responseBody = this.getResponseBody();
  expect(responseBody).to.have.property('message');
  expect(responseBody.message).to.be.a('string');
  expect(responseBody.message).to.include(expectedMessage);
});
