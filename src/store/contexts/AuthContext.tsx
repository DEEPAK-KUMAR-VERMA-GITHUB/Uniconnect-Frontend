import AsyncStorage from '@react-native-async-storage/async-storage';
import {ObjectId} from 'mongoose';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {api, getStoredTokens} from '../apis/api';
import {Platform} from 'react-native';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'faculty' | 'student';
  department: ObjectId;
  profilePic: string;

  // Faculty-specific fields
  facultyId?: string;
  designation?: 'Associate Professor' | 'Assistant Professor' | 'Professor';

  // Student-specific fields
  rollNumber?: string;

  // Associations
  associations: {
    courses: ObjectId[];
    sessions: ObjectId[];
    semesters: ObjectId[];
    subjects: ObjectId[];
  };

  // Faculty-specific arrays
  teachingAssignments?: Array<{
    course: ObjectId;
    session: ObjectId;
    semester: ObjectId;
    subject: ObjectId;
  }>;

  // Status and security fields
  isVerified: boolean;
  isBlocked: boolean;
  tokenVersion: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  loginAttempts: {
    count: number;
    lastAttempt?: Date;
    lockUntil?: Date;
  };
  deviceToken: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  deviceId: string | null;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  deviceId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// storage keys for AsyncStorage
const STORAGE_KEYS = {
  DEVICE_ID: 'deviceId',
  USER_DATA: 'userData',
  REFRESH_IN_PROGRESS: 'refreshInProgress',
  LAST_REFRESH_TIME: 'lastRefreshTime',
};

// Minimum time between refresh attempts (in milliseconds)
const MIN_REFRESH_INTERVAL = 60000; // 1 minute

