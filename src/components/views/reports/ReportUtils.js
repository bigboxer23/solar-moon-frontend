import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';

import {
  getFormattedTime,
  roundToDecimals,
  TIPPY_DELAY,
} from '../../../utils/Utils';

const coef = 1000 * 60; // 60s

export const TOTAL_REAL_POWER = 'Total Real Power';
export const TOTAL_ENERGY_CONS = 'Total Energy Consumption';
export const ENERGY_CONSUMED = 'Energy Consumed';
export const SITE_ID_KEYWORD = 'siteId.keyword';
export const DEVICE_ID_KEYWORD = 'device-id.keyword';
export const INFORMATIONAL_ERROR = 'informationalErrorString.keyword';
export const DISPLAY_NAME = 'displayName';

export const transformRowData = function (row, deviceMap, intl) {
  const date = new Date(row['@timestamp']);
  row.timeSort = Math.round(date / coef) * coef; // Strip off seconds, data can vary +/- 1 second, and we don't really care for sorting purposes
  row.time = getFormattedTime(date);
  if (row[TOTAL_ENERGY_CONS] != null) {
    row[TOTAL_ENERGY_CONS] = intl.formatNumber(
      roundToDecimals(row[TOTAL_ENERGY_CONS], 100),
    );
  }
  if (row[TOTAL_REAL_POWER] != null) {
    row[TOTAL_REAL_POWER] = intl.formatNumber(
      roundToDecimals(row[TOTAL_REAL_POWER], 100),
    );
  }
  if (row[ENERGY_CONSUMED] != null) {
    row[ENERGY_CONSUMED] = intl.formatNumber(
      roundToDecimals(row[ENERGY_CONSUMED], 100),
    );
  }
  row[SITE_ID_KEYWORD] =
    deviceMap[row[SITE_ID_KEYWORD]] || row[SITE_ID_KEYWORD];
  row[DEVICE_ID_KEYWORD] =
    deviceMap[row[DEVICE_ID_KEYWORD]] || row[DEVICE_ID_KEYWORD];
  row[DISPLAY_NAME] = row[DEVICE_ID_KEYWORD];

  if (
    row[INFORMATIONAL_ERROR] !== undefined &&
    row[INFORMATIONAL_ERROR].length > 0 &&
    row[INFORMATIONAL_ERROR][0] !== ''
  ) {
    row[DISPLAY_NAME] = (
      <Tippy
        content={`${row[INFORMATIONAL_ERROR]}`}
        delay={TIPPY_DELAY}
        placement='bottom'
      >
        <div className='flex'>
          <span className='mr-2'>{row[DISPLAY_NAME]}</span>
          <MdOutlineInfo className='text-brand-primary' size={18} />
        </div>
      </Tippy>
    );
  }
  return row;
};

export const sortRowData = function (row, row2) {
  const dateSort = row2.timeSort - row.timeSort;
  if (dateSort !== 0) {
    return dateSort;
  }
  const siteSort = compare(row, row2, SITE_ID_KEYWORD);
  if (siteSort !== 0) {
    return siteSort;
  }
  return compare(row, row2, DEVICE_ID_KEYWORD);
};

const compare = function (row, row2, field) {
  return unwrapValue(row[field]).localeCompare(
    unwrapValue(row2[field]).trim(),
    undefined,
    {
      sensitivity: 'accent',
    },
  );
};

const unwrapValue = function (value) {
  if (
    value !== null &&
    value !== undefined &&
    Array.isArray(value) &&
    value.length > 0
  ) {
    return value[0];
  }
  return value;
};
