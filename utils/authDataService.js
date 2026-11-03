
import axios from "axios";

export const BASE_URL = "http://172.28.128.1:4000/";

export const createUser = (userData) => {
  return axios.post(`${BASE_URL}auth/signup`, userData);
};

export const loginRequest = (userData) => {
  return axios.post(`${BASE_URL}auth/login`, userData);
};

export const getNewToken = (refreshToken) => {
  return axios.post(`${BASE_URL}auth/token`, {
    token: refreshToken,
  });
};

export const logoutRequest = (refreshToken) => {
  return axios.delete(`${BASE_URL}auth/logout`, {
    token: refreshToken,
  });
};

export const getPosts = (accessToken) => {
  return axios.get(`${BASE_URL}posts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
