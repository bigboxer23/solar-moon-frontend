import classNames from 'classnames';

import { getWeatherIcon } from '../../../utils/Utils';

// TODO: Pretty UV Index

export default function WeatherBlock({ weather, className = '' }) {
  const style = classNames(
    'WeatherBlock flex items-center self-end text-5xl font-bold',
    className,
  );

  return (
    <div className={style} title={weather.weatherSummary}>
      <span>{weather.uvIndex}</span>
      <span className='self-start text-lg'>UV Index</span>
      <span>{Math.round(weather.temperature)}</span>
      <span className='self-start text-lg'>°F</span>
      <span className='text-4xl'>{getWeatherIcon(weather.weatherSummary)}</span>
    </div>
  );
}
