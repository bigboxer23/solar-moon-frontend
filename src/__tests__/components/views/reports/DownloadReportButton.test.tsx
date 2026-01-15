import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// Need to get mocked functions for testing
import { jsons2csv } from 'react-csv/lib/core';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

// Import after all mocks are set up
import DownloadReportButton from '../../../../components/views/reports/DownloadReportButton';
import * as ReportUtils from '../../../../components/views/reports/ReportUtils';
import * as services from '../../../../services/services';

// Mock all the service dependencies that use axios/ES modules - MUST BE FIRST
vi.mock('../../../../services/apiClient', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('../../../../services/services', () => ({
  getDataPage: vi.fn(),
  getDownloadPageSize: vi.fn(),
}));

vi.mock('../../../../services/search', () => ({
  ALL: 'ALL',
  DAY: 86400000,
}));

vi.mock('../../../../components/views/reports/ReportUtils', () => ({
  transformRowData: vi.fn(),
  DEVICE_ID_KEYWORD: 'device-id.keyword',
  ENERGY_CONSUMED: 'energyConsumed',
  SITE_ID_KEYWORD: 'siteId.keyword',
  TOTAL_ENERGY_CONS: 'totalEnergyConsumed',
  TOTAL_REAL_POWER: 'totalRealPower',
}));

vi.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: vi.fn(),
    formatNumber: vi.fn((value) => value.toString()),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
  ToastContainer: function MockToastContainer() {
    return <div data-testid='toast-container' />;
  },
}));

vi.mock('react-csv/lib/core', () => ({
  jsons2csv: vi.fn(),
}));

// Mock DOM methods
Object.defineProperty(window, 'URL', {
  value: { createObjectURL: vi.fn(() => 'mock-blob-url') },
});

describe('DownloadReportButton', () => {
  const defaultProps = {
    siteId: 'ALL',
    deviceId: 'ALL',
    filterErrors: 'false',
    start: new Date('2024-01-01').getTime(),
    end: new Date('2024-01-31').getTime(),
    timeFormatter: vi.fn((date) => date.toLocaleDateString()),
    deviceMap: {
      'site-1': 'Site A',
      'device-1': 'Device 1',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

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
