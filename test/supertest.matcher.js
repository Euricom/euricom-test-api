const { matcherHint, printReceived, printExpected } = require('jest-matcher-utils');

expect.extend({
  toHaveStatus(actual, expected) {
    const pass = actual.status === expected;
    const bodyMessage = () => {
      const bodyText = JSON.stringify(actual.body, null, 2);
      return bodyText;
    };
    const message = pass
      ? () =>
          `${matcherHint('.not.toHaveStatus')}\n\n` +
          `Expected status not to be ${printReceived(actual.status)}:\n\n ---\n\n${bodyMessage()}`
      : () =>
          `${matcherHint('.toHaveStatus')}\n\n` +
          `Expected value to be ${printExpected(expected)}, instead received ${printReceived(
            actual.status,
          )}\n\n ---\n\n${bodyMessage()}`;
    return { pass, message };
  },
});
