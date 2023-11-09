import { useEffect, useState } from "react";
import * as d3 from "d3";

export function preventSubmit(event) {
  if (event.key === "Enter") {
    //Don't submit the form
    event.preventDefault();
    event.stopPropagation();
  }
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
