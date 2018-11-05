require('expect-more-jest');
const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') }); // use test env

const IntlPolyfill = require('intl'); // tslint:disable-line

// Jest and node only support English locale
// Therefore we add the polyfill for unit testing
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
