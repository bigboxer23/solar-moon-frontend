// Mock the dependencies that cause import issues
import { vi } from 'vitest';

import {
  attributeMappings,
  attributes,
} from '../../../../components/views/mapping/MappingConstants';

vi.mock('../../../../components/views/reports/ReportUtils', () => ({
  TOTAL_ENERGY_CONS: 'Total Energy Consumption',
  TOTAL_REAL_POWER: 'Total Real Power',
}));

describe('MappingConstants', () => {
  test('exports attributes array', () => {
    expect(attributes).toBeDefined();
    expect(Array.isArray(attributes)).toBe(true);
    expect(attributes.length).toBeGreaterThan(0);
  });

  test('attributes contains expected values', () => {
    expect(attributes).toContain('Current');
    expect(attributes).toContain('Voltage');
    expect(attributes).toContain('System Power Factor');
    expect(attributes).toContain('Energy Consumption');
    expect(attributes).toContain('Real Power');
  });

  test('exports attributeMappings object', () => {
    expect(attributeMappings).toBeDefined();
    expect(typeof attributeMappings).toBe('object');
    expect(Object.keys(attributeMappings).length).toBeGreaterThan(0);
  });

  test('attributeMappings contains expected mappings', () => {
    expect(attributeMappings['Average Current']).toBe('Current');
    expect(attributeMappings['Voltage, Line to Neutral']).toBe('Voltage');
    expect(attributeMappings['Average Voltage (L-N)']).toBe('Voltage');
    expect(attributeMappings['Power Factor']).toBe('System Power Factor');
    expect(attributeMappings['Total (System) Power Factor']).toBe(
      'System Power Factor',
    );
  });

  test('attributeMappings values are all in attributes array', () => {
    Object.values(attributeMappings).forEach((value) => {
      expect(attributes).toContain(value);
    });
  });

  test('attributes array has expected length', () => {
    expect(attributes).toHaveLength(5);
  });

  test('attributeMappings contains energy consumption mappings', () => {
    expect(attributeMappings['kWh del+rec']).toBe('Energy Consumption');
  });

  test('attributeMappings contains current mappings', () => {
    expect(attributeMappings['I a']).toBe('Current');
  });

  test('attributeMappings contains voltage mappings', () => {
    expect(attributeMappings['Vll ab']).toBe('Voltage');
  });

  test('attributeMappings contains power factor mappings', () => {
    expect(attributeMappings['PF sign tot']).toBe('System Power Factor');
    expect(attributeMappings['Total System Power Factor']).toBe(
      'System Power Factor',
    );
  });
});
