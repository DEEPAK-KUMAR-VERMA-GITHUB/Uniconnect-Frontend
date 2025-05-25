import {api} from '../store/apis/api';
import {EventRegister} from 'react-native-event-listeners';
import Toast from '../components/Toast';
import {queryClient} from '../store/apis/queryClient';

// Event name for global refresh
export const GLOBAL_REFRESH_EVENT = 'global-refresh-event';

// Types of refresh
export enum RefreshType {
  USER_PROFILE = 'user-profile',
  CURRENT_SCREEN = 'current-screen',
  ALL_DATA = 'all-data',
  SPECIFIC_QUERY = 'specific-query',
}

interface RefreshOptions {
  showToast?: boolean;
  queryKeys?: string[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Global refresh service to refresh data across the app
 */
class RefreshService {
  /**
   * Refresh user profile by calling /users/me endpoint
   */
  async refreshUserProfile(options: RefreshOptions = {}): Promise<boolean> {
    try {
      const {showToast = true, onSuccess, onError} = options;

      // Call the /users/me endpoint to refresh user data
      const response = await api.get('/users/me');

      if (response.data?.data) {
        // Invalidate user-related queries
        queryClient.invalidateQueries({queryKey: ['user']});

        if (showToast) {
          Toast.success('Profile refreshed successfully');
        }

        if (onSuccess) {
          onSuccess();
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error refreshing user profile:', error);

      if (options.showToast) {
        Toast.error('Failed to refresh profile');
      }

      if (options.onError) {
        options.onError(error);
      }

      return false;
    }
  }

  /**
   * Refresh specific queries by their keys
   */
  refreshQueries(queryKeys: string[], options: RefreshOptions = {}): void {
    try {
      const {showToast = true, onSuccess, onError} = options;

      // Invalidate the specified queries
      queryKeys.forEach(key => {
        queryClient.invalidateQueries({queryKey: [key]});
      });

      if (showToast) {
        Toast.success('Data refreshed successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error refreshing queries:', error);

      if (options.showToast) {
        Toast.error('Failed to refresh data');
      }

      if (options.onError) {
        options.onError(error);
      }
    }
  }

  /**
   * Refresh all data in the app
   */
  refreshAllData(options: RefreshOptions = {}): void {
    try {
      const {showToast = true, onSuccess, onError} = options;

      // Invalidate all queries
      queryClient.invalidateQueries();

      // Also refresh user profile
      this.refreshUserProfile({showToast: false});

      if (showToast) {
        Toast.success('All data refreshed successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error refreshing all data:', error);

      if (options.showToast) {
        Toast.error('Failed to refresh data');
      }

      if (options.onError) {
        options.onError(error);
      }
    }
  }

  /**
   * Trigger a global refresh event
   */
  triggerGlobalRefresh(type: RefreshType, options: RefreshOptions = {}): void {
    EventRegister.emit(GLOBAL_REFRESH_EVENT, {type, options});
  }
}

export const refreshService = new RefreshService();
