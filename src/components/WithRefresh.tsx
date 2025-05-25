// src/hoc/withRefresh.tsx
import React, {useState, useCallback} from 'react';
import {RefreshControl as RNRefreshControl, ScrollView} from 'react-native';
import {Colors} from '../constants/Constants';
import {useRefresh} from '../utils/useRefresh';
import {RefreshType} from '../utils/RefreshService';

interface WithRefreshOptions {
  refreshType?: RefreshType;
  queryKeys?: string[];
  onRefresh?: () => Promise<void> | void;
}

/**
 * HOC to add pull-to-refresh functionality to a component
 */
export const withRefresh = (
  WrappedComponent: React.ComponentType<any>,
  options: WithRefreshOptions = {},
) => {
  const {
    refreshType = RefreshType.CURRENT_SCREEN,
    queryKeys,
    onRefresh,
  } = options;

  return (props: any) => {
    const [refreshing, setRefreshing] = useState(false);
    const {refreshQueries, refreshUserProfile, refreshAllData} = useRefresh();

    const handleRefresh = useCallback(async () => {
      setRefreshing(true);

      try {
        switch (refreshType) {
          case RefreshType.USER_PROFILE:
            await refreshUserProfile({showToast: false});
            break;
          case RefreshType.SPECIFIC_QUERY:
            if (queryKeys && queryKeys.length > 0) {
              refreshQueries(queryKeys, {showToast: false});
            }
            break;
          case RefreshType.ALL_DATA:
            refreshAllData({showToast: false});
            break;
        }

        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Error during refresh:', error);
      } finally {
        setRefreshing(false);
      }
    }, [refreshType, queryKeys, onRefresh]);

    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RNRefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }>
        <WrappedComponent {...props} onRefresh={handleRefresh} />
      </ScrollView>
    );
  };
};
