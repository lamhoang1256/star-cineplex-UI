import axios from "axios";
import queryString from "query-string";

const axiosClient2 = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient2.interceptors.request.use((config) => {
  config.headers.common.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY1NTM2ODY2MiwiZXhwIjoxNjU1NDU1MDYyfQ.AkvcuakNhXwhEyYNG-gpYtZmcfjKpCyjBhIeC_crjos`;
  return config;
});

export default axiosClient2;
