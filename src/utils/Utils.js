import { useEffect, useState } from "react";

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