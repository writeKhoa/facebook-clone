import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  withCredentials: true,
});

export const makeRequestWithAccessToken = (accessToken: string) => {
  if (accessToken) {
    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

axiosClient.interceptors.response.use(function (config) {
  return config.data;
});

export default axiosClient;
