/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';

import WeatherBlock from '../../../components/common/WeatherBlock';

// Mock the utils
jest.mock('../../../utils/Utils', () => ({
  getWeatherIcon: jest.fn(),
  getWeatherIconWithTippy: jest.fn(),
}));

const { getWeatherIconWithTippy } = require('../../../utils/Utils');

describe('WeatherBlock', () => {
  const mockWeatherData = {
    temperature: 75.6,
    uvIndex: 8.2,
    weatherSummary: 'Partly cloudy',
    weatherIcon: 'partly-cloudy-day',
    precipitationIntensity: 0.1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the weather icon function to return a simple span
    getWeatherIconWithTippy.mockReturnValue(
      <span data-testid='weather-icon'>☀️</span>,
    );
  });

  test('renders weather block with all weather data', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    expect(screen.getByText('76')).toBeInTheDocument(); // Rounded temperature
    expect(screen.getByText('8.2')).toBeInTheDocument(); // UV Index
    expect(screen.getByText('°F')).toBeInTheDocument();
    expect(screen.getByText('UVI')).toBeInTheDocument();
    expect(screen.getByTestId('weather-icon')).toBeInTheDocument();
  });

  test('does not render when weather data is null', () => {
    const { container } = render(<WeatherBlock weather={null} />);

    expect(container.querySelector('.WeatherBlock')).not.toBeInTheDocument();
  });

  test('does not render when weather data is undefined', () => {
    const { container } = render(<WeatherBlock weather={undefined} />);

    expect(container.querySelector('.WeatherBlock')).not.toBeInTheDocument();
  });

  test('rounds temperature to nearest integer', () => {
    const weatherWithDecimals = {
      ...mockWeatherData,
      temperature: 75.9,
    };

    render(<WeatherBlock weather={weatherWithDecimals} />);

    expect(screen.getByText('76')).toBeInTheDocument();
  });

  test('handles negative temperatures', () => {
    const coldWeather = {
      ...mockWeatherData,
      temperature: -10.3,
    };

    render(<WeatherBlock weather={coldWeather} />);

    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  test('displays UV Index with decimals', () => {
    const weatherWithUV = {
      ...mockWeatherData,
      uvIndex: 10.55,
    };

    render(<WeatherBlock weather={weatherWithUV} />);

    expect(screen.getByText('10.55')).toBeInTheDocument();
  });

  test('handles zero UV Index', () => {
    const weatherWithZeroUV = {
      ...mockWeatherData,
      uvIndex: 0,
    };

    render(<WeatherBlock weather={weatherWithZeroUV} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('calls getWeatherIconWithTippy with correct parameters', () => {
    render(<WeatherBlock weather={mockWeatherData} />);

    expect(getWeatherIconWithTippy).toHaveBeenCalledWith(
      'Partly cloudy',
      'partly-cloudy-day',
      0.1,
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <WeatherBlock className='custom-class' weather={mockWeatherData} />,
    );

    const weatherBlock = container.querySelector('.WeatherBlock');
    expect(weatherBlock).toHaveClass('custom-class');
  });

  test('applies custom wrapperClassName', () => {
    const { container } = render(
      <WeatherBlock
        weather={mockWeatherData}
        wrapperClassName='wrapper-class'
      />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('wrapper-class');
  });

  test('applies default CSS classes', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    const weatherBlock = container.querySelector('.WeatherBlock');
    expect(weatherBlock).toHaveClass(
      'WeatherBlock',
      'text-black',
      'dark:text-gray-100',
      'flex',
      'items-center',
      'font-bold',
      'mt-1',
    );
  });

  test('has correct structure and layout classes', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    // Check temperature and UV container
    const dataContainer = container.querySelector('.flex.flex-col.justify-end');
    expect(dataContainer).toBeInTheDocument();

    // Check units container
    const unitsContainer = container.querySelector(
      '.ml-1.flex.flex-col.items-start.justify-end',
    );
    expect(unitsContainer).toBeInTheDocument();

    // Check icon container
    const iconContainer = container.querySelector(
      '.ml-2\\.5.text-\\[2\\.5rem\\]',
    );
    expect(iconContainer).toBeInTheDocument();
  });

  test('temperature and UV Index have correct styling', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    const temperatureSpan = screen.getByText('76').closest('span');
    expect(temperatureSpan).toHaveClass(
      'flex',
      'h-5',
      'justify-end',
      'text-lg',
      'font-bold',
      'leading-5',
    );

    const uvSpan = screen.getByText('8.2').closest('span');
    expect(uvSpan).toHaveClass(
      'flex',
      'h-5',
      'justify-end',
      'text-lg',
      'font-bold',
      'leading-5',
    );
  });

  test('units have correct styling', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    const fahrenheitSpan = screen.getByText('°F').closest('span');
    expect(fahrenheitSpan).toHaveClass(
      'flex',
      'h-5',
      'justify-start',
      'text-xs',
      'font-normal',
      'leading-5',
    );

    const uviSpan = screen.getByText('UVI').closest('span');
    expect(uviSpan).toHaveClass(
      'flex',
      'h-5',
      'justify-start',
      'text-xs',
      'font-normal',
      'leading-5',
    );
  });

  test('handles partial weather data gracefully', () => {
    const partialWeather = {
      temperature: 70,
      // Missing uvIndex, weatherSummary, etc.
    };

    render(<WeatherBlock weather={partialWeather} />);

    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
    expect(screen.getByText('UVI')).toBeInTheDocument();

    // Should handle undefined values gracefully
    expect(getWeatherIconWithTippy).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
  });

  test('handles weather data with null values', () => {
    const weatherWithNulls = {
      temperature: null,
      uvIndex: null,
      weatherSummary: null,
      weatherIcon: null,
      precipitationIntensity: null,
    };

    const { container } = render(<WeatherBlock weather={weatherWithNulls} />);

    // Should still render the structure but with null values
    expect(container.querySelector('.WeatherBlock')).toBeInTheDocument();
    expect(getWeatherIconWithTippy).toHaveBeenCalledWith(null, null, null);
  });

  test('renders empty wrapper when no weather data', () => {
    const { container } = render(
      <WeatherBlock weather={null} wrapperClassName='test-wrapper' />,
    );

    expect(container.firstChild).toHaveClass('test-wrapper');
    expect(container.querySelector('.WeatherBlock')).not.toBeInTheDocument();
  });

  test('className defaults to empty string', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    const weatherBlock = container.querySelector('.WeatherBlock');
    // Should not have any additional classes from undefined className
    expect(weatherBlock.className).not.toContain('undefined');
  });

  test('weather icon has correct size styling', () => {
    const { container } = render(<WeatherBlock weather={mockWeatherData} />);

    const iconContainer = container.querySelector('.text-\\[2\\.5rem\\]');
    expect(iconContainer).toHaveClass('ml-2.5', 'text-[2.5rem]');
  });
});
