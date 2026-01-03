/* eslint-env jest */

import type { AxiosError, AxiosInstance } from 'axios';

describe('apiClient', () => {
  let mockAxiosInstance: AxiosInstance;
  let mockCreate: jest.Mock;
  let mockFetchAuthSession: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as unknown as AxiosInstance;

    mockCreate = jest.fn(() => mockAxiosInstance);

    jest.doMock('axios', () => ({
      create: mockCreate,
    }));

    mockFetchAuthSession = jest.fn();
    jest.doMock('aws-amplify/auth', () => ({
      fetchAuthSession: mockFetchAuthSession,
    }));
  });

  afterEach(() => {
    jest.dontMock('axios');
    jest.dontMock('aws-amplify/auth');
  });

  describe('api instance', () => {
    it('should create axios instance with correct baseURL and headers', () => {
      require('../../services/apiClient');

      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: '/v1/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request interceptor for authentication', () => {
      require('../../services/apiClient');

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should setup response interceptor for error handling', () => {
      require('../../services/apiClient');

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('request interceptor', () => {
    let requestInterceptor: (config: unknown) => Promise<unknown>;

    beforeEach(() => {
      require('../../services/apiClient');
      const [firstCall] = (
        mockAxiosInstance.interceptors.request.use as jest.Mock
      ).mock.calls;
      [requestInterceptor] = firstCall;
    });

    it('should add authorization header when JWT token exists', async () => {
      const mockToken = 'mock-jwt-token';
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: mockToken },
      });

      const mockSet = jest.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };
      const result = await requestInterceptor(config);

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(
        'authorization',
        `Bearer ${mockToken}`,
      );
      expect(result).toBe(config);
    });

    it('should not add authorization header when JWT token is null', async () => {
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: null },
      });

      const mockSet = jest.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };
      const result = await requestInterceptor(config);

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(mockSet).not.toHaveBeenCalled();
      expect(result).toBe(config);
    });

    it('should not add authorization header when JWT token is undefined', async () => {
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: undefined },
      });

      const mockSet = jest.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };
      const result = await requestInterceptor(config);

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(mockSet).not.toHaveBeenCalled();
      expect(result).toBe(config);
    });

    it('should handle request interceptor errors', async () => {
      const requestError = new Error('Request failed');
      const [firstCall] = (
        mockAxiosInstance.interceptors.request.use as jest.Mock
      ).mock.calls;
      const [, errorHandler] = firstCall;

      await expect(errorHandler(requestError)).rejects.toBe(requestError);
    });
  });

  describe('response interceptor', () => {
    let responseInterceptorError: (error: AxiosError) => Promise<never>;
    let mockConsoleLog: jest.SpyInstance;
    let originalLocation: Location;

    beforeEach(() => {
      require('../../services/apiClient');
      const [firstCall] = (
        mockAxiosInstance.interceptors.response.use as jest.Mock
      ).mock.calls;
      [, responseInterceptorError] = firstCall;
      mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

      originalLocation = window.location;
      // @ts-expect-error - Mocking window.location
      delete window.location;
      // @ts-expect-error - Mocking window.location
      window.location = { href: '' } as Location;
    });

    afterEach(() => {
      mockConsoleLog.mockRestore();
      // @ts-expect-error - Restoring window.location
      window.location = originalLocation;
    });

    it('should log error and redirect to pricing page for 403 subscription error', () => {
      const error = {
        response: {
          status: 403,
          data: 'No subscription is active',
        },
      } as unknown as AxiosError;

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'redirecting to pricing page',
      );
      expect(window.location.href).toBe('/pricing');
    });

    it('should log error but not redirect for 403 with different message', () => {
      const error = {
        response: {
          status: 403,
          data: 'Access denied',
        },
      } as unknown as AxiosError;

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        'redirecting to pricing page',
      );
      expect(window.location.href).toBe('');
    });

    it('should log error but not redirect for non-403 status', () => {
      const error = {
        response: {
          status: 500,
          data: 'Internal server error',
        },
      } as unknown as AxiosError;

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        'redirecting to pricing page',
      );
      expect(window.location.href).toBe('');
    });

    it('should handle errors without response object gracefully', () => {
      const error = { message: 'Network error' } as AxiosError;

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(window.location.href).toBe('');
    });
  });

  describe('openSearch instance', () => {
    let openSearchAxiosInstance: AxiosInstance;

    beforeEach(() => {
      openSearchAxiosInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockCreate
        .mockReturnValueOnce(mockAxiosInstance)
        .mockReturnValueOnce(openSearchAxiosInstance);
    });

    it('should create openSearch axios instance with correct baseURL and headers', () => {
      require('../../services/apiClient');

      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: '',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request interceptor for openSearch', () => {
      require('../../services/apiClient');

      expect(
        openSearchAxiosInstance.interceptors.request.use,
      ).toHaveBeenCalled();
    });

    it('should add Basic authorization header in openSearch request interceptor', async () => {
      require('../../services/apiClient');

      const [firstCall] = (
        openSearchAxiosInstance.interceptors.request.use as jest.Mock
      ).mock.calls;
      const [openSearchRequestInterceptor] = firstCall;
      const mockSet = jest.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };
      const result = await openSearchRequestInterceptor(config);

      expect(mockSet).toHaveBeenCalledWith('authorization', 'Basic ');
      expect(result).toBe(config);
    });
  });
});
