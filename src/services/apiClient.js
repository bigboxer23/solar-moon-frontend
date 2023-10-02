import axios from "axios";
import { Auth } from "aws-amplify";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  async (config) => {
    let jwt = (await Auth.currentSession()).getAccessToken().getJwtToken();
    console.log(jwt);
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
