
import { useDispatch } from "react-redux";

import AuthContent from "../components/auth/AuthContent";
import { authActions } from "../store/authSlice";
import { loginRequest } from "../utils/authDataService";

function LoginScreen() {
  const dispatch = useDispatch();

  async function loginHandler({ login, password }) {
    try {
      const response = await loginRequest({
        username: login,
        password,
      });

      if (response.status !== 200 || !response.data?.accessToken) {
        return;
      }

      dispatch(
        authActions.authenticate({
          login,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
    } catch (error) {
      // Користувач залишається на екрані входу,
      // якщо авторизація не вдалася.
    }
  }

  return (
    <AuthContent
      isLogin={true}
      onAuthenticate={loginHandler}
    />
  );
}

export default LoginScreen;
