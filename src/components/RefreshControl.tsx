// src/components/RefreshControl.tsx
import React, {FC} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {RefreshType} from '../utils/refreshService';
import {useRefresh} from '../utils/useRefresh';

interface RefreshControlProps {
  type?: RefreshType;
  size?: number;
  color?: string;
  style?: any;
  showToast?: boolean;
  queryKeys?: string[];
  onRefresh?: () => void;
}

export const RefreshControl: FC<RefreshControlProps> = ({
  type = RefreshType.CURRENT_SCREEN,
  size = 24,
  color = Colors.primary,
  style,
  showToast = true,
  queryKeys,
  onRefresh,
}) => {
  const {
    triggerGlobalRefresh,
    refreshQueries,
    refreshUserProfile,
    refreshAllData,
  } = useRefresh();

  const handlePress = () => {
    switch (type) {
      case RefreshType.USER_PROFILE:
        refreshUserProfile({showToast});
        break;
      case RefreshType.SPECIFIC_QUERY:
        if (queryKeys && queryKeys.length > 0) {
          refreshQueries(queryKeys, {showToast});
        }
        break;
      case RefreshType.ALL_DATA:
        refreshAllData({showToast});
        break;
      case RefreshType.CURRENT_SCREEN:
      default:
        triggerGlobalRefresh(type, {showToast});
        if (onRefresh) {
          onRefresh();
        }
        break;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handlePress}>
      <MaterialIcons name="refresh" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
