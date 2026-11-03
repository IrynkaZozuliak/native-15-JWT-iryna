
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../store/authSlice";
import {
  getPosts,
  getNewToken,
} from "../utils/authDataService";

function WelcomeScreen() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector(
    (state) => state.auth.refreshToken
  );

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    setRefreshing(true);

    try {
      let response;

      try {
        // Запит постів із поточним access token.
        response = await getPosts(token);
      } catch (error) {
        // Якщо access token недійсний або прострочений,
        // отримуємо новий за допомогою refresh token.
        if (error.response?.status !== 403 || !refreshToken) {
          throw error;
        }

        const tokenResponse = await getNewToken(refreshToken);
        const newToken = tokenResponse.data.accessToken;

        // Оновлюємо access token у Redux.
        dispatch(authActions.updateToken(newToken));

        // Повторюємо запит постів із новим токеном.
        response = await getPosts(newToken);
      }

      setPosts(response.data);
    } catch (error) {
      // У разі помилки залишаємо поточний список постів.
    } finally {
      setRefreshing(false);
    }
  }, [token, refreshToken, dispatch]);

  useEffect(() => {
    // Автоматично завантажуємо пости лише при відкритті екрана.
    fetchPosts();

    // Не запускаємо повторний запит після оновлення токена.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderPostItem(itemData) {
    return (
      <View style={styles.postItem}>
        <Text style={styles.postTitle}>
          {itemData.item.title}
        </Text>

        <Text style={styles.postBody}>
          {itemData.item.body}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>

      <FlatList
        testID="Posts"
        data={posts}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? index.toString()
        }
        renderItem={renderPostItem}
        onRefresh={fetchPosts}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPosts}
          />
        }
      />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  postItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#eeeeee",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
  },
});
