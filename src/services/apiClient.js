import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

export const api = axios.create({
  baseURL: '/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  async (config) => {
    const jwt = (await fetchAuthSession()).tokens.accessToken;
    if (jwt !== null) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${jwt}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(undefined, (error) => {
  console.log(error);
  if (
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
  async (config) => {
    config.headers = {
      ...config.headers,
      authorization: `Basic `,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
