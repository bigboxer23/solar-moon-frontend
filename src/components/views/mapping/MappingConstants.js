import { TOTAL_ENERGY_CONS, TOTAL_REAL_POWER } from '../reports/ReportUtils';

const AVG_CURRENT = 'Current';
const AVG_VOLT = 'Voltage';
const TOTAL_PF = 'System Power Factor';
const ENERGY_CONS = 'Energy Consumption';
const REAL_POWER = 'Real Power';
export const attributes = [
  AVG_CURRENT,
  AVG_VOLT,
  TOTAL_PF,
  ENERGY_CONS,
  REAL_POWER,
];

export const attributeMappings = {};
attributeMappings[TOTAL_REAL_POWER] = REAL_POWER;
attributeMappings['Average Current'] = AVG_CURRENT;
attributeMappings['Voltage, Line to Neutral'] = AVG_VOLT;
attributeMappings['Average Voltage (L-N)'] = AVG_VOLT;
attributeMappings['Power Factor'] = TOTAL_PF;
attributeMappings['Total (System) Power Factor'] = TOTAL_PF;
attributeMappings['kWh del+rec'] = ENERGY_CONS;
attributeMappings[TOTAL_ENERGY_CONS] = ENERGY_CONS;
attributeMappings['I a'] = AVG_CURRENT;
attributeMappings['Vll ab'] = AVG_VOLT;
attributeMappings['PF sign tot'] = TOTAL_PF;
attributeMappings['Total System Power Factor'] = TOTAL_PF;
