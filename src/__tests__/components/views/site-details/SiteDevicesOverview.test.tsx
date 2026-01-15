import { fireEvent, render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import SiteDevicesOverview from '../../../../components/views/site-details/SiteDevicesOverview';
import {
  getAggregationValue,
  getBucketSize,
  getInformationalErrorInfo,
  parseCurrentAmperage,
  parseCurrentPower,
  parseCurrentVoltage,
  parseMaxData,
  parseSearchReturn,
} from '../../../../services/search';
import type { SearchResponse } from '../../../../types/api';
import type { Alarm, Device } from '../../../../types/models';
import {
  getDisplayName,
  getRoundedTimeFromOffset,
} from '../../../../utils/Utils';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock search services
vi.mock('../../../../services/search', () => ({
  AVG_AGGREGATION: 'avg',
  TOTAL_AGGREGATION: 'total',
  getAggregationValue: vi.fn(),
  getBucketSize: vi.fn(() => '1m'),
  getInformationalErrorInfo: vi.fn(),
  parseCurrentAmperage: vi.fn(),
  parseCurrentPower: vi.fn(),
  parseCurrentVoltage: vi.fn(),
  parseMaxData: vi.fn(),
  parseSearchReturn: vi.fn(),
}));

// Mock Utils
vi.mock('../../../../utils/Utils', () => ({
  getDisplayName: vi.fn(),
  getRoundedTimeFromOffset: vi.fn(),
}));

// Mock components
vi.mock('../../../../components/common/CurrentPowerBlock', () => {
  const MockCurrentPowerBlock = function ({
    activeAlert,
    currentPower,
    max,
  }: {
    activeAlert: boolean;
    currentPower: number;
    max: number;
  }) {
    return (
      <div
        data-active-alert={activeAlert}
        data-current-power={currentPower}
        data-max={max}
        data-testid='current-power-block'
      >
        Current Power Block
      </div>
    );
  };
  return { default: MockCurrentPowerBlock };
});

vi.mock('../../../../components/device-block/DeviceBlock', () => {
  const MockDeviceBlock = function ({
    title,
    subtitle,
    body,
    statBlocks,
    informationalErrors,
    informationalErrorsLink,
    reportLink,
    truncationLength,
  }: {
    title: string;
    subtitle: string;
    body: React.ReactNode;
    statBlocks: React.ReactNode[];
    informationalErrors: unknown;
    informationalErrorsLink: string;
    reportLink: string;
    truncationLength: number;
  }) {
    return (
      <div
        data-informational-errors={JSON.stringify(informationalErrors)}
        data-informational-errors-link={informationalErrorsLink}
        data-report-link={reportLink}
        data-testid='device-block'
        data-title={title}
        data-truncation-length={truncationLength}
      >
        <div data-testid='device-title'>{title}</div>
        <div data-testid='device-subtitle'>{subtitle}</div>
        <div data-testid='device-body'>{body}</div>
        <div data-testid='device-stat-blocks'>
          {statBlocks.map((block, index) => (
            <div key={index}>{block}</div>
          ))}
        </div>
      </div>
    );
  };
  return { default: MockDeviceBlock };
});

vi.mock('../../../../components/device-block/StackedAlertsInfo', () => {
  const MockStackedAlertsInfo = function ({
    activeAlerts,
    resolvedAlerts,
    className,
    onClick,
  }: {
    activeAlerts: number;
    resolvedAlerts: number;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <div
        className={className}
        data-active-alerts={activeAlerts}
        data-resolved-alerts={resolvedAlerts}
        data-testid='stacked-alerts-info'
        onClick={onClick}
      >
        Alerts: {activeAlerts}/{resolvedAlerts}
      </div>
    );
  };
  return { default: MockStackedAlertsInfo };
});

vi.mock(
  '../../../../components/device-block/StackedCurrentVoltageBlock',
  () => {
    const MockStackedCurrentVoltageBlock = function ({
      current,
      voltage,
    }: {
      current: number;
      voltage: number;
    }) {
      return (
        <div
          data-current={current}
          data-testid='stacked-current-voltage-block'
          data-voltage={voltage}
        >
          Current/Voltage Block
        </div>
      );
    };
    return { default: MockStackedCurrentVoltageBlock };
  },
);

vi.mock('../../../../components/device-block/StackedTotAvg', () => {
  const MockStackedTotAvg = function ({
    total,
    avg,
    className,
  }: {
    total: number;
    avg: number;
    className?: string;
  }) {
    return (
      <div
        className={className}
        data-avg={avg}
        data-testid='stacked-tot-avg'
        data-total={total}
      >
        Total/Avg Block
      </div>
    );
  };
  return { default: MockStackedTotAvg };
});

vi.mock('../../../../components/graphs/MiniChart', () => {
  const MockMiniChart = function ({ graphData }: { graphData: unknown }) {
    return (
      <div data-graph-data={JSON.stringify(graphData)} data-testid='mini-chart'>
        Mini Chart
      </div>
    );
  };
  return { default: MockMiniChart };
});

const renderWithRouter = (component: ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('SiteDevicesOverview', () => {
  const mockDevices: Device[] = [
    {
      id: 'device1',
      deviceName: 'Inverter 1',
      siteId: 'site1',
      name: 'Solar Inverter 1',
    },
    {
      id: 'device2',
      deviceName: 'Inverter 2',
      siteId: 'site1',
      name: 'Solar Inverter 2',
    },
  ];

  const mockActiveSiteAlerts: Alarm[] = [
    {
      deviceId: 'device1',
      id: 'alert1',
      message: 'High temperature',
      timestamp: 1234567890,
    },
    {
      deviceId: 'device1',
      id: 'alert2',
      message: 'Low voltage',
      timestamp: 1234567891,
    },
    {
      deviceId: 'device2',
      id: 'alert3',
      message: 'Connection issue',
      timestamp: 1234567892,
    },
  ];

  const mockResolvedSiteAlerts: Alarm[] = [
    {
      deviceId: 'device1',
      id: 'alert4',
      message: 'Resolved issue',
      timestamp: 1234567893,
    },
    {
      deviceId: 'device2',
      id: 'alert5',
      message: 'Fixed connection',
      timestamp: 1234567894,
    },
    {
      deviceId: 'device2',
      id: 'alert6',
      message: 'Updated firmware',
      timestamp: 1234567895,
    },
  ];

  const mockAvgData: Record<string, SearchResponse> = {
    device1: { aggregations: { avg: { value: 1500 } }, hits: { hits: [] } },
    device2: { aggregations: { avg: { value: 1200 } }, hits: { hits: [] } },
  };

  const mockTotalData: Record<string, SearchResponse> = {
    device1: { aggregations: { total: { value: 5000 } }, hits: { hits: [] } },
    device2: { aggregations: { total: { value: 4000 } }, hits: { hits: [] } },
  };

  const mockTimeSeriesData: Record<string, SearchResponse> = {
    device1: {
      aggregations: {},
      hits: {
        hits: [
          { fields: { timestamp: [1234567890], value: [1000] } },
          { fields: { timestamp: [1234567900], value: [1200] } },
        ],
      },
    },
    device2: {
      aggregations: {},
      hits: {
        hits: [
          { fields: { timestamp: [1234567890], value: [800] } },
          { fields: { timestamp: [1234567900], value: [900] } },
        ],
      },
    },
  };

  const mockMaxData: Record<string, SearchResponse> = {
    device1: {
      aggregations: {
        power: { value: 2500 },
        voltage: { value: 220 },
        amperage: { value: 10 },
      },
      hits: { hits: [] },
    },
    device2: {
      aggregations: {
        power: { value: 2000 },
        voltage: { value: 240 },
        amperage: { value: 8 },
      },
      hits: { hits: [] },
    },
  };

  const mockTimeIncrement = 7;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    (getRoundedTimeFromOffset as vi.Mock).mockReturnValue(
      new Date('2023-01-01'),
    );
    (getDisplayName as vi.Mock).mockImplementation(
      (device: Device) => device.name,
    );
    (getBucketSize as vi.Mock).mockReturnValue('1m');
    (parseSearchReturn as vi.Mock).mockImplementation(
      (data: SearchResponse) => data,
    );
    (getInformationalErrorInfo as vi.Mock).mockReturnValue([]);
    (parseCurrentPower as vi.Mock).mockImplementation(
      (data: SearchResponse) => data?.aggregations?.power?.value || 0,
    );
    (parseMaxData as vi.Mock).mockImplementation(
      (data: SearchResponse) => data?.aggregations?.power?.value || 0,
    );
    (parseCurrentAmperage as vi.Mock).mockImplementation(
      (data: SearchResponse) => data?.aggregations?.amperage?.value || 0,
    );
    (parseCurrentVoltage as vi.Mock).mockImplementation(
      (data: SearchResponse) => data?.aggregations?.voltage?.value || 0,
    );
    (getAggregationValue as vi.Mock).mockImplementation(
      (data: SearchResponse, type: string) => {
        if (type === 'avg') return data?.aggregations?.avg?.value || 0;
        if (type === 'total') return data?.aggregations?.total?.value || 0;
        return 0;
      },
    );
  });

  test('renders main container with correct CSS classes', () => {
    const { container } = renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const overview = container.querySelector('.SiteDevicesOverview');
    expect(overview).toHaveClass('SiteDevicesOverview', 'w-full');
  });

  test('displays correct device count', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    expect(screen.getByText('2 Devices')).toBeInTheDocument();
  });

  test('renders grid container with correct CSS classes', () => {
    const { container } = renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'sm:grid-cols-2');
  });

  test('renders DeviceBlock for each device', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');
    expect(deviceBlocks).toHaveLength(2);
  });

  test('passes correct props to DeviceBlock components', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');

    // Check first device
    expect(deviceBlocks[0]).toHaveAttribute('data-title', 'Solar Inverter 1');
    expect(deviceBlocks[0]).toHaveAttribute('data-truncation-length', '20');

    // Check second device
    expect(deviceBlocks[1]).toHaveAttribute('data-title', 'Solar Inverter 2');
  });

  test('calculates active alerts correctly for each device', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const alertsInfo = screen.getAllByTestId('stacked-alerts-info');

    // Device 1: 2 active alerts, 1 resolved alert
    expect(alertsInfo[0]).toHaveAttribute('data-active-alerts', '2');
    expect(alertsInfo[0]).toHaveAttribute('data-resolved-alerts', '1');

    // Device 2: 1 active alert, 2 resolved alerts
    expect(alertsInfo[1]).toHaveAttribute('data-active-alerts', '1');
    expect(alertsInfo[1]).toHaveAttribute('data-resolved-alerts', '2');
  });

  test('generates correct report links for each device', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');

    // Check report links contain device and site IDs
    const reportLink1 = deviceBlocks[0]?.getAttribute('data-report-link');
    expect(reportLink1).toContain('deviceId=device1');
    expect(reportLink1).toContain('siteId=site1');
    expect(reportLink1).toContain('start=');
    expect(reportLink1).toContain('end=');

    const reportLink2 = deviceBlocks[1]?.getAttribute('data-report-link');
    expect(reportLink2).toContain('deviceId=device2');
    expect(reportLink2).toContain('siteId=site1');
  });

  test('generates correct informational errors links', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');

    // Check informational errors links include err=true parameter
    const errorLink1 = deviceBlocks[0]?.getAttribute(
      'data-informational-errors-link',
    );
    expect(errorLink1).toContain('err=true');
    expect(errorLink1).toContain('deviceId=device1');

    const errorLink2 = deviceBlocks[1]?.getAttribute(
      'data-informational-errors-link',
    );
    expect(errorLink2).toContain('err=true');
    expect(errorLink2).toContain('deviceId=device2');
  });

  test('renders MiniChart with correct data for each device', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const miniCharts = screen.getAllByTestId('mini-chart');
    expect(miniCharts).toHaveLength(2);

    // Verify parseSearchReturn was called with correct data (with fallback to empty response)
    expect(parseSearchReturn).toHaveBeenCalledWith(
      expect.objectContaining({
        aggregations: expect.any(Object),
        hits: expect.any(Object),
      }),
      '1m',
    );
  });

  test('renders CurrentPowerBlock with correct data', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const powerBlocks = screen.getAllByTestId('current-power-block');
    expect(powerBlocks).toHaveLength(2);

    // Device 1 has 2 active alerts, so activeAlert should be true
    expect(powerBlocks[0]).toHaveAttribute('data-active-alert', 'true');

    // Device 2 has 1 active alert, so activeAlert should be true
    expect(powerBlocks[1]).toHaveAttribute('data-active-alert', 'true');
  });

  test('renders StackedTotAvg with aggregated data', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const totAvgBlocks = screen.getAllByTestId('stacked-tot-avg');
    expect(totAvgBlocks).toHaveLength(2);

    // Check CSS classes
    expect(totAvgBlocks[0]).toHaveClass('items-end');
    expect(totAvgBlocks[1]).toHaveClass('items-end');
  });

  test('renders StackedCurrentVoltageBlock with parsed data', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const voltageBlocks = screen.getAllByTestId(
      'stacked-current-voltage-block',
    );
    expect(voltageBlocks).toHaveLength(2);

    // Verify parsing functions were called
    expect(parseCurrentAmperage).toHaveBeenCalledWith(mockMaxData.device1);
    expect(parseCurrentVoltage).toHaveBeenCalledWith(mockMaxData.device1);
    expect(parseCurrentAmperage).toHaveBeenCalledWith(mockMaxData.device2);
    expect(parseCurrentVoltage).toHaveBeenCalledWith(mockMaxData.device2);
  });

  test('clicking alerts navigates to alerts page with device filter', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const alertsInfo = screen.getAllByTestId('stacked-alerts-info');

    // Click on first device alerts
    const [firstAlert, secondAlert] = alertsInfo;
    if (firstAlert) {
      fireEvent.click(firstAlert);
    }
    expect(mockNavigate).toHaveBeenCalledWith('/alerts?deviceId=device1');

    // Click on second device alerts
    if (secondAlert) {
      fireEvent.click(secondAlert);
    }
    expect(mockNavigate).toHaveBeenCalledWith('/alerts?deviceId=device2');
  });

  test('calls service functions with correct parameters', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    // Verify utility functions were called
    expect(getDisplayName).toHaveBeenCalledWith(mockDevices[0]);
    expect(getDisplayName).toHaveBeenCalledWith(mockDevices[1]);
    expect(getRoundedTimeFromOffset).toHaveBeenCalledWith(mockTimeIncrement);

    // Verify search functions were called
    expect(getInformationalErrorInfo).toHaveBeenCalledWith(
      mockTimeSeriesData.device1,
    );
    expect(getInformationalErrorInfo).toHaveBeenCalledWith(
      mockTimeSeriesData.device2,
    );
  });

  test('handles empty devices array', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={[]}
        avgData={{}}
        devices={[]}
        maxData={{}}
        resolvedSiteAlerts={[]}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={{}}
        totalData={{}}
      />,
    );

    expect(screen.getByText('0 Devices')).toBeInTheDocument();
    expect(screen.queryByTestId('device-block')).not.toBeInTheDocument();
  });

  test('handles devices with no alerts', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={[]}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={[]}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const alertsInfo = screen.getAllByTestId('stacked-alerts-info');

    // Both devices should have 0 alerts
    expect(alertsInfo[0]).toHaveAttribute('data-active-alerts', '0');
    expect(alertsInfo[0]).toHaveAttribute('data-resolved-alerts', '0');
    expect(alertsInfo[1]).toHaveAttribute('data-active-alerts', '0');
    expect(alertsInfo[1]).toHaveAttribute('data-resolved-alerts', '0');
  });

  test('handles missing data gracefully', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={{}}
        devices={mockDevices}
        maxData={{}}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={{}}
        totalData={{}}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');
    expect(deviceBlocks).toHaveLength(2);

    // Component should still render without crashing
    expect(screen.getByText('2 Devices')).toBeInTheDocument();
  });

  test('device titles and subtitles are displayed correctly', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    // Check device titles (from getDisplayName)
    expect(screen.getByText('Solar Inverter 1')).toBeInTheDocument();
    expect(screen.getByText('Solar Inverter 2')).toBeInTheDocument();

    // Check device subtitles (deviceName)
    expect(screen.getByText('Inverter 1')).toBeInTheDocument();
    expect(screen.getByText('Inverter 2')).toBeInTheDocument();
  });

  test('alerts info has correct CSS classes', () => {
    renderWithRouter(
      <SiteDevicesOverview
        activeSiteAlerts={mockActiveSiteAlerts}
        avgData={mockAvgData}
        devices={mockDevices}
        maxData={mockMaxData}
        resolvedSiteAlerts={mockResolvedSiteAlerts}
        timeIncrement={mockTimeIncrement}
        timeSeriesData={mockTimeSeriesData}
        totalData={mockTotalData}
      />,
    );

    const alertsInfo = screen.getAllByTestId('stacked-alerts-info');

    alertsInfo.forEach((info) => {
      expect(info).toHaveClass('items-end', 'justify-center');
    });
  });
});
