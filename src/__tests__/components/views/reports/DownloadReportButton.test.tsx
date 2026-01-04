/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Import after all mocks are set up
import DownloadReportButton from '../../../../components/views/reports/DownloadReportButton';

// Mock all the service dependencies that use axios/ES modules - MUST BE FIRST
jest.mock('../../../../services/apiClient', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('../../../../services/services', () => ({
  getDataPage: jest.fn(),
  getDownloadPageSize: jest.fn(),
}));

jest.mock('../../../../services/search', () => ({
  ALL: 'ALL',
  DAY: 86400000,
}));

jest.mock('../../../../components/views/reports/ReportUtils', () => ({
  transformRowData: jest.fn(),
  DEVICE_ID_KEYWORD: 'device-id.keyword',
  ENERGY_CONSUMED: 'energyConsumed',
  SITE_ID_KEYWORD: 'siteId.keyword',
  TOTAL_ENERGY_CONS: 'totalEnergyConsumed',
  TOTAL_REAL_POWER: 'totalRealPower',
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(),
    formatNumber: jest.fn((value) => value.toString()),
  }),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
  ToastContainer: function MockToastContainer() {
    return <div data-testid='toast-container' />;
  },
}));

jest.mock('react-csv/lib/core', () => ({
  jsons2csv: jest.fn(),
}));

// Need to get mocked functions for testing
const services = require('../../../../services/services');
const ReportUtils = require('../../../../components/views/reports/ReportUtils');
const { jsons2csv } = require('react-csv/lib/core');
const { toast } = require('react-toastify');

// Mock DOM methods
Object.defineProperty(window, 'URL', {
  value: { createObjectURL: jest.fn(() => 'mock-blob-url') },
});

describe('DownloadReportButton', () => {
  const defaultProps = {
    siteId: 'ALL',
    deviceId: 'ALL',
    filterErrors: 'false',
    start: new Date('2024-01-01').getTime(),
    end: new Date('2024-01-31').getTime(),
    timeFormatter: jest.fn((date) => date.toLocaleDateString()),
    deviceMap: {
      'site-1': 'Site A',
      'device-1': 'Device 1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mocks
    services.getDownloadPageSize.mockResolvedValue({
      data: {
        hits: {
          total: { value: 1 },
          hits: [],
        },
        aggregations: {},
      },
    });

    // Mock getDataPage to return data once, then empty to stop recursion
    services.getDataPage
      .mockResolvedValueOnce({
        data: {
          hits: {
            total: { value: 1 },
            hits: [{ fields: { '@timestamp': ['2024-01-15T10:30:00Z'] } }],
          },
          aggregations: {},
        },
      })
      .mockResolvedValue({
        data: {
          hits: {
            total: { value: 0 },
            hits: [],
          },
          aggregations: {},
        },
      });

    ReportUtils.transformRowData.mockReturnValue({
      time: '10:30 AM',
      'siteId.keyword': 'Site A',
    });

    jsons2csv.mockReturnValue('csv,data');
  });

  test('renders download button', () => {
    render(<DownloadReportButton {...defaultProps} />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  test('renders toast container', () => {
    render(<DownloadReportButton {...defaultProps} />);
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('calls download service when clicked', async () => {
    render(<DownloadReportButton {...defaultProps} />);

    fireEvent.click(screen.getByText('Download'));

    expect(services.getDownloadPageSize).toHaveBeenCalledWith(
      null,
      null,
      'false',
      defaultProps.start.toString(),
      defaultProps.end.toString(),
      0,
      10000,
    );
  });

  test('shows error toast on API failure', async () => {
    services.getDownloadPageSize.mockRejectedValue(new Error('API Error'));

    render(<DownloadReportButton {...defaultProps} />);

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error creating report file',
        expect.objectContaining({ position: 'bottom-right' }),
      );
    });
  });

  test('initiates download process when clicked', async () => {
    render(<DownloadReportButton {...defaultProps} />);

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(services.getDownloadPageSize).toHaveBeenCalledWith(
        null,
        null,
        'false',
        defaultProps.start.toString(),
        defaultProps.end.toString(),
        0,
        10000,
      );
    });

    await waitFor(() => {
      expect(services.getDataPage).toHaveBeenCalled();
    });
  });
});
