/* eslint-env jest */

// Mock the API client
// Import after mocking
import { api } from '../../services/apiClient';
import {
  DAY,
  getAvgTotalBody,
  getBucketSize,
  getDataPageBody,
  GROUPED_BAR,
} from '../../services/search';
import {
  activateTrial,
  addDevice,
  addMapping,
  checkout,
  checkoutStatus,
  deleteCustomer,
  deleteDevice,
  deleteMapping,
  getAlarmData,
  getCustomer,
  getDataPage,
  getDevice,
  getDevices,
  getDownloadPageSize,
  getMappings,
  getOverviewData,
  getSiteOverview,
  getStripeSubscriptions,
  getSubscriptionInformation,
  getUserPortalSession,
  updateCustomer,
  updateDevice,
} from '../../services/services';

jest.mock('../../services/apiClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the search module
jest.mock('../../services/search', () => ({
  DAY: 86400000,
  getAvgTotalBody: jest.fn(),
  getBucketSize: jest.fn(),
  getDataPageBody: jest.fn(),
  GROUPED_BAR: 'groupedBarGraph',
}));

describe('services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('customer services', () => {
    test('getCustomer calls api.get with correct endpoint', () => {
      getCustomer();
      expect(api.get).toHaveBeenCalledWith('customer');
    });

    test('updateCustomer calls api.post with correct endpoint and data', () => {
      const customerData = { name: 'Test Customer', email: 'test@example.com' };
      updateCustomer(customerData);
      expect(api.post).toHaveBeenCalledWith('customer', customerData);
    });

    test('deleteCustomer calls api.delete with correct endpoint', () => {
      deleteCustomer();
      expect(api.delete).toHaveBeenCalledWith('customer/');
    });
  });

  describe('billing services', () => {
    test('getUserPortalSession calls api.post with correct endpoint', () => {
      getUserPortalSession();
      expect(api.post).toHaveBeenCalledWith('billing/portal');
    });

    test('checkout calls api.post with correct endpoint and data', () => {
      const item = 'premium-plan';
      const count = 2;
      checkout(item, count);
      expect(api.post).toHaveBeenCalledWith('billing/checkout', {
        id: item,
        count: count,
      });
    });

    test('checkoutStatus calls api.get with correct endpoint and query params', () => {
      const sessionId = 'cs_test_session_123';
      checkoutStatus(sessionId);
      expect(api.get).toHaveBeenCalledWith(
        'billing/status?session_id=cs_test_session_123',
      );
    });

    test('getStripeSubscriptions calls api.get with correct endpoint', () => {
      getStripeSubscriptions();
      expect(api.get).toHaveBeenCalledWith('billing/subscriptions');
    });
  });

  describe('subscription services', () => {
    test('getSubscriptionInformation calls api.get with correct endpoint', () => {
      getSubscriptionInformation();
      expect(api.get).toHaveBeenCalledWith('subscription');
    });

    test('activateTrial calls api.post with correct endpoint', () => {
      activateTrial();
      expect(api.post).toHaveBeenCalledWith('subscription');
    });
  });

  describe('device services', () => {
    test('getDevices calls api.get with correct endpoint', () => {
      getDevices();
      expect(api.get).toHaveBeenCalledWith('devices');
    });

    test('getDevice calls api.get with device ID', () => {
      const deviceId = 'device-123';
      getDevice(deviceId);
      expect(api.get).toHaveBeenCalledWith('devices/device-123');
    });

    test('deleteDevice calls api.delete with device ID', () => {
      const deviceId = 'device-123';
      deleteDevice(deviceId);
      expect(api.delete).toHaveBeenCalledWith('devices/device-123');
    });

    test('updateDevice calls api.post with device data', () => {
      const device = {
        id: 'device-123',
        name: 'Updated Device',
        deviceName: 'Updated Device',
      };
      updateDevice(device);
      expect(api.post).toHaveBeenCalledWith('devices', device);
    });

    test('addDevice calls api.put with device data', () => {
      const device = { name: 'New Device', deviceName: 'New Device' };
      addDevice(device);
      expect(api.put).toHaveBeenCalledWith('devices', device);
    });
  });

  describe('site and overview services', () => {
    let dateNowSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock Date.now() to return a fixed timestamp
      dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1672531200000); // 2023-01-01T00:00:00Z
      (getAvgTotalBody as jest.Mock).mockReturnValue({
        type: 'avgTotal',
        startDate: 1672444800000,
        endDate: 1672531200000,
      });
      (getBucketSize as jest.Mock).mockReturnValue('1h');
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    test('getSiteOverview calls api with correct parameters (normal graph)', () => {
      const siteId = 'site-123';
      const start = new Date('2022-12-31T00:00:00Z');
      const offset = DAY;
      const graphType = 'normal';

      getSiteOverview(siteId, start, offset, graphType);

      expect(getAvgTotalBody).toHaveBeenCalledWith(
        null,
        start,
        new Date(start.getTime() + offset),
      );
      expect(api.post).toHaveBeenCalledWith('sites/site-123', {
        type: 'avgTotal',
        startDate: 1672444800000,
        endDate: 1672531200000,
        daylight: true, // offset === DAY
      });
    });

    test('getSiteOverview handles grouped bar graph type', () => {
      const siteId = 'site-123';
      const start = new Date('2022-12-31T00:00:00Z');
      const offset = DAY * 7; // week
      const graphType = GROUPED_BAR;

      getSiteOverview(siteId, start, offset, graphType);

      expect(getBucketSize).toHaveBeenCalledWith(offset, GROUPED_BAR);
      expect(api.post).toHaveBeenCalledWith('sites/site-123', {
        type: 'avgTotal',
        startDate: 1672444800000,
        endDate: 1672531200000,
        daylight: false, // offset !== DAY
        bucketSize: '1h',
      });
    });

    test('getSiteOverview uses normal end date when within current time', () => {
      const siteId = 'site-123';
      const start = new Date('2022-12-30T00:00:00Z');
      const offset = DAY; // 1 day, so end date would be 2022-12-31 which is before current time
      const graphType = 'normal';

      getSiteOverview(siteId, start, offset, graphType);

      // Should be called with normal end date since start + offset < now
      expect(getAvgTotalBody).toHaveBeenCalledWith(
        null,
        start,
        new Date(start.getTime() + offset), // Normal calculation
      );
    });

    test('getOverviewData calls api with correct parameters', () => {
      const start = new Date('2022-12-31T00:00:00Z');
      const offset = DAY;

      getOverviewData(start, offset);

      expect(getAvgTotalBody).toHaveBeenCalledWith(
        null,
        start,
        new Date(start.getTime() + offset),
      );
      expect(api.post).toHaveBeenCalledWith('overview', {
        type: 'avgTotal',
        startDate: 1672444800000,
        endDate: 1672531200000,
        daylight: true, // offset === DAY
      });
    });
  });

  describe('data page services', () => {
    beforeEach(() => {
      (getDataPageBody as jest.Mock).mockReturnValue({
        deviceId: 'device-123',
        siteId: 'site-456',
        type: 'data',
        filterErrors: true,
        offset: 0,
        size: 50,
      });
    });

    test('getDataPage calls api with correct parameters', () => {
      const deviceId = 'device-123';
      const siteId = 'site-456';
      const filterErrors = 'true';
      const start = '1672444800000';
      const end = '1672531200000';
      const offset = 0;
      const size = 50;
      const additionalFields = ['field1', 'field2'];

      getDataPage(
        deviceId,
        siteId,
        filterErrors,
        start,
        end,
        offset,
        size,
        additionalFields,
      );

      expect(getDataPageBody).toHaveBeenCalledWith(
        deviceId,
        siteId,
        true, // 'true' string converted to boolean
        new Date(Number(start)),
        new Date(Number(end)),
        offset,
        size,
        additionalFields,
      );
      expect(api.post).toHaveBeenCalledWith('search', {
        deviceId: 'device-123',
        siteId: 'site-456',
        type: 'data',
        filterErrors: true,
        offset: 0,
        size: 50,
      });
    });

    test('getDataPage converts filterErrors string to boolean (false)', () => {
      const deviceId = 'device-123';
      const siteId = 'site-456';
      const filterErrors = 'false';
      const start = '1672444800000';
      const end = '1672531200000';
      const offset = 0;
      const size = 50;

      getDataPage(deviceId, siteId, filterErrors, start, end, offset, size);

      expect(getDataPageBody).toHaveBeenCalledWith(
        deviceId,
        siteId,
        false, // 'false' string results in false boolean
        new Date(Number(start)),
        new Date(Number(end)),
        offset,
        size,
        undefined,
      );
    });

    test('getDownloadPageSize calls api with correct parameters', () => {
      const deviceId = 'device-123';
      const siteId = 'site-456';
      const filterErrors = 'true';
      const start = '1672444800000';
      const end = '1672531200000';
      const offset = 0;
      const size = 100;

      getDownloadPageSize(
        deviceId,
        siteId,
        filterErrors,
        start,
        end,
        offset,
        size,
      );

      expect(getDataPageBody).toHaveBeenCalledWith(
        deviceId,
        siteId,
        true, // 'true' string converted to boolean
        new Date(Number(start)),
        new Date(Number(end)),
        offset,
        size,
        null, // additionalFields is always null for download
      );
      expect(api.post).toHaveBeenCalledWith('download', {
        deviceId: 'device-123',
        siteId: 'site-456',
        type: 'data',
        filterErrors: true,
        offset: 0,
        size: 50,
      });
    });
  });

  describe('alarm services', () => {
    test('getAlarmData calls api.post with empty body', () => {
      getAlarmData();
      expect(api.post).toHaveBeenCalledWith('alarms', {});
    });
  });

  describe('mapping services', () => {
    test('addMapping calls api.put with correct parameters', () => {
      const attribute = 'device-name';
      const mappingName = 'Solar Panel 1';
      addMapping(attribute, mappingName);
      expect(api.put).toHaveBeenCalledWith('mappings', {
        attribute: attribute,
        mappingName: mappingName,
      });
    });

    test('getMappings calls api.get with correct endpoint', () => {
      getMappings();
      expect(api.get).toHaveBeenCalledWith('mappings');
    });

    test('deleteMapping calls api.delete with mapping name', () => {
      const mappingName = 'Solar Panel 1';
      deleteMapping(mappingName);
      expect(api.delete).toHaveBeenCalledWith('mappings/Solar Panel 1');
    });
  });
});
