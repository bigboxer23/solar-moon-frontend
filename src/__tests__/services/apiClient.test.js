/* eslint-env jest */

describe('apiClient', () => {
  let mockAxiosInstance;
  let mockCreate;
  let mockFetchAuthSession;

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
    };

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
    let requestInterceptor;

    beforeEach(() => {
      require('../../services/apiClient');
      const [firstCall] = mockAxiosInstance.interceptors.request.use.mock.calls;
      [requestInterceptor] = firstCall;
    });

    it('should add authorization header when JWT token exists', async () => {
      const mockToken = 'mock-jwt-token';
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: mockToken },
      });

      const config = { headers: {} };
      const result = await requestInterceptor(config);

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(result.headers.authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should not add authorization header when JWT token is null', async () => {
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: null },
      });

      const config = { headers: {} };
      const result = await requestInterceptor(config);

      expect(mockFetchAuthSession).toHaveBeenCalled();
      expect(result.headers.authorization).toBeUndefined();
    });

    it('should preserve existing headers', async () => {
      const mockToken = 'mock-jwt-token';
      mockFetchAuthSession.mockResolvedValue({
        tokens: { accessToken: mockToken },
      });

      const config = {
        headers: {
          'Custom-Header': 'custom-value',
          'Content-Type': 'application/json',
        },
      };
      const result = await requestInterceptor(config);

      expect(result.headers['Custom-Header']).toBe('custom-value');
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should handle request interceptor errors', async () => {
      const requestError = new Error('Request failed');
      const [firstCall] = mockAxiosInstance.interceptors.request.use.mock.calls;
      const [, errorHandler] = firstCall;

      await expect(errorHandler(requestError)).rejects.toBe(requestError);
    });
  });

  describe('response interceptor', () => {
    let responseInterceptorError;
    let mockConsoleLog;
    let originalLocation;

    beforeEach(() => {
      require('../../services/apiClient');
      const [firstCall] =
        mockAxiosInstance.interceptors.response.use.mock.calls;
      [, responseInterceptorError] = firstCall;
      mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

      originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };
    });

    afterEach(() => {
      mockConsoleLog.mockRestore();
      window.location = originalLocation;
    });

    it('should log error and redirect to pricing page for 403 subscription error', () => {
      const error = {
        response: {
          status: 403,
          data: 'No subscription is active',
        },
      };

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
      };

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
      };

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        'redirecting to pricing page',
      );
      expect(window.location.href).toBe('');
    });

    it('should handle errors without response object gracefully', () => {
      const error = { message: 'Network error' };

      expect(() => responseInterceptorError(error)).rejects.toBe(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(error);
      expect(window.location.href).toBe('');
    });
  });

  describe('openSearch instance', () => {
    let openSearchAxiosInstance;

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
      };

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

      const [firstCall] =
        openSearchAxiosInstance.interceptors.request.use.mock.calls;
      const [openSearchRequestInterceptor] = firstCall;
      const config = { headers: {} };
      const result = await openSearchRequestInterceptor(config);

      expect(result.headers.authorization).toBe('Basic ');
    });

    it('should preserve existing headers in openSearch request interceptor', async () => {
      require('../../services/apiClient');

      const [firstCall] =
        openSearchAxiosInstance.interceptors.request.use.mock.calls;
      const [openSearchRequestInterceptor] = firstCall;
      const config = {
        headers: {
          'Custom-Header': 'custom-value',
          'Content-Type': 'application/xml',
        },
      };
      const result = await openSearchRequestInterceptor(config);

      expect(result.headers['Custom-Header']).toBe('custom-value');
      expect(result.headers['Content-Type']).toBe('application/xml');
      expect(result.headers.authorization).toBe('Basic ');
    });
  });
});
