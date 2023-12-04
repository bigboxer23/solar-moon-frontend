import { useEffect, useState } from "react";
import * as d3 from "d3";
import { MdFoggy, MdOutlineWbCloudy, MdOutlineWbSunny } from "react-icons/md";
import { IoPartlySunnyOutline } from "react-icons/io5";

export function preventSubmit(event) {
  if (event.key === "Enter") {
    //Don't submit the form
    event.preventDefault();
    event.stopPropagation();
  }
}

export function defaultIfEmpty(defaultValue, value) {
  return value === null || value === undefined || value === ""
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
  return d3.timeFormat("%b %d, %y %I:%M %p")(date);
};

export const sortDevices = (d1, d2) =>
  (d1.name == null ? d1.deviceName : d1.name).localeCompare(
    d2.name == null ? d2.deviceName : d2.name,
    undefined,
    { sensitivity: "accent" },
  );

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
    return "";
  }
  time = time / 1000;
  let days = ~~(time / 86400);
  let hours = ~~(time / 3600);
  let minutes = ~~((time % 3600) / 60);
  //let seconds = ~~time % 60;
  let formattedTime = "";
  if (days > 0) {
    formattedTime += days + "d ";
  }
  if (hours > 0) {
    formattedTime += hours + "h ";
  }
  if (days === 0 && hours === 0 && minutes === 0) {
    minutes = 1;
  }
  return formattedTime + minutes + "m";
};

export const getWeatherIcon = (weatherSummary) => {
  if (weatherSummary === "Cloudy") {
    return <MdOutlineWbCloudy className={"align-self-center"} />;
  } else if (weatherSummary === "Partly Cloudy") {
    return <IoPartlySunnyOutline className={"align-self-center"} />;
  } else if (weatherSummary === "Fog") {
    return <MdFoggy className={"align-self-center"} />;
  } else if (weatherSummary === "Clear") {
    return <MdOutlineWbSunny className={"align-self-center"} />;
  }
  return weatherSummary;
};
