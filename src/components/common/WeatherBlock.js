import classNames from 'classnames';

import { getWeatherIcon } from '../../utils/Utils';

// TODO: Pretty UV Index

export default function WeatherBlock({ weather, className = '' }) {
  const style = classNames(
    'WeatherBlock text-black dark:text-white flex items-center font-bold mt-1',
    className,
  );

  return (
    <div className={style} title={weather.weatherSummary}>
      <div className='flex flex-col justify-end'>
        <span className='flex h-5 justify-end text-lg font-bold leading-5'>
          {Math.round(weather.temperature)}
        </span>
        <span className='flex h-5 justify-end text-lg font-bold leading-5'>
          {weather.uvIndex}
        </span>
      </div>
      <div className='ml-1 flex flex-col items-start justify-end'>
        <span className='flex h-5 justify-start text-xs font-normal leading-5'>
          °F
        </span>
        <span className='flex h-5 justify-start text-xs font-normal leading-5'>
          UVI
        </span>
      </div>
      <span className='ml-2.5 text-[2.5rem]'>
        {getWeatherIcon(weather.weatherSummary)}
      </span>
    </div>
  );
}
