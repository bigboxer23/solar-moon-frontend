import Tippy from '@tippyjs/react';
import type { ReactElement } from 'react';
import { MdOutlineInfo } from 'react-icons/md';

import {
  getFormattedTime,
  roundToDecimals,
  TIPPY_DELAY,
  transformMultiLineForHTMLDisplay,
} from '../../../utils/Utils';

const coef = 1000 * 60; // 60s

export const TOTAL_REAL_POWER = 'Total Real Power';
export const TOTAL_ENERGY_CONS = 'Total Energy Consumption';
export const ENERGY_CONSUMED = 'Energy Consumed';
export const SITE_ID_KEYWORD = 'siteId.keyword';
export const DEVICE_ID_KEYWORD = 'device-id.keyword';
export const INFORMATIONAL_ERROR = 'informationalErrorString.keyword';
export const DISPLAY_NAME = 'displayName';

export interface RowData {
  '@timestamp'?: string | number;
  timeSort?: number;
  time?: string;
  [TOTAL_ENERGY_CONS]?: number | string | null;
  [TOTAL_REAL_POWER]?: number | string;
  [ENERGY_CONSUMED]?: number | string;
  [SITE_ID_KEYWORD]?: string | string[];
  [DEVICE_ID_KEYWORD]?: string | string[];
  [INFORMATIONAL_ERROR]?: string | string[] | ReactElement;
  [DISPLAY_NAME]?: string | string[] | ReactElement;
  [key: string]: unknown;
}

interface IntlFormatNumber {
  formatNumber: (value: number) => string;
}

export const transformRowData = function (
  row: RowData,
  deviceMap: Record<string, string>,
  intl: IntlFormatNumber,
): RowData {
  const date = new Date(row['@timestamp'] ?? Date.now());
  row.timeSort = Math.round(date.getTime() / coef) * coef; // Strip off seconds, data can vary +/- 1 second, and we don't really care for sorting purposes
  row.time = getFormattedTime(date);
  if (row[TOTAL_ENERGY_CONS] != null) {
    row[TOTAL_ENERGY_CONS] = intl.formatNumber(
      // @ts-expect-error - roundToDecimals handles string|number conversion
      roundToDecimals(row[TOTAL_ENERGY_CONS], 100),
    );
  }
  if (row[TOTAL_REAL_POWER] != null) {
    row[TOTAL_REAL_POWER] = intl.formatNumber(
      // @ts-expect-error - roundToDecimals handles string|number conversion
      roundToDecimals(row[TOTAL_REAL_POWER], 100),
    );
  }
  if (row[ENERGY_CONSUMED] != null) {
    row[ENERGY_CONSUMED] = intl.formatNumber(
      // @ts-expect-error - roundToDecimals handles string|number conversion
      roundToDecimals(row[ENERGY_CONSUMED], 100),
    );
  }
  const siteKey = String(
    Array.isArray(row[SITE_ID_KEYWORD])
      ? row[SITE_ID_KEYWORD][0]
      : (row[SITE_ID_KEYWORD] ?? ''),
  );
  const deviceKey = String(
    Array.isArray(row[DEVICE_ID_KEYWORD])
      ? row[DEVICE_ID_KEYWORD][0]
      : (row[DEVICE_ID_KEYWORD] ?? ''),
  );
  row[SITE_ID_KEYWORD] = deviceMap[siteKey] ?? siteKey;
  row[DEVICE_ID_KEYWORD] = deviceMap[deviceKey] ?? deviceKey;
  row[DISPLAY_NAME] = String(row[DEVICE_ID_KEYWORD]);

  const infoError = row[INFORMATIONAL_ERROR];
  if (
    infoError !== undefined &&
    Array.isArray(infoError) &&
    infoError.length > 0 &&
    infoError[0] !== ''
  ) {
    const errorText = transformMultiLineForHTMLDisplay(String(infoError[0]));
    row[INFORMATIONAL_ERROR] = errorText;
    row[DISPLAY_NAME] = (
      <Tippy content={errorText} delay={TIPPY_DELAY} placement='bottom'>
        <div className='flex'>
          <span className='mr-2'>{String(row[DEVICE_ID_KEYWORD])}</span>
          <MdOutlineInfo className='text-brand-primary' size={18} />
        </div>
      </Tippy>
    );
  }
  return row;
};

export const sortRowData = function (row: RowData, row2: RowData): number {
  const dateSort = (row2.timeSort ?? 0) - (row.timeSort ?? 0);
  if (dateSort !== 0) {
    return dateSort;
  }
  const siteSort = compare(row, row2, SITE_ID_KEYWORD);
  if (siteSort !== 0) {
    return siteSort;
  }
  return compare(row, row2, DEVICE_ID_KEYWORD);
};

const compare = function (row: RowData, row2: RowData, field: string): number {
  return unwrapValue(row[field]).localeCompare(
    unwrapValue(row2[field]).trim(),
    undefined,
    {
      sensitivity: 'accent',
    },
  );
};

const unwrapValue = function (value: unknown): string {
  if (
    value !== null &&
    value !== undefined &&
    Array.isArray(value) &&
    value.length > 0
  ) {
    return String(value[0]);
  }
  return String(value ?? '');
};
