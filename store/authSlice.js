import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate(state, action) {
      state.login = action.payload.login;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    updateToken(state, action) {
      state.token = action.payload;
    },

    clearAuth(state) {
      state.login = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const authActions = {
  authenticate: authSlice.actions.authenticate,
  updateToken: authSlice.actions.updateToken,
  logout: authSlice.actions.clearAuth,
  clearAuth: authSlice.actions.clearAuth,
};

export default authSlice;