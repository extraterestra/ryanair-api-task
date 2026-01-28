const { World } = require('@cucumber/cucumber');
const axios = require('axios');
const apiConfig = require('../../config/apiConfig');
const logger = require('../../utils/logger');
const curlGenerator = require('../../utils/curlGenerator');

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
      const headers = {
        'Accept': 'application/json',
      };

      // Log request details
      logger.logRequest(method, url, headers);

      // Generate and log curl command
      const curl = curlGenerator.generate(method, url, headers);
      logger.logCurl(curl);

      this.response = await axios({
        method,
        url,
        headers,
        validateStatus: () => true, // Don't throw on any status code
      });

      // Log response details
      logger.logResponse(
        this.response.status,
        this.response.headers,
        this.response.data
      );
    } catch (error) {
      this.error = error;
      logger.logError(error);
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
