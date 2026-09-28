import classNames from 'classnames';
import type { ReactElement } from 'react';

import { getWeatherIconWithTippy } from '../../utils/Utils';

interface WeatherData {
  temperature?: number;
  uvIndex?: number;
  weatherSummary?: string;
  weatherIcon?: string;
  precipitationIntensity?: number;
}

interface WeatherBlockProps {
  weather?: WeatherData;
  className?: string;
  wrapperClassName?: string;
}

// TODO: Pretty UV Index

export default function WeatherBlock({
  weather,
  className = '',
  wrapperClassName = '',
}: WeatherBlockProps): ReactElement {
  const style = classNames(
    'WeatherBlock mt-1 flex items-center font-bold text-black dark:text-gray-100',
    className,
  );

  return (
    <div className={wrapperClassName}>
      {weather && (
        <div className={style}>
          <div className='flex flex-col justify-end'>
            <span className='flex h-5 justify-end text-lg leading-5 font-bold'>
              {Math.round(weather?.temperature ?? 0)}
            </span>
            <span className='flex h-5 justify-end text-lg leading-5 font-bold'>
              {weather?.uvIndex}
            </span>
          </div>
          <div className='ml-1 flex flex-col items-start justify-end'>
            <span className='flex h-5 justify-start text-xs leading-5 font-normal'>
              °F
            </span>
            <span className='flex h-5 justify-start text-xs leading-5 font-normal'>
              UVI
            </span>
          </div>
          <span className='ml-2.5 text-[2.5rem]'>
            {getWeatherIconWithTippy(
              weather?.weatherSummary,
              weather?.weatherIcon,
              weather?.precipitationIntensity,
            )}
          </span>
        </div>
      )}
    </div>
  );
}
