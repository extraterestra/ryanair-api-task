class CurlGenerator {
  /**
   * Generate curl command from request details
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} url - Full URL
   * @param {object} headers - Request headers
   * @param {object} body - Request body (for POST/PUT)
   * @returns {string} curl command
   */
  generate(method, url, headers = {}, body = null) {
    let curl = `curl --location --request ${method} '${url}'`;

    // Add headers
    Object.entries(headers).forEach(([key, value]) => {
      curl += ` \\\n--header '${key}: ${value}'`;
    });

    // Add body if present
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      curl += ` \\\n--data '${bodyString}'`;
    }

    return curl;
  }
}

module.exports = new CurlGenerator();
