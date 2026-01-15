import '@testing-library/jest-dom';

import { webcrypto } from 'crypto';
// Polyfills for React Router v7
import { TextDecoder, TextEncoder } from 'util';
import { vi } from 'vitest';

// Type-safe global assignments
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill for uuid v13+ (requires Web Crypto API)
if (!global.crypto) {
  global.crypto = webcrypto as Crypto;
}

// Mock CSS imports
vi.mock('@aws-amplify/ui-react/styles.css', () => ({}));
vi.mock('chartjs-adapter-date-fns', () => ({}));
vi.mock('react-data-grid/lib/styles.css', () => ({}));
vi.mock('react-day-picker/style.css', () => ({}));
vi.mock('react-toastify/dist/ReactToastify.css', () => ({}));
vi.mock(
  '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css',
  () => ({}),
);
vi.mock('react-calendar/dist/Calendar.css', () => ({}));

// Mock aws-exports
vi.mock('./aws-exports', () => ({
  default: {},
}));
