/* eslint-env jest */
import '@testing-library/jest-dom';

// Polyfills for React Router v7
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });
jest.mock('chartjs-adapter-date-fns', () => ({}));
