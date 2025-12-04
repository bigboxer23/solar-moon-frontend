/* eslint-env jest */
import '@testing-library/jest-dom';

import { webcrypto } from 'crypto';
// Polyfills for React Router v7
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for uuid v13+ (requires Web Crypto API)
if (!global.crypto) {
  global.crypto = webcrypto;
}

jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });
jest.mock('chartjs-adapter-date-fns', () => ({}));
jest.mock('react-data-grid/lib/styles.css', () => ({}), { virtual: true });
jest.mock('react-day-picker/style.css', () => ({}), { virtual: true });
jest.mock('react-toastify/dist/ReactToastify.css', () => ({}), {
  virtual: true,
});
jest.mock(
  '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css',
  () => ({}),
  { virtual: true },
);
jest.mock('react-calendar/dist/Calendar.css', () => ({}), {
  virtual: true,
});
