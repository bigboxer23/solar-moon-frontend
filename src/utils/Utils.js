import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { MdFoggy, MdOutlineWbCloudy, MdOutlineWbSunny } from 'react-icons/md';
import { IoPartlySunnyOutline } from 'react-icons/io5';
import moment from 'moment';
import { DAY, HOUR, MONTH, WEEK, YEAR } from '../services/search';

export function preventSubmit(event) {
  if (event.key === 'Enter') {
    //Don't submit the form
    event.preventDefault();
    event.stopPropagation();
  }
}
export const onEnterPressed = (event, functionToRun) => {
  if (event.key === 'Enter') {
    functionToRun();
  }
};

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

export const getFormattedTime = (date) => {
  return d3.timeFormat('%b %d, %y %I:%M %p')(date);
};

export const sortDevices = (d1, d2) =>
  (d1.name == null ? d1.deviceName : d1.name).localeCompare(
    d2.name == null ? d2.deviceName : d2.name,
    undefined,
    { sensitivity: 'accent' },
  );

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

export const splitDayAndNightDataSets = (data) => {
  let dayData = [];
  let nightData = [];
  data.forEach((d) => {
    const hour = moment(d.date).hour();

    if (hour > 5 && hour < 18) {
      dayData.push(d);
      nightData.push({ date: d.date, values: null });
    } else if (hour === 18 || hour === 5) {
      dayData.push(d);
      nightData.push(d);
    } else {
      nightData.push(d);
      dayData.push({ date: d.date, values: null });
    }
  });
  return [dayData, nightData];
};

export const getFormattedDaysHoursMinutes = (time) => {
  if (time === undefined || time === 0) {
    return '';
  }
  time = time / 1000;
  let days = ~~(time / 86400);
  let hours = ~~(time / 3600);
  let minutes = ~~((time % 3600) / 60);
  //let seconds = ~~time % 60;
  let formattedTime = '';
  if (days > 0) {
    formattedTime += days + 'd ';
  }
  if (hours > 0) {
    formattedTime += hours + 'h ';
  }
  if (days === 0 && hours === 0 && minutes === 0) {
    minutes = 1;
  }
  return formattedTime + minutes + 'm';
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
  //Replace timestamp w/local time
  return message.replaceAll(finalMatch, getFormattedTime(new Date(timestamp)));
};
