/* eslint-env jest */
import '@testing-library/jest-dom';

jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });
jest.mock('chartjs-adapter-date-fns', () => ({}));
