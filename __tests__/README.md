# Sales Property Management Test Ground

This directory includes unit and functional tests for the `Sales Property Management` React Native app. The tests are written using [Jest](https://jestjs.io/) and [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/).

## Prerequisites

Before running the tests, make sure the following dependencies are installed:

- Node.js (v16+ recommended)
- Yarn or npm
- React Native development environment
- [Jest](https://jestjs.io/) (included as a dev dependency)
- [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)
- [expo-router](https://expo.github.io/router/) (if you're using Expo Router in the project)

To install dependencies:

```bash
yarn install
# or
npm install
```

## Running Tests

To run all test suites:

```bash
yarn test
# or
npm test
```

## Necessary Configurations/Setup Files

This test ground uses the following configuration files:

- **Jest configuration in `package.json`** to configure Jest for React Native and Expo compatibility.
- **`jest.setup.js`** to configure global setup logic and custom test utilities.
- **`tsconfig.json`** to configure TypeScript path aliases (e.g., `@/src/...`) for cleaner imports.
