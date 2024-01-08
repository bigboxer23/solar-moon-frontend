import classNames from 'classnames';

import { getWeatherIcon } from '../../../utils/Utils';

// TODO: UV Index?

export default function WeatherBlock({
  temperature,
  weatherSummary = 'Partly Cloudy',
  className = '',
}) {
  const style = classNames(
    'WeatherBlock flex items-center self-end text-5xl font-bold',
    className,
  );

  return (
    <div className={style} title={weatherSummary}>
      <span>{temperature}</span>
      <span className='self-start text-lg'>°F</span>
      <span className='text-4xl'>{getWeatherIcon(weatherSummary)}</span>
    </div>
  );
}
