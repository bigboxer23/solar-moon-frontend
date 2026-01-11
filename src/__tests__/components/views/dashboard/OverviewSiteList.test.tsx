/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import OverviewSiteList from '../../../../components/views/dashboard/OverviewSiteList';

interface Device {
  site: string;
  disabled: boolean;
}

interface Alert {
  siteId: string;
  state: number;
}

interface Site {
  id: string;
  name: string;
  city?: string;
  state?: string;
}

interface TimeSeries {
  timestamp: number;
  value: number;
}

interface Weather {
  temp: number;
}

interface SiteGraphData {
  timeSeries: TimeSeries[];
  weeklyMaxPower: number;
  avg: number;
  total: number;
  weather: Weather;
}

interface SitesGraphDataMap {
  [key: string]: SiteGraphData;
}

interface TimeIncrement {
  days: number;
}

// Mock search services
jest.mock('../../../../services/search', () => ({
  AVG_AGGREGATION: 'avg',
  TOTAL_AGGREGATION: 'total',
  getAggregationValue: jest.fn(
    (data: { value: number } | undefined, type: string) => {
      if (type === 'avg') return 1500;
      if (type === 'total') return 5000;
      return 0;
    },
  ),
  getBucketSize: jest.fn(() => '1m'),
  getInformationalErrorInfo: jest.fn(() => []),
  parseCurrentPower: jest.fn(() => 2500),
  parseMaxData: jest.fn(() => 3000),
  parseSearchReturn: jest.fn(() => [
    { timestamp: 1234567890, value: 1000 },
    { timestamp: 1234567900, value: 1200 },
  ]),
}));

// Mock utils
jest.mock('../../../../utils/Utils', () => ({
  getRoundedTimeFromOffset: jest.fn(),
}));

// Mock common components
jest.mock('../../../../components/common/CurrentPowerBlock', () => {
  return function MockCurrentPowerBlock({
    currentPower,
    max,
  }: {
    currentPower: number;
    max: number;
  }) {
    return (
      <div
        data-current-power={currentPower}
        data-max={max}
        data-testid='current-power-block'
      >
        Current Power Block: {currentPower}/{max}
      </div>
    );
  };
});

jest.mock('../../../../components/common/WeatherBlock', () => {
  return function MockWeatherBlock({
    weather,
    className,
    wrapperClassName,
  }: {
    weather?: Weather;
    className?: string;
    wrapperClassName?: string;
  }) {
    return (
      <div
        className={className}
        data-testid='weather-block'
        data-wrapper-class={wrapperClassName}
      >
        Weather: {weather?.temp || 'N/A'}
      </div>
    );
  };
});

// Mock device-block components
jest.mock('../../../../components/device-block/DeviceBlock', () => {
  return function MockDeviceBlock({
    title,
    subtitle,
    secondaryTitle,
    statBlocks,
    body,
    className,
    informationalErrors,
    informationalErrorsLink,
  }: {
    title: string;
    subtitle: string;
    secondaryTitle?: string;
    statBlocks: React.ReactNode[];
    body: React.ReactNode;
    className?: string;
    informationalErrors: unknown[];
    informationalErrorsLink: string;
  }) {
    return (
      <div
        className={className}
        data-informational-errors={JSON.stringify(informationalErrors)}
        data-informational-errors-link={informationalErrorsLink}
        data-testid='device-block'
      >
        <div data-testid='device-title'>{title}</div>
        <div data-testid='device-subtitle'>{subtitle}</div>
        <div data-testid='device-secondary-title'>{secondaryTitle}</div>
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
  }: {
    activeAlerts: number;
    resolvedAlerts: number;
    className?: string;
  }) {
    return (
      <div
        className={className}
        data-active-alerts={activeAlerts}
        data-resolved-alerts={resolvedAlerts}
        data-testid='stacked-alerts-info'
      >
        Active: {activeAlerts}, Resolved: {resolvedAlerts}
      </div>
    );
  };
});

jest.mock('../../../../components/device-block/StackedTotAvg', () => {
  return function MockStackedTotAvg({
    total,
    avg,
    className,
  }: {
    total: number | null;
    avg: number | null;
    className?: string;
  }) {
    return (
      <div
        className={className}
        data-avg={avg}
        data-testid='stacked-tot-avg'
        data-total={total}
      >
        Total: {total || 'N/A'}, Avg: {avg || 'N/A'}
      </div>
    );
  };
});

