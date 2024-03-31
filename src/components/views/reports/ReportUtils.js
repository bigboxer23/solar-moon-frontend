import { getFormattedTime, roundTwoDigit } from '../../../utils/Utils';

const coef = 1000 * 60; //60s

export const transformRowData = function (row, deviceMap, intl) {
  const date = new Date(row['@timestamp']);
  row.timeSort = Math.round(date / coef) * coef; //Strip off seconds, data can vary +/- 1 second, and we don't really care for sorting purposes
  row.time = getFormattedTime(date);
  if (row['Total Energy Consumption'] != null) {
    row['Total Energy Consumption'] = intl.formatNumber(
      roundTwoDigit(row['Total Energy Consumption']),
    );
  }
  if (row['Total Real Power'] != null) {
    row['Total Real Power'] = roundTwoDigit(row['Total Real Power']);
  }
  if (row['Energy Consumed'] != null) {
    row['Energy Consumed'] = roundTwoDigit(row['Energy Consumed']);
  }
  row['siteId.keyword'] =
    deviceMap[row['siteId.keyword']] || row['siteId.keyword'];
  row['device-id.keyword'] =
    deviceMap[row['device-id.keyword']] || row['device-id.keyword'];
  return row;
};

export const sortRowData = function (row, row2) {
  const dateSort = row2.timeSort - row.timeSort;
  if (dateSort === 0) {
    const siteSort = row['siteId.keyword'].localeCompare(
      row2['siteId.keyword'].trim(),
      undefined,
      {
        sensitivity: 'accent',
      },
    );
    if (siteSort === 0) {
      return row['device-id.keyword'].localeCompare(
        row2['device-id.keyword'].trim(),
        undefined,
        {
          sensitivity: 'accent',
        },
      );
    }
    return siteSort;
  }
  return dateSort;
};
