import Tippy from '@tippyjs/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { IoIosSnow, IoMdRainy } from 'react-icons/io';
import { IoPartlySunnyOutline } from 'react-icons/io5';
import { MdFoggy, MdOutlineWbCloudy, MdOutlineWbSunny } from 'react-icons/md';
import { RiWindyFill } from 'react-icons/ri';

import { noSite } from '../components/views/site-management/SiteManagement';
import { DAY, HOUR, MONTH, WEEK, YEAR } from '../services/search';

export const TIPPY_DELAY = 500;

export function defaultIfEmpty(defaultValue, value) {
  return value === null || value === undefined || value === ''
    ? defaultValue
    : value;
}

export function useSearchParamState(
  defaultValue,
  key,
  searchParams,
  setSearchParams,
) {
  const [value, setValue] = useState(() => {
    return defaultIfEmpty(defaultValue, searchParams.get(key));
  });
  useEffect(() => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  }, [key, value]);
  return [value, setValue];
}

export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export const getFormattedShortTime = (date) => {
  return format(date, 'M/d h:mmaaaaa');
};

export const getFormattedTime = (date) => {
  return format(date, 'MMM d, yy h:mm aaa');
};

export const getFormattedDate = (date) => {
  return format(date, 'MMM d, yy');
};

export const formatXAxisLabelsDay = (value) => {
  return format(value, 'h:mmaaaaa');
};

export const formatXAxisLabels = (value, index, ticks) => {
  const d = new Date(value);
  if (d.getHours() % 6 !== 0 || d.getMinutes() !== 0) {
    return '';
  }
  return format(d, d.getHours() === 0 ? 'MMM d' : 'ha');
};

export const getDisplayName = (device) => {
  return device?.name == null ? device?.deviceName : device?.name;
};

export const findSiteNameFromSiteId = (siteId, devices) => {
  if (siteId === noSite) {
    return noSite;
  }
  return getDisplayName(devices.find((d) => d.id === siteId));
};

export const getDeviceIdToNameMap = (devices) => {
  return devices.reduce((acc, obj) => {
    acc[obj.id] = getDisplayName(obj);
    return acc;
  }, {});
};

export const compare = (value1, value2) => {
  if (value1 === undefined || value2 === undefined) {
    return 0;
  }
  return value1.localeCompare(value2, undefined, {
    sensitivity: 'accent',
  });
};

export const sortDevices = (d1, d2) => {
  const siteSort = compare(d1.site, d2.site);
  if (siteSort !== 0) {
    return siteSort;
  }
  return compare(getDisplayName(d1), getDisplayName(d2));
};

export const getRoundedTimeFromOffset = (offset) => {
  return offset === HOUR
    ? new Date(new Date().getTime() - offset)
    : getRoundedTime(false, offset === DAY ? 0 : offset);
};

export const getRoundedTime = (roundedUp, offset) => {
  const date = new Date();
  if (!roundedUp) {
    date.setHours(0, 0, 0, 0);
    return new Date(date.getTime() - offset);
  }
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getFormattedDaysHoursMinutes = (time) => {
  if (time === undefined || time === 0) {
    return '';
  }
  time = time / 1000;
  const days = ~~(time / 86400);
  const hours = ~~((time / 3600) % 24);
  let minutes = ~~((time % 3600) / 60);
  // let seconds = ~~time % 60;
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
  return `${formattedTime + minutes}m`;
};

// TODO: Expand to include more weather types/night weather, use consistent icons
export const getWeatherIconWithTippy = (
  weatherSummary,
  precipIntensity = 0,
) => {
  const content = (
    <>
      <div>{`${weatherSummary} `}</div>
      <div>
        {precipIntensity > 0 &&
          `Intensity: ${roundToDecimals(precipIntensity, 100)} in/hr`}
      </div>
    </>
  );
  return (
    <Tippy content={content} delay={TIPPY_DELAY} placement='bottom'>
      <div>{getWeatherIcon(weatherSummary)}</div>
    </Tippy>
  );
};

export const getWeatherIcon = (weatherSummary) => {
  if (weatherSummary === 'Cloudy') {
    return <MdOutlineWbCloudy className='align-self-center' />;
  } else if (weatherSummary === 'Partly Cloudy') {
    return <IoPartlySunnyOutline className='align-self-center' />;
  } else if (weatherSummary === 'Fog') {
    return <MdFoggy className='align-self-center' />;
  } else if (weatherSummary === 'Clear') {
    return <MdOutlineWbSunny className='align-self-center' />;
  } else if (weatherSummary === 'Snow') {
    return <IoIosSnow className='align-self-center' />;
  } else if (weatherSummary === 'Windy') {
    return <RiWindyFill className='align-self-center' />;
  } else if (weatherSummary === 'Rain') {
    return <IoMdRainy className='align-self-center' />;
  }
  return weatherSummary;
};

export const timeIncrementToText = (timeIncrement, short) => {
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

export const formatMessage = function (message) {
  const unixSec = /\d{10}/.exec(message);
  if (unixSec == null) {
    return message;
  }
  const unixMS = /\d{13}/.exec(message);
  const timestamp =
    Number(unixMS == null ? unixSec : unixMS) * (unixMS == null ? 1000 : 1);
  const finalMatch = unixMS == null ? unixSec : unixMS;
  // Replace timestamp w/local time
  return message.replaceAll(finalMatch, getFormattedTime(new Date(timestamp)));
};

export const timeLabel = function (startDate, increment) {
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
  startDate,
  increment,
  setStartDate,
  setNextDisabled,
) => {
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

export const roundToDecimals = (number, decimals) => {
  const rounded = Math.round(number * decimals) / decimals;
  if (Number.isNaN(rounded)) {
    if (number.indexOf('.') !== -1) {
      return number.substring(0, number.indexOf('.'));
    }
    return number;
  }
  return rounded;
};

export const roundTwoDigit = (number) => {
  return roundToDecimals(number, 10);
};

export const truncate = (str, n) => {
  return str.length > n ? `${str.slice(0, n - 1).trim()}...` : str;
};

export const getPowerScalingInformation = (power) => {
  if (power > 1000000)
    return { unitPrefix: 'G', powerValue: power / 1000000, decimals: 10 };
  if (power > 1000)
    return { unitPrefix: 'M', powerValue: power / 1000, decimals: 100 };
  return { unitPrefix: 'k', powerValue: power, decimals: 10 };
};

export const isXS = (windowSize) => {
  return windowSize.current[0] <= 500;
};

export const getDaysLeftInTrial = (date) => {
  const days = Math.round((date + DAY * 90 - new Date().getTime()) / DAY);
  return `${days} day${days > 1 ? 's' : ''} left`;
};

export const transformMultiLineForHTMLDisplay = function (error) {
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