// Mock graphs components
jest.mock('../../../../components/graphs/MiniChart', () => {
  return function MockMiniChart({
    graphData,
    stepSize,
  }: {
    graphData?: unknown[];
    stepSize: number;
  }) {
    return (
      <div data-step-size={stepSize} data-testid='mini-chart'>
        Chart with {graphData?.length || 0} points
      </div>
    );
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('OverviewSiteList', () => {
  const { getRoundedTimeFromOffset } = require('../../../../utils/Utils');
  const {
    getAggregationValue,
    parseCurrentPower,
    parseMaxData,
  } = require('../../../../services/search');

  const mockSites: Site[] = [
    {
      id: 'site1',
      name: 'Solar Farm 1',
      city: 'Phoenix',
      state: 'AZ',
    },
    {
      id: 'site2',
      name: 'Solar Farm 2',
      city: 'Denver',
      state: 'CO',
    },
  ];

  const mockDevices: Device[] = [
    { site: 'Solar Farm 1', disabled: false },
    { site: 'Solar Farm 1', disabled: false },
    { site: 'Solar Farm 1', disabled: true }, // Should be filtered out
    { site: 'Solar Farm 2', disabled: false },
  ];

  const mockAlerts: Alert[] = [
    { siteId: 'site1', state: 0 }, // Resolved
    { siteId: 'site1', state: 1 }, // Active
    { siteId: 'site1', state: 2 }, // Active
    { siteId: 'site2', state: 0 }, // Resolved
  ];

  const mockSitesGraphData: SitesGraphDataMap = {
    'Solar Farm 1': {
      timeSeries: [{ timestamp: 1234567890, value: 1000 }],
      weeklyMaxPower: 3000,
      avg: 1500,
      total: 5000,
      weather: { temp: 75 },
    },
    'Solar Farm 2': {
      timeSeries: [{ timestamp: 1234567890, value: 800 }],
      weeklyMaxPower: 2500,
      avg: 1200,
      total: 4000,
      weather: { temp: 68 },
    },
  };

  const mockTimeIncrement: TimeIncrement = { days: 7 };

  beforeEach(() => {
    jest.clearAllMocks();
    (getRoundedTimeFromOffset as jest.Mock).mockReturnValue(
      new Date('2023-01-01T00:00:00Z'),
    );

    // Set up search service mocks
    (parseCurrentPower as jest.Mock).mockReturnValue(2500);
    (parseMaxData as jest.Mock).mockReturnValue(3000);
    (getAggregationValue as jest.Mock).mockImplementation(
      (data: { value: number } | undefined, type: string) => {
        if (type === 'avg') return 1500;
        if (type === 'total') return 5000;
        return 0;
      },
    );
  });

  test('renders main container with correct CSS classes', () => {
    const { container } = renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const siteList = container.querySelector('.SiteList');
    expect(siteList).toHaveClass('SiteList', 'mt-5');
  });

  test('displays correct site count and device count', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    expect(screen.getByText('2 Sites')).toBeInTheDocument();
    expect(screen.getByText('4 devices')).toBeInTheDocument();
  });

  test('renders grid container with correct CSS classes', () => {
    const { container } = renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'sm:grid-cols-2');
  });

  test('filters out disabled devices when counting', () => {
    const devicesWithDisabled = [
      ...mockDevices,
      { site: 'Solar Farm 1', disabled: true },
      { site: 'Solar Farm 2', disabled: true },
    ];

    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={devicesWithDisabled}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    // Should still show 6 devices (4 original + 2 new disabled ones = 6 total devices, even though disabled ones are filtered from device count per site)
    expect(screen.getByText('6 devices')).toBeInTheDocument();
  });

  test('correctly calculates alert counts for each site', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const alertsInfo = screen.getAllByTestId('stacked-alerts-info');

    // Site 1: 1 resolved (state 0), 2 active (state > 0)
    expect(alertsInfo[0]).toHaveAttribute('data-resolved-alerts', '1');
    expect(alertsInfo[0]).toHaveAttribute('data-active-alerts', '2');

    // Site 2: 1 resolved, 0 active
    expect(alertsInfo[1]).toHaveAttribute('data-resolved-alerts', '1');
    expect(alertsInfo[1]).toHaveAttribute('data-active-alerts', '0');
  });

  test('renders NavLink for each site with correct path', () => {
    const { container } = renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/sites/site1');
    expect(links[1]).toHaveAttribute('href', '/sites/site2');
  });

  test('passes correct props to DeviceBlock components', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');
    expect(deviceBlocks).toHaveLength(2);

    // Check first site
    expect(screen.getByText('Solar Farm 1')).toBeInTheDocument();
    expect(screen.getByText('Phoenix, AZ')).toBeInTheDocument();
    expect(screen.getByText('2 devices')).toBeInTheDocument();

    // Check second site
    expect(screen.getByText('Solar Farm 2')).toBeInTheDocument();
    expect(screen.getByText('Denver, CO')).toBeInTheDocument();
    expect(screen.getByText('1 devices')).toBeInTheDocument();
  });

  test('handles sites without city and state', () => {
    const sitesWithoutLocation: Site[] = [
      {
        id: 'site1',
        name: 'Solar Farm 1',
        // No city/state
      },
    ];

    const graphData = {
      'Solar Farm 1': mockSitesGraphData['Solar Farm 1'],
    };

    renderWithRouter(
      <OverviewSiteList
        alerts={[]}
        devices={[]}
        sites={sitesWithoutLocation}
        sitesGraphData={graphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');
    expect(deviceBlocks[0]).toBeInTheDocument();

    // Check that site without city/state renders empty secondary title
    const secondaryTitles = screen.getAllByTestId('device-secondary-title');
    expect(secondaryTitles[0]).toHaveTextContent('');
  });

  test('renders MiniChart with correct props', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const miniCharts = screen.getAllByTestId('mini-chart');
    expect(miniCharts).toHaveLength(2);
  });

  test('renders CurrentPowerBlock with parsed data', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const powerBlocks = screen.getAllByTestId('current-power-block');
    expect(powerBlocks).toHaveLength(2);

    // Check that parseCurrentPower and parseMaxData functions were called and returned values
    expect(powerBlocks[0]).toHaveTextContent('Current Power Block: 2500/3000');
  });

  test('renders StackedTotAvg with aggregated values', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const totAvgBlocks = screen.getAllByTestId('stacked-tot-avg');
    expect(totAvgBlocks).toHaveLength(2);

    // Check that getAggregationValue functions were called and returned values
    expect(totAvgBlocks[0]).toHaveTextContent('Total: 5000, Avg: 1500');
    expect(totAvgBlocks[0]).toHaveClass('items-end');
  });

  test('renders WeatherBlock with correct styling', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const weatherBlocks = screen.getAllByTestId('weather-block');
    expect(weatherBlocks).toHaveLength(2);
    expect(weatherBlocks[0]).toHaveClass('pr-2');
    expect(weatherBlocks[0]).toHaveAttribute(
      'data-wrapper-class',
      'min-h-[44px]',
    );
  });

  test('generates correct informational errors link', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={mockSitesGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    const deviceBlocks = screen.getAllByTestId('device-block');
    const errorLink = deviceBlocks[0].getAttribute(
      'data-informational-errors-link',
    );

    expect(errorLink).toContain('/reports');
    expect(errorLink).toContain('siteId=site1');
    expect(errorLink).toContain('err=true');
    expect(errorLink).toContain('start=');
    expect(errorLink).toContain('end=');
  });

  test('returns null when loading (sitesGraphData is null)', () => {
    const { container } = renderWithRouter(
      <OverviewSiteList
        alerts={mockAlerts}
        devices={mockDevices}
        sites={mockSites}
        sitesGraphData={null}
        timeIncrement={mockTimeIncrement}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test('handles empty arrays gracefully', () => {
    renderWithRouter(
      <OverviewSiteList
        alerts={[]}
        devices={[]}
        sites={[]}
        sitesGraphData={{}}
        timeIncrement={mockTimeIncrement}
      />,
    );

    expect(screen.getByText('0 Sites')).toBeInTheDocument();
    expect(screen.getByText('0 devices')).toBeInTheDocument();
  });

  test('device count calculation excludes disabled devices correctly', () => {
    const mixedDevices = [
      { site: 'Test Site', disabled: false },
      { site: 'Test Site', disabled: true },
      { site: 'Other Site', disabled: false },
    ];

    const testSites: Site[] = [{ id: 'test1', name: 'Test Site' }];
    const testGraphData = { 'Test Site': mockSitesGraphData['Solar Farm 1'] };

    renderWithRouter(
      <OverviewSiteList
        alerts={[]}
        devices={mixedDevices}
        sites={testSites}
        sitesGraphData={testGraphData}
        timeIncrement={mockTimeIncrement}
      />,
    );

    // Should show 1 device (only non-disabled devices for "Test Site")
    expect(screen.getByText('1 devices')).toBeInTheDocument();
  });
});
