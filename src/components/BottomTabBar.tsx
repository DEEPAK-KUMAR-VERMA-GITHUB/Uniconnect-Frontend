import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Constants';

type BottomTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const tabs = [
  {
    name: 'Home',
    icon: 'home',
  },
  {
    name: 'Notes',
    icon: 'note',
  },
  {
    name: 'Notifications',
    icon: 'notifications',
  },

  {
    name: 'PYQs',
    icon: 'book',
  },
  {
    name: 'Assignments',
    icon: 'assignment',
  },

  {
    name: 'Profile',
    icon: 'person',
  },
];

export const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const styles = StyleSheet.create({
    tabBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingVertical: 15,
    },
  });

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          index={index}
          navigation={navigation}
          iconColor={Colors.muted}
          activeIconColor={Colors.primary}
          tabTextColor={Colors.muted}
          activeTabTextColor={Colors.primary}
          tabIcon={tab.icon}
          tabName={tab.name}
          isActive={state.index === index}
          onPress={() => state.index !== index && navigation.navigate(tab.name)}
        />
      ))}
    </View>
  );
};

type TabProps = {
  index: number;
  navigation: any;
  tabIcon: string;
  tabName: string;
  iconColor?: string;
  tabColor?: string;
  tabTextColor?: string;
  tabTextSize?: number;
  isActive?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  activeIconColor?: string;
  activeTabColor?: string;
  activeTabTextColor?: string;
};

const Tab: FC<TabProps> = ({
  index,
  navigation,
  tabIcon,
  tabName,
  iconColor = Colors.primary,
  tabColor = 'transparent',
  tabTextColor = 'black',
  tabTextSize = 11,
  isActive = false,
  onPress,
  onLongPress,
  activeIconColor = Colors.primary,
  activeTabColor = 'transparent',
  activeTabTextColor = Colors.primary,
}) => {
  const styles = StyleSheet.create({
    tabContainer: {
      alignItems: 'center',
      backgroundColor: isActive ? activeTabColor : tabColor,
    },
    tabIcon: {
      color: isActive ? activeIconColor : iconColor,
    },
    tabText: {
      color: isActive ? activeTabTextColor : tabTextColor,
      fontSize: tabTextSize,
      fontWeight: isActive ? 'bold' : 'normal',
    },
  });

  return (
    <TouchableOpacity
      style={styles.tabContainer}
      key={index}
      onPress={onPress}
      onLongPress={onLongPress}>
      <MaterialIcons name={tabIcon} size={24} style={styles.tabIcon} />
      <Text style={styles.tabText}>{tabName}</Text>
    </TouchableOpacity>
  );
};
