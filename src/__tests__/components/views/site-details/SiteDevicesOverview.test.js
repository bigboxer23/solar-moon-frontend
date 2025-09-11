/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import SiteDevicesOverview from '../../../../components/views/site-details/SiteDevicesOverview';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock search services
jest.mock('../../../../services/search', () => ({
  AVG_AGGREGATION: 'avg',
  TOTAL_AGGREGATION: 'total',
  getAggregationValue: jest.fn(),
  getInformationalErrorInfo: jest.fn(),
  parseCurrentAmperage: jest.fn(),
  parseCurrentPower: jest.fn(),
  parseCurrentVoltage: jest.fn(),
  parseMaxData: jest.fn(),
  parseSearchReturn: jest.fn(),
}));

// Mock Utils
jest.mock('../../../../utils/Utils', () => ({
  getDisplayName: jest.fn(),
  getRoundedTimeFromOffset: jest.fn(),
}));

// Mock components
jest.mock('../../../../components/common/CurrentPowerBlock', () => {
  return function MockCurrentPowerBlock({ activeAlert, currentPower, max }) {
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
});

jest.mock('../../../../components/device-block/DeviceBlock', () => {
  return function MockDeviceBlock({
    title,
    subtitle,
    body,
    statBlocks,
    informationalErrors,
    informationalErrorsLink,
    reportLink,
    truncationLength,
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
});

jest.mock('../../../../components/device-block/StackedAlertsInfo', () => {
  return function MockStackedAlertsInfo({
    activeAlerts,
    resolvedAlerts,
    className,
    onClick,
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
});

jest.mock(
  '../../../../components/device-block/StackedCurrentVoltageBlock',
  () => {
    return function MockStackedCurrentVoltageBlock({ current, voltage }) {
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
  },
);

jest.mock('../../../../components/device-block/StackedTotAvg', () => {
  return function MockStackedTotAvg({ total, avg, className }) {
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
});

jest.mock('../../../../components/graphs/MiniChart', () => {
  return function MockMiniChart({ graphData }) {
    return (
      <div data-graph-data={JSON.stringify(graphData)} data-testid='mini-chart'>
        Mini Chart
      </div>
    );
  };
});

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('SiteDevicesOverview', () => {
  const {
    getAggregationValue,
    getInformationalErrorInfo,
    parseCurrentAmperage,
    parseCurrentPower,
    parseCurrentVoltage,
    parseMaxData,
    parseSearchReturn,
  } = require('../../../../services/search');

  const {
    getDisplayName,
    getRoundedTimeFromOffset,
  } = require('../../../../utils/Utils');

  const mockDevices = [
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

  const mockActiveSiteAlerts = [
    { deviceId: 'device1', id: 'alert1', message: 'High temperature' },
    { deviceId: 'device1', id: 'alert2', message: 'Low voltage' },
    { deviceId: 'device2', id: 'alert3', message: 'Connection issue' },
  ];

  const mockResolvedSiteAlerts = [
    { deviceId: 'device1', id: 'alert4', message: 'Resolved issue' },
    { deviceId: 'device2', id: 'alert5', message: 'Fixed connection' },
    { deviceId: 'device2', id: 'alert6', message: 'Updated firmware' },
  ];

  const mockAvgData = {
    device1: { avg: 1500 },
    device2: { avg: 1200 },
  };

  const mockTotalData = {
    device1: { total: 5000 },
    device2: { total: 4000 },
  };

  const mockTimeSeriesData = {
    device1: [
      { timestamp: 1234567890, value: 1000 },
      { timestamp: 1234567900, value: 1200 },
    ],
    device2: [
      { timestamp: 1234567890, value: 800 },
      { timestamp: 1234567900, value: 900 },
    ],
  };

  const mockMaxData = {
    device1: { power: 2500, voltage: 220, amperage: 10 },
    device2: { power: 2000, voltage: 240, amperage: 8 },
  };

  const mockTimeIncrement = { days: 7 };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    getRoundedTimeFromOffset.mockReturnValue(new Date('2023-01-01'));
    getDisplayName.mockImplementation((device) => device.name);
    parseSearchReturn.mockImplementation((data) => data);
    getInformationalErrorInfo.mockReturnValue([]);
    parseCurrentPower.mockImplementation((data) => data?.power || 0);
    parseMaxData.mockImplementation((data) => data?.power || 0);
    parseCurrentAmperage.mockImplementation((data) => data?.amperage || 0);
    parseCurrentVoltage.mockImplementation((data) => data?.voltage || 0);
    getAggregationValue.mockImplementation((data, type) => {
      if (type === 'avg') return data?.avg || 0;
      if (type === 'total') return data?.total || 0;
      return 0;
    });
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
    const reportLink1 = deviceBlocks[0].getAttribute('data-report-link');
    expect(reportLink1).toContain('deviceId=device1');
    expect(reportLink1).toContain('siteId=site1');
    expect(reportLink1).toContain('start=');
    expect(reportLink1).toContain('end=');

    const reportLink2 = deviceBlocks[1].getAttribute('data-report-link');
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
    const errorLink1 = deviceBlocks[0].getAttribute(
      'data-informational-errors-link',
    );
    expect(errorLink1).toContain('err=true');
    expect(errorLink1).toContain('deviceId=device1');

    const errorLink2 = deviceBlocks[1].getAttribute(
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

    // Verify parseSearchReturn was called with correct data
    expect(parseSearchReturn).toHaveBeenCalledWith(mockTimeSeriesData.device1);
    expect(parseSearchReturn).toHaveBeenCalledWith(mockTimeSeriesData.device2);
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
    fireEvent.click(alertsInfo[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/alerts?deviceId=device1');

    // Click on second device alerts
    fireEvent.click(alertsInfo[1]);
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
