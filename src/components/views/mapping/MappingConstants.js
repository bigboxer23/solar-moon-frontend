export const AVG_CURRENT = 'Current';
export const AVG_VOLT = 'Voltage';
export const TOTAL_PF = 'System Power Factor';
export const TOTAL_ENG_CONS = 'Energy Consumption';
export const TOTAL_REAL_POWER = 'Real Power';
export const attributes = [
  AVG_CURRENT,
  AVG_VOLT,
  TOTAL_PF,
  TOTAL_ENG_CONS,
  TOTAL_REAL_POWER,
];

export const attributeMappings = {};
attributeMappings['Total Real Power'] = TOTAL_REAL_POWER;
attributeMappings['Average Current'] = AVG_CURRENT;
attributeMappings['Voltage, Line to Neutral'] = AVG_VOLT;
attributeMappings['Average Voltage (L-N)'] = AVG_VOLT;
attributeMappings['Power Factor'] = TOTAL_PF;
attributeMappings['Total (System) Power Factor'] = TOTAL_PF;
attributeMappings['kWh del+rec'] = TOTAL_ENG_CONS;
attributeMappings['Total Energy Consumption'] = TOTAL_ENG_CONS;
attributeMappings['I a'] = AVG_CURRENT;
attributeMappings['Vll ab'] = AVG_VOLT;
attributeMappings['PF sign tot'] = TOTAL_PF;
attributeMappings['Total System Power Factor'] = TOTAL_PF;
