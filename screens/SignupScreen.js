
import { useDispatch } from "react-redux";

import AuthContent from "../components/auth/AuthContent";
import { authActions } from "../store/authSlice";
import {
  createUser,
  loginRequest,
} from "../utils/authDataService";

function SignupScreen() {
  const dispatch = useDispatch();

  async function signupHandler({ login, password }) {
    try {
      const userData = {
        username: login,
        password,
      };

      // Реєстрація нового користувача.
      const signupResponse = await createUser(userData);

      if (signupResponse.status !== 200) {
        return;
      }

      // Автоматичний вхід після успішної реєстрації.
      const loginResponse = await loginRequest(userData);

      if (
        loginResponse.status !== 200 ||
        !loginResponse.data?.accessToken
      ) {
        return;
      }

      dispatch(
        authActions.authenticate({
          login,
          token: loginResponse.data.accessToken,
          refreshToken: loginResponse.data.refreshToken,
        })
      );
    } catch (error) {
      // Якщо реєстрація не вдалася, користувач
      // залишається на екрані реєстрації.
    }
  }

  return (
    <AuthContent
      isLogin={false}
      onAuthenticate={signupHandler}
    />
  );
}

export default SignupScreen;
