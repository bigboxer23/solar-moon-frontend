import { getFormattedTime, roundTwoDigit } from '../../../utils/Utils';

const coef = 1000 * 60; // 60s

export const TOTAL_REAL_POWER = 'Total Real Power';
export const TOTAL_ENERGY_CONS = 'Total Energy Consumption';
export const ENERGY_CONSUMED = 'Energy Consumed';
export const SITE_ID_KEYWORD = 'siteId.keyword';
export const DEVICE_ID_KEYWORD = 'device-id.keyword';

export const transformRowData = function (row, deviceMap, intl) {
  const date = new Date(row['@timestamp']);
  row.timeSort = Math.round(date / coef) * coef; // Strip off seconds, data can vary +/- 1 second, and we don't really care for sorting purposes
  row.time = getFormattedTime(date);
  if (row[TOTAL_ENERGY_CONS] != null) {
    row[TOTAL_ENERGY_CONS] = intl.formatNumber(
      roundTwoDigit(row[TOTAL_ENERGY_CONS]),
    );
  }
  if (row[TOTAL_REAL_POWER] != null) {
    row[TOTAL_REAL_POWER] = roundTwoDigit(row[TOTAL_REAL_POWER]);
  }
  if (row[ENERGY_CONSUMED] != null) {
    row[ENERGY_CONSUMED] = roundTwoDigit(row[ENERGY_CONSUMED]);
  }
  row[SITE_ID_KEYWORD] =
    deviceMap[row[SITE_ID_KEYWORD]] || row[SITE_ID_KEYWORD];
  row[DEVICE_ID_KEYWORD] =
    deviceMap[row[DEVICE_ID_KEYWORD]] || row[DEVICE_ID_KEYWORD];
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
  return row[field].localeCompare(row2[field].trim(), undefined, {
    sensitivity: 'accent',
  });
};
