import {FC, useState} from 'react';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export const NotificationsScreen: FC = () => {
  const navigation = useNavigation();
  const [isRead, setIsRead] = useState<boolean>(false);

  return (
    <CustomSafeAreaView
      tabBarHeight={useBottomTabBarHeight()}
      containerStyle={{flex: 1}}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        padding: 0,
        flex: 0,
      }}>
      <TabHeader
        title="Notifications"
        leftIconClick={() => navigation.goBack()}
        rightText="Mark all as read"
      />

      <Notification
        title="New message from Dr. Smith"
        subtitle="Your lab results are ready to view"
        time="2 minutes ago"
        isRead={isRead}
        markAsRead={() => setIsRead(true)}
      />
    </CustomSafeAreaView>
  );
};

type NotificationProps = {
  title: string;
  subtitle: string;
  time: string;
  markAsRead: () => void;
  isRead?: boolean;
};

const Notification: FC<NotificationProps> = ({
  title,
  subtitle,
  time,
  markAsRead,
  isRead = false,
}) => {
  const styles = StyleSheet.create({
    notificationContainer: {
      width: '95%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
      backgroundColor: isRead ? Colors.lightGray : Colors.white,
      borderRadius: 10,
    },
    notificationContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    notificationMessage: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
    },
    notificationSubtitle: {
      fontSize: 14,
      color: Colors.muted,
    },
    notificationTime: {
      fontSize: 12,
      color: Colors.gray,
    },
    notificationIcon: {
      fontSize: 24,
      color: isRead ? 'transparent' : Colors.primary,
    },
  });

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationContent}>
        <MaterialIcon name="notifications" style={styles.notificationIcon} />
        <View style={styles.notificationMessage}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.notificationSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.notificationTime} numberOfLines={1}>
            {time}
          </Text>
        </View>
        {!isRead && (
          <TouchableOpacity onPress={markAsRead}>
            <MaterialIcon name="check" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