export const AuthProvider: FC<{children: ReactNode}> = ({children}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    deviceId: null,
  });

  // Use a ref to track if a refresh is in progress
  const refreshInProgress = useRef(false);

  // Use a ref to track the last refresh time
  const lastRefreshTime = useRef(0);

  // Configure API to include credentials
  useEffect(() => {
    api.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Only attempt refresh if:
        // 1. It's a 401 error
        // 2. We haven't tried to refresh for this request yet
        // 3. We're not already refreshing
        // 4. Enough time has passed since the last refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !refreshInProgress.current &&
          Date.now() - lastRefreshTime.current > MIN_REFRESH_INTERVAL
        ) {
          originalRequest._retry = true;

          try {
            console.log('Attempting to refresh token...');
            // Set flag to prevent multiple simultaneous refresh attempts
            refreshInProgress.current = true;

            const refreshed = await refreshToken();

            // Update last refresh time
            lastRefreshTime.current = Date.now();

            // Reset flag
            refreshInProgress.current = false;

            if (refreshed) {
              console.log('Token refreshed successfully, retrying request');
              // if token refresh was successful, retry the original request
              return api(originalRequest);
            } else {
              console.log('Token refresh failed');
            }
          } catch (refreshError) {
            console.error('Error during token refresh:', refreshError);
            // Reset flag even on error
            refreshInProgress.current = false;

            // If token refresh fails, log out the user
            await logout();
            return Promise.reject(refreshError);
          }
        }

        // If it's not a 401 error or we can't refresh, reject with the original error
        return Promise.reject(error);
      },
    );

    // clean up interceptor on unmount
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Helper function to store user data
  const storeUserData = async (userData: User) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  };

  // Helper function to get user data
  const getUserData = async (): Promise<User | null> => {
    try {
      const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUserData) {
        return JSON.parse(storedUserData);
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const loadUserData = async () => {
    try {
      setAuthState(prev => ({...prev, isLoading: true}));

      // First try to get stored deviceId
      const storedDeviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      let deviceId = storedDeviceId;

      // If no stored deviceId, generate a new one
      if (!deviceId) {
        deviceId = await getDeviceId();
        await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
      }

      console.log('Device ID:', deviceId);

      // Try to get stored user data
      const userData = await getUserData();

      if (userData) {
        console.log('Found stored user data');
        // If we have stored user data, check if we're still authenticated
        try {
          // make a request to verify authentication status
          console.log('Verifying authentication status...');
          const response = await api.get('/users/me', {
            headers: {
              'X-Device-ID': deviceId,
            },
          });

          console.log('Authentication response:', response.data);
          const user = response.data?.data 

          if (user) {
            console.log('User is authenticated');
            // update user data with latest from server
            await storeUserData(user);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              deviceId,
            });
          } else {
            console.log('User is not authenticated');
            // If server doesn't recognize us, we're not authenticated
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              deviceId,
            });
          }
        } catch (error) {
          console.log('Error checking authentication status:', error);
          // if API call fails, we might still be authenticated but offline
          // so keep the stored data but mark as potentially stale
          setAuthState({
            user: userData,
            isAuthenticated: true, // will be verify on next api call
            isLoading: false,
            deviceId,
          });
        }
      } else {
        console.log('No stored user data');
        // If not stored data, we're definitely not authenticated
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          deviceId,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthState(prev => ({...prev, isLoading: false}));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({...prev, isLoading: true}));

      const deviceId = await getDeviceId();
      // Store deviceId for future use
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);

      console.log('Logging in with device ID:', deviceId);
      console.log('Platform:', Platform.OS);

      const response = await api.post('/users/login', {
        email,
        password,
        deviceId,
        platform: Platform.OS,
      });

      console.log('Login response:', response.data);
      let user = response.data?.data?.user || null;

      if (user) {
        console.log('Login successful');
        // Store user data
        await storeUserData(user);

        // Reset refresh tracking
        refreshInProgress.current = false;
        lastRefreshTime.current = 0;

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          deviceId,
        });
      } else {
        console.log('Login failed - no user data');
        throw {
          response: {
            data: {
              message: response.data?.message || 'No user data received',
              error: 'Login Error',
            },
          },
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({...prev, isLoading: false}));
      throw error;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Check if we're already refreshing
      if (refreshInProgress.current) {
        console.log('Refresh already in progress, skipping');
        return false;
      }

      // Check if we've refreshed recently
      if (Date.now() - lastRefreshTime.current < MIN_REFRESH_INTERVAL) {
        console.log('Refreshed too recently, skipping');
        return false;
      }

      // Set flag and update time
      refreshInProgress.current = true;

      const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) {
        console.error('No device ID available for token refresh');
        refreshInProgress.current = false;
        return false;
      }

      // Get stored refresh token
      const {refreshToken} = await getStoredTokens();

      console.log('Attempting to refresh token with device ID:', deviceId);

      // Include the refresh token in the request body
      const response = await api.post('/users/refresh-token', {
        deviceId,
        platform: Platform.OS,
        refreshToken, // Send the refresh token in the request body
      });

      console.log('Refresh token response:', response.data);

      const user = response.data?.data?.user;

      if (user) {
        console.log('Token refresh successful');
        await storeUserData(user);

        // Update last refresh time
        lastRefreshTime.current = Date.now();

        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));

        refreshInProgress.current = false;
        return true;
      }

      console.log('Token refresh failed - no user data');
      refreshInProgress.current = false;
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      refreshInProgress.current = false;
      return false;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({...prev, isLoading: true}));

      // get device id before clearing storage
      const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

      try {
        console.log('Logging out with device ID:', deviceId);
        await api.post('/users/logout', {
          deviceId,
          platform: Platform.OS,
        });
        console.log('Logout API call successful');
      } catch (logoutError) {
        // continue with local logout even if the API call fails
        console.warn('Error calling logout API:', logoutError);
      }

      // clear stored user data
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('User data cleared');

      // Reset refresh tracking
      refreshInProgress.current = false;
      lastRefreshTime.current = 0;

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        deviceId: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setAuthState(prev => ({...prev, isLoading: false}));
      throw error;
    }
  };

  // update user data locally
  const updateUser = (userData: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;

      const updatedUser = {
        ...prev.user,
        ...userData,
      };

      storeUserData(updatedUser as User).catch(error => {
        console.error('Error updating stored user data:', error);
      });

      return {
        ...prev,
        user: updatedUser,
      };
    });
  };

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        deviceId: authState.deviceId,
        login,
        logout,
        refreshToken,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return !!userData;
  } catch (error) {
    return false;
  }
};

// Helper function to get device ID
export const getDeviceId = async (): Promise<string> => {
  try {
    // Try to get stored device ID first
    const storedDeviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (storedDeviceId) {
      return storedDeviceId;
    }

    // Generate a new device ID if none exists
    const newDeviceId = `${Platform.OS}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, newDeviceId);
    return newDeviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return `${Platform.OS}-${Date.now()}`;
  }
};
