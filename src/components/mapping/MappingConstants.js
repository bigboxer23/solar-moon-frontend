export const AVG_CURRENT = "Average Current";
export const AVG_VOLT = "Average Voltage (L-N)";
export const TOTAL_PF = "Total (System) Power Factor";
export const TOTAL_ENG_CONS = "Total Energy Consumption";
export const TOTAL_REAL_POWER = "Total Real Power";
export const attributes = [
  AVG_CURRENT,
  AVG_VOLT,
  TOTAL_PF,
  TOTAL_ENG_CONS,
  TOTAL_REAL_POWER,
];

export const attributeMappings = {};
attributeMappings[TOTAL_ENG_CONS] = TOTAL_ENG_CONS;
attributeMappings[TOTAL_REAL_POWER] = TOTAL_REAL_POWER;
attributeMappings[AVG_CURRENT] = AVG_CURRENT;
attributeMappings[AVG_VOLT] = AVG_VOLT;
attributeMappings[TOTAL_PF] = TOTAL_PF;
attributeMappings["Energy Consumption"] = TOTAL_ENG_CONS;
attributeMappings["Real Power"] = TOTAL_REAL_POWER;
attributeMappings["Current"] = AVG_CURRENT;
attributeMappings["Voltage, Line to Neutral"] = AVG_VOLT;
attributeMappings["Power Factor"] = TOTAL_PF;
attributeMappings["kWh del+rec"] = TOTAL_ENG_CONS;
attributeMappings["I a"] = AVG_CURRENT;
attributeMappings["Vll ab"] = AVG_VOLT;
attributeMappings["PF sign tot"] = TOTAL_PF;
attributeMappings["Total System Power Factor"] = TOTAL_PF;
