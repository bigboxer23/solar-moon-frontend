import { useEffect, useState } from "react";
import * as d3 from "d3";

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
