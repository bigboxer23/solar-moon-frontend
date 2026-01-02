import type { Dispatch, SetStateAction } from 'react';

export type UseStickyStateReturn<T> = [T, Dispatch<SetStateAction<T>>];

export type UseSearchParamStateReturn = [
  string,
  Dispatch<SetStateAction<string>>,
];
