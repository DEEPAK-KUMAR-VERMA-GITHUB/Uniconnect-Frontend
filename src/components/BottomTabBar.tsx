import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';

type BottomTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const tabs: Array<{name: string; icon: string; index: number}> = [
  {
    name: 'Home',
    icon: 'home',
    index: 0,
  },
  {
    name: 'Notes',
    icon: 'note',
    index: 1,
  },
  {
    name: 'Notifications',
    icon: 'notifications',
    index: 2,
  },

  {
    name: 'PYQs',
    icon: 'book',
    index: 3,
  },
  {
    name: 'Assignments',
    icon: 'assignment',
    index: 4,
  },
  {
    name: 'Profile',
    icon: 'person',
    index: 6,
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
      {tabs.map(tab => (
        <Tab
          key={tab.index}
          index={tab.index}
          navigation={navigation}
          iconColor={Colors.muted}
          activeIconColor={Colors.primary}
          tabTextColor={Colors.muted}
          activeTabTextColor={Colors.primary}
          tabIcon={tab.icon}
          tabName={tab.name}
          isActive={state.index === tab.index}
          onPress={() =>
            state.index !== tab.index && navigation.navigate(tab.name)
          }
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
