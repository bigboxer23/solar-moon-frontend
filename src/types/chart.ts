export interface ChartDataPoint {
  date: Date | string | number;
  values: number;
  [key: string]: unknown;
}

export interface StackedChartDataPoint {
  date: string;
  name: string;
  avg: number;
  [key: string]: unknown;
}

export interface WeatherData {
  summary?: string;
  icon?: string;
  precipIntensity?: number;
  temperature?: number;
  uvIndex?: number;
  humidity?: number;
  windSpeed?: number;
  cloudCover?: number;
  visibility?: number;
  pressure?: number;
}

export interface ChartConfig {
  type?: 'line' | 'bar' | 'scatter' | 'bubble' | 'pie' | 'doughnut';
  data?: unknown;
  options?: unknown;
}

export type GraphType = 'GROUPED_BAR' | 'LINE' | 'STACKED_BAR';

export type AggregationType = 'AVG_AGGREGATION' | 'TOTAL_AGGREGATION';
