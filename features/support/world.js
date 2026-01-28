const { World } = require('@cucumber/cucumber');
const axios = require('axios');
const apiConfig = require('../../config/apiConfig');

class ApiWorld extends World {
  constructor(options) {
    super(options);
    this.response = null;
    this.bookingId = null;
    this.baseUrl = apiConfig.api.baseUrl;
    this.endpoint = apiConfig.api.booking.endpoint;
    this.error = null;
  }

  async makeRequest(method, path) {
    try {
      const url = `${this.baseUrl}${this.endpoint}${path}`;
      this.response = await axios({
        method,
        url,
        headers: {
          'Accept': 'application/json',
        },
        validateStatus: () => true, // Don't throw on any status code
      });
    } catch (error) {
      this.error = error;
      throw error;
    }
  }

  getResponseStatus() {
    return this.response?.status;
  }

  getResponseBody() {
    return this.response?.data;
  }

  getResponseField(fieldName) {
    return this.response?.data[fieldName];
  }
}

module.exports = ApiWorld;
