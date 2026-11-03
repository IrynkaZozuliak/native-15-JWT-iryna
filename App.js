
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "./utils/styles";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { authActions } from "./store/authSlice";
import { logoutRequest } from "./utils/authDataService";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary500,
        },
        headerTintColor: "white",
        contentStyle: {
          backgroundColor: Colors.primary100,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}

function EnteredStack({ username, refreshToken }) {
  const dispatch = useDispatch();

  async function logoutHandler() {
    try {
      await logoutRequest(refreshToken);
    } catch (error) {
      // Локальний вихід виконується навіть тоді,
      // коли запит до сервера завершився помилкою.
    } finally {
      dispatch(authActions.logout());
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary500,
        },
        headerTintColor: "white",
        contentStyle: {
          backgroundColor: Colors.primary100,
        },
      }}
    >
      <Stack.Screen
        name={`Welcome to posts, ${username}!`}
        component={WelcomeScreen}
        options={{
          headerRight: () => (
            <Pressable onPress={logoutHandler}>
              <Text style={{ color: "white" }}>exit</Text>
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function InnerNavigation() {
  const { login, token, refreshToken } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = Boolean(token);

  return isAuthenticated ? (
    <EnteredStack
      username={login}
      refreshToken={refreshToken}
    />
  ) : (
    <AuthStack />
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />

      <NavigationContainer>
        <InnerNavigation />
      </NavigationContainer>
    </>
  );
}
