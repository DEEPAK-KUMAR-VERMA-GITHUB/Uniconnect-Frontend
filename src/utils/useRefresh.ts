import {useCallback, useEffect} from 'react';
import {
  RefreshType,
  GLOBAL_REFRESH_EVENT,
  refreshService,
} from './refreshService';
import {EventRegister} from 'react-native-event-listeners';

interface UseRefreshOptions {
  onRefresh?: () => void;
  listenToGlobal?: boolean;
  refreshTypes?: RefreshType[];
}

/**
 * Hook to handle refresh functionality in components
 */
export const useRefresh = (options: UseRefreshOptions = {}) => {
  const {
    onRefresh,
    listenToGlobal = true,
    refreshTypes = [RefreshType.CURRENT_SCREEN],
  } = options;

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  // Listen to global refresh events
  useEffect(() => {
    if (!listenToGlobal) return;

    const subscription = EventRegister.addEventListener(
      GLOBAL_REFRESH_EVENT,
      (data: {type: RefreshType; options: any}) => {
        if (
          refreshTypes.includes(data.type) ||
          data.type === RefreshType.ALL_DATA
        ) {
          handleRefresh();
        }
      },
    );

    return () => {
      EventRegister.removeEventListener(subscription as string);
    };
  }, [listenToGlobal, refreshTypes, handleRefresh]);

  return {
    refreshUserProfile: refreshService.refreshUserProfile.bind(refreshService),
    refreshQueries: refreshService.refreshQueries.bind(refreshService),
    refreshAllData: refreshService.refreshAllData.bind(refreshService),
    triggerGlobalRefresh:
      refreshService.triggerGlobalRefresh.bind(refreshService),
  };
};
