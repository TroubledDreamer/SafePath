import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';

export const getUserToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const setUserToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const clearUserToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = await getUserToken();
  return !!token;
};
