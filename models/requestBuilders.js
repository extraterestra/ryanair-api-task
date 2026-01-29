/**
 * Base Request Builder
 * Provides common header management for all API requests
 */
class BaseRequestBuilder {
  constructor() {
    this.headers = {
      'Accept': 'application/json'
    };
  }

  /**
   * Add a single header
   * @param {string} key - Header name
   * @param {string} value - Header value
   * @returns {BaseRequestBuilder} - Returns this for chaining
   */
  withHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  /**
   * Add multiple headers at once
   * @param {Object} headers - Headers object
   * @returns {BaseRequestBuilder} - Returns this for chaining
   */
  withHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Set Content-Type header
   * @param {string} contentType - Content type (default: application/json)
   * @returns {BaseRequestBuilder} - Returns this for chaining
   */
  withContentType(contentType = 'application/json') {
    this.headers['Content-Type'] = contentType;
    return this;
  }

  /**
   * Get all configured headers
   * @returns {Object} - Headers object
   */
  getHeaders() {
    return { ...this.headers };
  }
}

/**
 * Booking Request Builder
 * Handles construction of booking-related requests (GET with filters, POST with body)
 */
class BookingRequestBuilder extends BaseRequestBuilder {
  constructor() {
    super();
    this.body = {};
    this.queryParams = {};
  }

  // ===== Body setters for POST requests =====

  /**
   * Set booking date
   * @param {string} date - Booking date
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  withDate(date) {
    this.body.date = date;
    return this;
  }

  /**
   * Set booking destination
   * @param {string} destination - Destination location
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  withDestination(destination) {
    this.body.destination = destination;
    return this;
  }

  /**
   * Set booking origin
   * @param {string} origin - Origin location
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  withOrigin(origin) {
    this.body.origin = origin;
    return this;
  }

  /**
   * Set user ID for the booking
   * @param {number|string} userId - User ID
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  withUserId(userId) {
    this.body.userId = userId;
    return this;
  }

  /**
   * Set multiple booking fields at once
   * @param {Object} data - Booking data object
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  withBookingData(data) {
    this.body = { ...this.body, ...data };
    return this;
  }

  // ===== Query parameter setters for GET requests =====

  /**
   * Add userId filter for GET requests
   * @param {number|string} userId - User ID to filter by
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  filterByUserId(userId) {
    if (userId !== undefined && userId !== null) {
      this.queryParams.userId = userId;
    }
    return this;
  }

  /**
   * Add date filter for GET requests
   * @param {string} date - Date to filter by
   * @returns {BookingRequestBuilder} - Returns this for chaining
   */
  filterByDate(date) {
    if (date !== undefined && date !== null) {
      this.queryParams.date = date;
    }
    return this;
  }

  /**
   * Get request body with only defined properties
   * @returns {Object} - Request body object
   */
  getBody() {
    return Object.entries(this.body).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  /**
   * Get query string from configured parameters
   * @returns {string} - Query string (with ? prefix if params exist, empty string otherwise)
   */
  getQueryString() {
    const params = Object.entries(this.queryParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return params ? `?${params}` : '';
  }

  /**
   * Build the final request object
   * @returns {Object} - Object containing headers, body, and queryString
   */
  build() {
    return {
      headers: this.getHeaders(),
      body: this.getBody(),
      queryString: this.getQueryString()
    };
  }
}

/**
 * User Request Builder
 * Handles construction of user-related requests (GET with filters, POST with body)
 */
class UserRequestBuilder extends BaseRequestBuilder {
  constructor() {
    super();
    this.body = {};
    this.queryParams = {};
  }

  // ===== Body setters for POST requests =====

  /**
   * Set user name
   * @param {string} name - User's first name
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  withName(name) {
    this.body.name = name;
    return this;
  }

  /**
   * Set user surname
   * @param {string} surname - User's last name
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  withSurname(surname) {
    this.body.surname = surname;
    return this;
  }

  /**
   * Set user email
   * @param {string} email - User's email address
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  withEmail(email) {
    this.body.email = email;
    return this;
  }

  /**
   * Generate and set a unique email address
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  withGeneratedEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.body.email = `test.user.${timestamp}.${random}@example.com`;
    return this;
  }

  /**
   * Set multiple user fields at once
   * @param {Object} data - User data object
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  withUserData(data) {
    this.body = { ...this.body, ...data };
    return this;
  }

  // ===== Query parameter setters for GET requests (for future use) =====

  /**
   * Add name filter for GET requests
   * @param {string} name - Name to filter by
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  filterByName(name) {
    if (name !== undefined && name !== null) {
      this.queryParams.name = name;
    }
    return this;
  }

  /**
   * Add email filter for GET requests
   * @param {string} email - Email to filter by
   * @returns {UserRequestBuilder} - Returns this for chaining
   */
  filterByEmail(email) {
    if (email !== undefined && email !== null) {
      this.queryParams.email = email;
    }
    return this;
  }

  /**
   * Get request body with only defined properties
   * @returns {Object} - Request body object
   */
  getBody() {
    return Object.entries(this.body).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  /**
   * Get query string from configured parameters
   * @returns {string} - Query string (with ? prefix if params exist, empty string otherwise)
   */
  getQueryString() {
    const params = Object.entries(this.queryParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return params ? `?${params}` : '';
  }

  /**
   * Build the final request object
   * @returns {Object} - Object containing headers, body, and queryString
   */
  build() {
    return {
      headers: this.getHeaders(),
      body: this.getBody(),
      queryString: this.getQueryString()
    };
  }
}

module.exports = {
  BookingRequestBuilder,
  UserRequestBuilder
};
