import { fetchAuthSession } from 'aws-amplify/auth';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: '/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const jwt = (await fetchAuthSession()).tokens?.accessToken;
    if (jwt !== null && jwt !== undefined) {
      config.headers.set('authorization', `Bearer ${jwt}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(undefined, (error: AxiosError) => {
  console.log(error);
  if (
    error.response &&
    error.response.status === 403 &&
    error.response.data === 'No subscription is active'
  ) {
    console.log('redirecting to pricing page');
    window.location.href = '/pricing';
  }
  return Promise.reject(error);
});

export const openSearch = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

openSearch.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.set('authorization', 'Basic ');
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
