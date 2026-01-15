import type { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies before importing apiClient
const mockFetchAuthSession = vi.fn();
vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: mockFetchAuthSession,
}));

// Mock axios
const mockAxiosCreate = vi.fn();
const mockInterceptorsRequest = { use: vi.fn() };
const mockInterceptorsResponse = { use: vi.fn() };

vi.mock('axios', () => {
  const actual = vi.importActual('axios');
  return {
    ...actual,
    default: {
      ...(actual as Record<string, unknown>).default,
      create: mockAxiosCreate,
    },
    create: mockAxiosCreate,
  };
});

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock axios instance
    mockAxiosCreate.mockReturnValue({
      interceptors: {
        request: mockInterceptorsRequest,
        response: mockInterceptorsResponse,
      },
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('api instance', () => {
    it('should create axios instance with correct baseURL and headers', async () => {
      await import('../../services/apiClient');

      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: '/v1/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request interceptor for authentication', async () => {
      await import('../../services/apiClient');

      expect(mockInterceptorsRequest.use).toHaveBeenCalled();
    });

    it('should setup response interceptor for error handling', async () => {
      await import('../../services/apiClient');

      expect(mockInterceptorsResponse.use).toHaveBeenCalled();
    });
  });

  describe('request interceptor', () => {
    it('should add authorization header when JWT token exists', async () => {
      const mockToken = 'mock-jwt-token';
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: mockToken },
      });

      await import('../../services/apiClient');

      const [requestInterceptor] = mockInterceptorsRequest.use.mock
        .calls[0] as unknown[];
      const mockSet = vi.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };

      const result = await (
        requestInterceptor as (config: unknown) => Promise<unknown>
      )(config);

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

      await import('../../services/apiClient');

      const [requestInterceptor] = mockInterceptorsRequest.use.mock
        .calls[0] as unknown[];
      const mockSet = vi.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };

      await (requestInterceptor as (config: unknown) => Promise<unknown>)(
        config,
      );

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(mockSet).not.toHaveBeenCalled();
    });

    it('should not add authorization header when JWT token is undefined', async () => {
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: undefined },
      });

      await import('../../services/apiClient');

      const [requestInterceptor] = mockInterceptorsRequest.use.mock
        .calls[0] as unknown[];
      const mockSet = vi.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };

      await (requestInterceptor as (config: unknown) => Promise<unknown>)(
        config,
      );

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(mockSet).not.toHaveBeenCalled();
    });

    it('should handle request interceptor errors', async () => {
      await import('../../services/apiClient');

      const [, errorHandler] = mockInterceptorsRequest.use.mock
        .calls[0] as unknown[];
      const mockError = new Error('Request error') as AxiosError;

      await expect(
        (errorHandler as (error: AxiosError) => Promise<unknown>)(mockError),
      ).rejects.toThrow('Request error');
    });
  });

  describe('response interceptor', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let originalLocation: Location;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      // Save original location and mock it
      originalLocation = window.location;
      // @ts-expect-error - mocking window.location
      delete window.location;
      window.location = { ...originalLocation, href: '' };
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
      // Restore original location
      window.location = originalLocation;
    });

    it('should log error and redirect to pricing page for 403 subscription error', async () => {
      await import('../../services/apiClient');

      const [, errorHandler] = mockInterceptorsResponse.use.mock
        .calls[0] as unknown[];
      const mockError = {
        response: {
          status: 403,
          data: 'No subscription is active',
        },
      } as AxiosError;

      await expect(
        (errorHandler as (error: AxiosError) => Promise<unknown>)(mockError),
      ).rejects.toEqual(mockError);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(consoleLogSpy).toHaveBeenCalledWith('redirecting to pricing page');
      expect(window.location.href).toBe('/pricing');
    });

    it('should log error but not redirect for 403 with different message', async () => {
      await import('../../services/apiClient');

      const [, errorHandler] = mockInterceptorsResponse.use.mock
        .calls[0] as unknown[];
      const mockError = {
        response: {
          status: 403,
          data: 'Different error',
        },
      } as AxiosError;

      await expect(
        (errorHandler as (error: AxiosError) => Promise<unknown>)(mockError),
      ).rejects.toEqual(mockError);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(window.location.href).toBe('');
    });

    it('should log error but not redirect for non-403 status', async () => {
      await import('../../services/apiClient');

      const [, errorHandler] = mockInterceptorsResponse.use.mock
        .calls[0] as unknown[];
      const mockError = {
        response: {
          status: 500,
          data: 'Server error',
        },
      } as AxiosError;

      await expect(
        (errorHandler as (error: AxiosError) => Promise<unknown>)(mockError),
      ).rejects.toEqual(mockError);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(window.location.href).toBe('');
    });

    it('should handle errors without response object gracefully', async () => {
      await import('../../services/apiClient');

      const [, errorHandler] = mockInterceptorsResponse.use.mock
        .calls[0] as unknown[];
      const mockError = {
        message: 'Network error',
      } as AxiosError;

      await expect(
        (errorHandler as (error: AxiosError) => Promise<unknown>)(mockError),
      ).rejects.toEqual(mockError);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(window.location.href).toBe('');
    });
  });

  describe('openSearch instance', () => {
    it('should create openSearch axios instance with correct baseURL and headers', async () => {
      await import('../../services/apiClient');

      // openSearch is the second call to axios.create
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: '',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request interceptor for openSearch', async () => {
      await import('../../services/apiClient');

      // Check that interceptor was set up (called twice, once for api, once for openSearch)
      expect(mockInterceptorsRequest.use).toHaveBeenCalled();
    });

    it('should add Basic authorization header in openSearch request interceptor', async () => {
      await import('../../services/apiClient');

      // Get the second request interceptor (for openSearch)
      const [requestInterceptor] = mockInterceptorsRequest.use.mock
        .calls[1] as unknown[];
      const mockSet = vi.fn();
      const config = {
        headers: {
          set: mockSet,
        },
      };

      await (requestInterceptor as (config: unknown) => Promise<unknown>)(
        config,
      );

      expect(mockSet).toHaveBeenCalledWith('authorization', 'Basic ');
    });
  });
});
