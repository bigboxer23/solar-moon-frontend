import { getFormattedTime, roundTwoDigit } from '../../../utils/Utils';

export const transformRowData = function (row, deviceMap, intl) {
  row.time = getFormattedTime(new Date(row['@timestamp']));
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
  row['siteId.keyword'] = deviceMap[row['siteId.keyword']];
  return row;
};
