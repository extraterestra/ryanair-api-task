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
    this.endpoints = apiConfig.api.endpoints;
    this.error = null;
  }

  async makeRequest(method, path, body = null) {
    try {
      const url = `${this.baseUrl}${path}`;
      const headers = {
        'Accept': 'application/json',
      };

      // Add Content-Type header for POST/PUT requests with body
      if (body && (method === 'POST' || method === 'PUT')) {
        headers['Content-Type'] = 'application/json';
      }

      // Log request details
      logger.logRequest(method, url, headers, body);

      // Generate and log curl command
      const curl = curlGenerator.generate(method, url, headers, body);
      logger.logCurl(curl);

      const config = {
        method,
        url,
        headers,
        validateStatus: () => true, // Don't throw on any status code
      };

      // Add data for POST/PUT requests
      if (body && (method === 'POST' || method === 'PUT')) {
        config.data = body;
      }

      this.response = await axios(config);

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
