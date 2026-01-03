import Tippy from '@tippyjs/react';
import { format } from 'date-fns';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { BsCloudSleet } from 'react-icons/bs';
import { IoIosSnow, IoMdRainy } from 'react-icons/io';
import { IoPartlySunnyOutline } from 'react-icons/io5';
import { MdFoggy, MdOutlineWbCloudy, MdOutlineWbSunny } from 'react-icons/md';
import { RiWindyFill } from 'react-icons/ri';

import { noSite } from '../components/views/site-management/SiteManagement';
import { DAY, HOUR, MONTH, WEEK, YEAR } from '../services/search';
import type { Device } from '../types/models';

export const TIPPY_DELAY = 500;

export function defaultIfEmpty<T>(
  defaultValue: T,
  value: T | null | undefined | '',
): T {
  return value === null || value === undefined || value === ''
    ? defaultValue
    : value;
}

export function useSearchParamState(
  defaultValue: string,
  key: string,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void,
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(() => {
    return defaultIfEmpty(defaultValue, searchParams.get(key));
  });
  useEffect(() => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  }, [key, value, searchParams, setSearchParams]);
  return [value, setValue];
}

export function useStickyState<T>(
  defaultValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    if (stickyValue === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(stickyValue) as T;
    } catch (e) {
      return defaultValue;
    }
  });
  useEffect(() => {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}

export const getFormattedShortTime = (date: Date): string => {
  return format(date, 'M/d h:mmaaaaa');
};

export const getFormattedTime = (date: Date): string => {
  return format(date, 'MMM d, yy h:mm aaa');
};

export const getFormattedDate = (date: Date): string => {
  return format(date, 'MMM d, yy');
};

export const formatXAxisLabelsDay = (value: number | Date): string => {
  return format(value, 'h:mmaaaaa');
};

export const formatXAxisLabels = (value: number | Date): string => {
  const d = new Date(value);
  if (d.getHours() % 6 !== 0 || d.getMinutes() !== 0) {
    return '';
  }
  return format(d, d.getHours() === 0 ? 'MMM d' : 'ha');
};

export const getDisplayName = (device?: Device | null): string | undefined => {
  return device?.name == null ? device?.deviceName : device?.name;
};

export const findSiteNameFromSiteId = (
  siteId: string,
  devices: Device[],
): string | undefined => {
  if (siteId === noSite) {
    return noSite;
  }
  return getDisplayName(devices.find((d) => d.id === siteId));
};

export const getDeviceIdToNameMap = (
  devices: Device[],
): Record<string, string> => {
  return devices.reduce(
    (acc, obj) => {
      acc[obj.id] = getDisplayName(obj) ?? '';
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const compare = (
  value1: string | undefined,
  value2: string | undefined,
): number => {
  if (value1 === undefined || value2 === undefined) {
    return 0;
  }
  return value1.localeCompare(value2, undefined, {
    sensitivity: 'accent',
  });
};

export const sortDevices = (d1: Device, d2: Device): number => {
  const siteSort = compare(d1.site, d2.site);
  if (siteSort !== 0) {
    return siteSort;
  }
  return compare(getDisplayName(d1), getDisplayName(d2));
};

export const sortDevicesWithDisabled = (d1: Device, d2: Device): number => {
  const siteSort = compare(d1.site, d2.site);
  if (siteSort !== 0) {
    return siteSort;
  }
  if (d1.disabled !== d2.disabled) {
    return d1.disabled ? 1 : -1;
  }
  return compare(getDisplayName(d1), getDisplayName(d2));
};

export const getRoundedTimeFromOffset = (offset: number): Date => {
  return offset === HOUR
    ? new Date(new Date().getTime() - offset)
    : getRoundedTime(false, offset === DAY ? 0 : offset);
};

export const getRoundedTime = (roundedUp: boolean, offset: number): Date => {
  const date = new Date();
  if (!roundedUp) {
    date.setHours(0, 0, 0, 0);
    return new Date(date.getTime() - offset);
  }
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getFormattedDaysHoursMinutes = (
  time: number | undefined,
): string => {
  if (time === undefined || time === 0) {
    return '';
  }
  const timeInSeconds = time / 1000;
  const days = ~~(timeInSeconds / 86400);
  const hours = ~~((timeInSeconds / 3600) % 24);
  let minutes = ~~((timeInSeconds % 3600) / 60);
  let formattedTime = '';
  if (days > 0) {
    formattedTime += `${days}d `;
  }
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (days === 0 && hours === 0 && minutes === 0) {
    minutes = 1;
  }
  return `${formattedTime}${minutes}m`;
};

// TODO: Expand to include more weather types/night weather, use consistent icons
export const getWeatherIconWithTippy = (
  weatherSummary?: string,
  weatherIcon?: string,
  precipIntensity: number = 0,
): ReactElement => {
  const content = (
    <>
      <div>{`${weatherSummary ?? ''} `}</div>
      <div>
        {precipIntensity > 0 &&
          `Intensity: ${roundToDecimals(precipIntensity, 100)} in/hr`}
      </div>
    </>
  );
  return (
    <Tippy content={content} delay={TIPPY_DELAY} placement='bottom'>
      <div>{getWeatherIcon(weatherIcon ?? '')}</div>
    </Tippy>
  );
};

// https://github.com/Pirate-Weather/pirateweather/blob/ffdf06e415106443b50761ffd403989184dd3ee7/DevPortal/custom-content/content-fragments/Home.md?plain=1#L53
export const getWeatherIcon = (weatherIcon: string): ReactElement | string => {
  if (weatherIcon === 'cloudy') {
    return <MdOutlineWbCloudy className='align-self-center' />;
  } else if (
    weatherIcon === 'partly-cloudy-day' ||
    weatherIcon === 'partly-cloudy-night'
  ) {
    return <IoPartlySunnyOutline className='align-self-center' />;
  } else if (weatherIcon === 'fog') {
    return <MdFoggy className='align-self-center' />;
  } else if (weatherIcon === 'clear-day' || weatherIcon === 'clear-night') {
    return <MdOutlineWbSunny className='align-self-center' />;
  } else if (weatherIcon === 'snow') {
    return <IoIosSnow className='align-self-center' />;
  } else if (weatherIcon === 'wind') {
    return <RiWindyFill className='align-self-center' />;
  } else if (weatherIcon === 'rain') {
    return <IoMdRainy className='align-self-center' />;
  } else if (weatherIcon === 'sleet') {
    return <BsCloudSleet className='align-self-center' />;
  }
  return weatherIcon;
};

export const timeIncrementToText = (
  timeIncrement: number,
  short: boolean,
): string => {
  switch (timeIncrement) {
    case HOUR:
      return short ? 'H' : 'Hour';
    case DAY:
      return short ? 'D' : 'Day';
    case WEEK:
      return short ? 'Wk' : 'Week';
    case MONTH:
      return short ? 'Mo' : 'Month';
    case YEAR:
      return short ? 'Yr' : 'Year';
    default:
      return short ? 'D' : 'Day';
  }
};

export const formatMessage = function (message: string): string {
  const unixSec = /\d{10}/.exec(message);
  if (unixSec == null) {
    return message;
  }
  const unixMS = /\d{13}/.exec(message);
  const timestamp =
    Number(unixMS == null ? unixSec : unixMS) * (unixMS == null ? 1000 : 1);
  const finalMatch = unixMS == null ? unixSec : unixMS;
  // Replace timestamp w/local time
  return message.replace(
    new RegExp(finalMatch[0], 'g'),
    getFormattedTime(new Date(timestamp)),
  );
};

export const timeLabel = function (startDate: Date, increment: number): string {
  return `${getFormattedDate(startDate)} - ${getFormattedDate(
    new Date(Math.min(startDate.getTime() + increment, new Date().getTime())),
  )}`;
};

/**
 * Handle bounds checking for setting new start date.  DAY allows up to current time,
 * other time periods need a full "offset" of time shown to change
 * @param startDate
 * @param increment
 * @param setStartDate
 * @param setNextDisabled
 */
export const maybeSetTimeWindow = (
  startDate: Date,
  increment: number,
  setStartDate: (date: Date) => void,
  setNextDisabled: (disabled: boolean) => void,
): void => {
  const time = startDate.getTime() + increment;
  if (
    (increment === DAY && time < new Date().getTime()) ||
    time + increment < new Date().getTime()
  ) {
    setStartDate(new Date(time));
  }
  const endDate = time + Math.abs(increment);
  const enabled =
    (increment === DAY && endDate < new Date().getTime()) ||
    endDate + increment < new Date().getTime();

  setNextDisabled(!enabled);
};

export const roundToDecimals = (
  number: number | string,
  decimals: number,
): number | string => {
  const rounded = Math.round(Number(number) * decimals) / decimals;
  if (Number.isNaN(rounded)) {
    // Handle string inputs for backwards compatibility
    if (typeof number === 'string') {
      if (number.indexOf('.') !== -1) {
        return number.substring(0, number.indexOf('.'));
      }
      return number;
    }
    // Return 0 for NaN numeric values instead of displaying NaN
    return 0;
  }
  return rounded;
};

export const roundTwoDigit = (number: number): number => {
  return roundToDecimals(number, 100) as number;
};

export const truncate = (str: string, n: number): string => {
  return str.length > n ? `${str.slice(0, n - 1).trim()}...` : str;
};

export const getPowerScalingInformation = (
  power: number,
): {
  unitPrefix: string;
  powerValue: number;
  decimals: number;
} => {
  if (power > 1000000)
    return { unitPrefix: 'G', powerValue: power / 1000000, decimals: 10 };
  if (power > 1000)
    return { unitPrefix: 'M', powerValue: power / 1000, decimals: 100 };
  return { unitPrefix: 'k', powerValue: power, decimals: 10 };
};

export const isXS = (windowSize: { current: [number, number] }): boolean => {
  return windowSize.current[0] <= 500;
};

export const getDaysLeftInTrial = (date: number | null | undefined): string => {
  if (date == null || typeof date !== 'number' || isNaN(date)) {
    return '';
  }
  const days = Math.round((date + DAY * 90 - new Date().getTime()) / DAY);
  if (days <= 0) {
    return 'Trial Expired!';
  }
  return `${days} day${days > 1 ? 's' : ''} left`;
};

export const transformMultiLineForHTMLDisplay = function (
  error: string,
): ReactElement {
  const errors = error.replace(/(?:\r\n|\r|\n)/g, '<br>').split('<br>');
  return (
    <span>
      {errors.map((str, index) => (
        <div key={index}>
          {str}
          {index < errors.length - 1 && <br />}{' '}
        </div>
      ))}
    </span>
  );
};
