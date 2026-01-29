# Ryanair API Test Automation Framework

A comprehensive API test automation framework built with Cucumber.js, Chai, and Axios for testing user and booking management endpoints.

## Project Overview

This framework provides automated testing capabilities for:
- **User Management**: Create, retrieve, and list users
- **Booking Management**: Create, retrieve, and list bookings with filtering options
- **Data Validation**: Schema validation and error handling

The framework uses Behavior-Driven Development (BDD) with Cucumber.js, allowing tests to be written in Gherkin syntax for better readability and collaboration.

## Tech Stack

- **Cucumber.js** - BDD test framework
- **Chai** - Assertion library
- **Axios** - HTTP client for API requests
- **Mocha** - Alternative test runner
- **Nock** - HTTP mocking library
- **Supertest** - HTTP assertion library

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ryanair-api-task
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- @cucumber/cucumber
- axios
- chai
- and other dependencies listed in package.json

## Running Tests

### Run All Tests

Execute all test scenarios:

```bash
npm test
```

or

```bash
npx cucumber-js
```

### Run Tests by Tag

#### Run Smoke Tests Only

```bash
npx cucumber-js --tags "@smoke"
```

#### Run Regression Tests Only

```bash
npx cucumber-js --tags "@regression"
```

#### Run Tests by Feature Area

Run all user-related tests:
```bash
npx cucumber-js --tags "@user"
```

Run all booking-related tests:
```bash
npx cucumber-js --tags "@booking"
```

#### Combine Multiple Tags

Run tests with multiple tags (AND):
```bash
npx cucumber-js --tags "@smoke and @user"
```

Run tests with either tag (OR):
```bash
npx cucumber-js --tags "@smoke or @booking"
```

Exclude specific tags:
```bash
npx cucumber-js --tags "not @smoke"
```

### Run Specific Feature File

Run a single feature file:

```bash
npx cucumber-js features/getUsers.feature
```

```bash
npx cucumber-js features/postUser.feature
```

### Run Specific Scenario by Name

Run scenarios matching a specific name pattern:

```bash
npx cucumber-js --name "Successfully retrieve"
```

## Test Reports

After running tests, an HTML report is automatically generated:

- **Location**: `cucumber-report.html` (root directory)
- **Open**: Simply open the file in your browser to view detailed test results

## Project Structure

```
ryanair-api-tau/
├── config/
│   └── apiConfig.js          # API configuration and base URLs
├── features/
│   ├── *.feature             # Gherkin feature files
│   ├── step_definitions/     # Step implementations
│   │   ├── commonSteps.js    # Shared step definitions
│   │   ├── getUsers.steps.js
│   │   ├── postUser.steps.js
│   │   └── ...
│   └── support/
│       └── world.js          # Test context and setup
├── models/
│   └── dataSchemas.js        # Data schemas for validation
├── specs/
│   └── bookingSpec.js        # Mocha test specs
├── utils/
│   ├── curlGenerator.js      # Generate cURL commands for debugging
│   └── logger.js             # Logging utilities
├── cucumber.js               # Cucumber configuration
├── package.json              # Dependencies and scripts
└── cucumber-report.html      # Generated test report
```

## Available Test Tags

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@user` - User management tests
- `@booking` - Booking management tests

## Example Test Scenarios

### User Management
- Create new users
- Retrieve user by ID
- List all users
- Handle invalid user IDs

### Booking Management
- Create new bookings
- Retrieve booking by ID
- List bookings with filters (userID, date)
- Handle invalid booking requests

## Configuration

API configuration can be modified in:
- `config/apiConfig.js` - Base URL, timeouts, and other settings

## Troubleshooting

### Tests Failing to Run
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version`
- Verify API endpoints are accessible

### Report Not Generated
- Check file permissions in the project directory
- Ensure tests complete without crashing

### Step Definition Conflicts
- Each step pattern must be unique
- Check `features/step_definitions/` for duplicate patterns

## Contributing

1. Create a feature branch
2. Write tests following BDD principles
3. Ensure all tests pass
4. Submit a pull request

## Support

For issues or questions, please create an issue in the repository.
