import axios from "axios";
import { Auth } from "aws-amplify";

export const api = axios.create({
  baseURL: "/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  async (config) => {
    let jwt = (await Auth.currentSession()).getAccessToken().getJwtToken();
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

export const openSearch = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
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
