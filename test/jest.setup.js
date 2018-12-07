require('expect-more-jest');
require('./supertest.matcher');

const IntlPolyfill = require('intl'); // tslint:disable-line

// Jest and node only support English locale
// Therefore we add the polyfill for unit testing
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
