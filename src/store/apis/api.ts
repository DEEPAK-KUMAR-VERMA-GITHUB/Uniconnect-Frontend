// src/store/apis/api.ts
import axios from 'axios';
import {BASE_URL} from '../../constants/Constants';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for tokens
const STORAGE_KEYS = Object.freeze({
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
});

// create axios instance with base url
export const api = axios.create({
  baseURL: BASE_URL || 'http://10.0.2.2:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor to include token in header
api.interceptors.request.use(
  async config => {
    try {
      // Try to get cookies first
      const cookies = await getStoredTokens();

      if (cookies && Object.keys(cookies).length > 0) {
        const cookieHeader = Object.entries(cookies)
          .map(([key, cookie]) => `${key}=${cookie.value}`)
          .join('; ');

        config.headers.Cookie = cookieHeader;
      }

      // Always include token in Authorization header (belt and suspenders approach)
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error setting request headers:', error);

      // Fallback to stored token
      try {
        const accessToken = await AsyncStorage.getItem(
          STORAGE_KEYS.ACCESS_TOKEN,
        );
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (tokenError) {
        console.error('Error getting stored token:', tokenError);
      }
    }

    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor to store tokens from response body
api.interceptors.response.use(
  async response => {
    try {
      // Handle cookies from response
      const setCookieHeader =
        response.headers['set-cookie'] || response.headers['Set-Cookie'];

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        for (const cookieStr of cookieArray) {
          const [pair] = cookieStr.split(';');
          const [name, value] = pair.split('=');

          await CookieManager.set(BASE_URL, {
            name: name.trim(),
            value: value.trim(),
            domain: '',
            path: '/',
          });
        }
      }

      // Store tokens from response body
      const data = response.data?.data;
      console.log(data);

      if (data) {
        if (data.accessToken) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.ACCESS_TOKEN,
            data.accessToken,
          );
          console.log('Access token stored from response');
        }

        if (data.refreshToken) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            data.refreshToken,
          );
          console.log('Refresh token stored from response');
        }
      }
    } catch (error) {
      console.error('Error processing response:', error);
    }

    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(
      `❌ Response Error: ${error.response?.status || 'Unknown'} ${
        error.config?.url || 'Unknown URL'
      }`,
    );
    return Promise.reject(error);
  },
);

// Helper function to get stored tokens
export const getStoredTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return {accessToken, refreshToken};
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return {accessToken: null, refreshToken: null};
  }
};

// Helper function to clear stored tokens
export const clearStoredTokens = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    return true;
  } catch (error) {
    console.error('Error clearing stored tokens:', error);
    return false;
  }
};
