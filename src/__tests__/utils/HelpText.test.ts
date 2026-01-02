/* eslint-env jest */
import {
  AVERAGE_CALCULATION,
  DEVICE_HELP_TEXT1,
  DEVICE_HELP_TEXT2,
  DEVICE_HELP_TEXT3,
  DEVICE_HELP_TEXT4,
  MAPPING_HELP_TEXT,
  SITE_HELP_TEXT1,
  SITE_HELP_TEXT2,
  SITE_HELP_TEXT3,
} from '../../utils/HelpText';

describe('HelpText', () => {
  describe('SITE_HELP_TEXT constants', () => {
    it('SITE_HELP_TEXT1 contains expected content about device organization', () => {
      expect(SITE_HELP_TEXT1).toContain('Devices can be organized into a site');
      expect(SITE_HELP_TEXT1).toContain('aggregated view');
      expect(SITE_HELP_TEXT1).toContain('comparison of devices');
    });

    it('SITE_HELP_TEXT2 contains expected content about physical location', () => {
      expect(SITE_HELP_TEXT2).toContain('physical location');
      expect(SITE_HELP_TEXT2).toContain('weather information');
      expect(SITE_HELP_TEXT2).toContain('temperature, UV index');
    });

    it('SITE_HELP_TEXT3 contains expected content about default placement', () => {
      expect(SITE_HELP_TEXT3).toContain('Newly created devices');
      expect(SITE_HELP_TEXT3).toContain('No Site group');
      expect(SITE_HELP_TEXT3).toContain('by default');
    });
  });

  describe('DEVICE_HELP_TEXT constants', () => {
    it('DEVICE_HELP_TEXT1 contains expected content about starting devices', () => {
      expect(DEVICE_HELP_TEXT1).toContain('Devices can be started');
      expect(DEVICE_HELP_TEXT1).toContain('manage page');
      expect(DEVICE_HELP_TEXT1).toContain('following the instructions');
    });

    it('DEVICE_HELP_TEXT2 contains expected content about device-side setup', () => {
      expect(DEVICE_HELP_TEXT2).toContain('following the linked instructions');
      expect(DEVICE_HELP_TEXT2).toContain('starting from the device side');
      expect(DEVICE_HELP_TEXT2).toContain('show up under No Site');
    });

    it('DEVICE_HELP_TEXT3 contains expected content about display names', () => {
      expect(DEVICE_HELP_TEXT3).toContain('display name');
      expect(DEVICE_HELP_TEXT3).toContain('Solar Moon interface');
      expect(DEVICE_HELP_TEXT3).toContain('device name is the technical name');
      expect(DEVICE_HELP_TEXT3).toContain(
        'automatically be placed into the active site',
      );
    });

    it('DEVICE_HELP_TEXT4 contains expected content about device name matching', () => {
      expect(DEVICE_HELP_TEXT4).toContain('starting from the manage page');
      expect(DEVICE_HELP_TEXT4).toContain('device name must match');
      expect(DEVICE_HELP_TEXT4).toContain(
        'passed from the device with the data',
      );
    });
  });

  describe('MAPPING_HELP_TEXT constant', () => {
    it('contains expected content about mappings functionality', () => {
      expect(MAPPING_HELP_TEXT).toContain(
        'Mappings provide a way to translate',
      );
      expect(MAPPING_HELP_TEXT).toContain('data points from your devices');
      expect(MAPPING_HELP_TEXT).toContain('Solar Moon needs');
      expect(MAPPING_HELP_TEXT).toContain('graphs, analytics and alerts');
      expect(MAPPING_HELP_TEXT).toContain('mappings provided by default');
      expect(MAPPING_HELP_TEXT).toContain('map to existing config');
    });
  });

  describe('AVERAGE_CALCULATION constant', () => {
    it('contains expected content about calculation method', () => {
      expect(AVERAGE_CALCULATION).toContain('Calculated by using');
      expect(AVERAGE_CALCULATION).toContain('last 90 days');
      expect(AVERAGE_CALCULATION).toContain('collected data');
      expect(AVERAGE_CALCULATION).toContain('all sites & devices');
    });
  });

  describe('Help text properties', () => {
    it('all help texts are non-empty strings', () => {
      const helpTexts = [
        SITE_HELP_TEXT1,
        SITE_HELP_TEXT2,
        SITE_HELP_TEXT3,
        DEVICE_HELP_TEXT1,
        DEVICE_HELP_TEXT2,
        DEVICE_HELP_TEXT3,
        DEVICE_HELP_TEXT4,
        MAPPING_HELP_TEXT,
        AVERAGE_CALCULATION,
      ];

      helpTexts.forEach((text) => {
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
        expect(text.trim()).toBe(text); // No leading/trailing whitespace
      });
    });

    it('all help texts are properly capitalized', () => {
      const helpTexts = [
        SITE_HELP_TEXT1,
        SITE_HELP_TEXT2,
        SITE_HELP_TEXT3,
        DEVICE_HELP_TEXT1,
        DEVICE_HELP_TEXT2,
        DEVICE_HELP_TEXT3,
        DEVICE_HELP_TEXT4,
        MAPPING_HELP_TEXT,
        AVERAGE_CALCULATION,
      ];

      helpTexts.forEach((text) => {
        // Check that the first character is uppercase (except for special cases)
        const firstChar = text.charAt(0);
        expect(firstChar).toMatch(/[A-Z]/);
      });
    });

    it('help texts contain appropriate punctuation', () => {
      const sentenceTexts = [
        SITE_HELP_TEXT1,
        SITE_HELP_TEXT2,
        SITE_HELP_TEXT3,
        DEVICE_HELP_TEXT3,
        DEVICE_HELP_TEXT4,
        MAPPING_HELP_TEXT,
        AVERAGE_CALCULATION,
      ];

      sentenceTexts.forEach((text) => {
        // These should end with proper punctuation
        expect(text).toMatch(/[.!]$/);
      });
    });
  });

  describe('Content validation', () => {
    it('site help texts mention key concepts', () => {
      const siteTexts = [SITE_HELP_TEXT1, SITE_HELP_TEXT2, SITE_HELP_TEXT3];
      const combinedSiteText = siteTexts.join(' ');

      expect(combinedSiteText).toContain('site');
      expect(combinedSiteText).toContain('devices');
      expect(combinedSiteText).toContain('data');
    });

    it('device help texts mention key concepts', () => {
      const deviceTexts = [
        DEVICE_HELP_TEXT1,
        DEVICE_HELP_TEXT2,
        DEVICE_HELP_TEXT3,
        DEVICE_HELP_TEXT4,
      ];
      const combinedDeviceText = deviceTexts.join(' ');

      expect(combinedDeviceText).toContain('device');
      expect(combinedDeviceText).toContain('manage');
      expect(combinedDeviceText).toContain('name');
    });

    it('mapping help text mentions key mapping concepts', () => {
      expect(MAPPING_HELP_TEXT).toContain('mapping');
      expect(MAPPING_HELP_TEXT).toContain('translate');
      expect(MAPPING_HELP_TEXT).toContain('Solar Moon');
    });

    it('average calculation mentions time period and scope', () => {
      expect(AVERAGE_CALCULATION).toContain('90 days');
      expect(AVERAGE_CALCULATION).toContain('all sites');
      expect(AVERAGE_CALCULATION).toContain('devices');
    });
  });
});
