import {FC, use} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {useNavigation} from '@react-navigation/native';
import {Colors, Screens} from '../constants/Constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export const AssignmentScreen: FC = () => {
  const navigation = useNavigation();

  const handleUpload = () => {
    navigation.navigate(Screens.AssignmentSubmit as never);
  };

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
        title="My Assignments"
        leftIconClick={() => navigation.goBack()}
      />

      <Assignment
        title="Math Assignment"
        subtitle="Complete Problems 15-30 from chapter"
        time="20"
        isCompleted={false}
        gotoDetails={handleUpload}
      />
    </CustomSafeAreaView>
  );
};

type AssignmentProps = {
  title: string;
  subtitle: string;
  time: string;
  gotoDetails: () => void;
  isCompleted?: boolean;
};

const Assignment: FC<AssignmentProps> = ({
  title,
  subtitle,
  time,
  gotoDetails,
  isCompleted = false,
}) => {
  const styles = StyleSheet.create({
    AssignmentContainer: {
      width: '95%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
      backgroundColor: isCompleted ? Colors.lightGray : Colors.white,
      borderRadius: 10,
    },
    AssignmentContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    AssignmentMessage: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    AssignmentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
    },
    AssignmentSubtitle: {
      fontSize: 14,
      color: Colors.muted,
    },
    AssignmentTime: {
      fontSize: 12,
      color: Colors.gray,
    },
    AssignmentIcon: {
      fontSize: 24,
      color: isCompleted ? 'transparent' : Colors.primary,
    },
    uploadBtn: {
      padding: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 5,
      backgroundColor: isCompleted ? Colors.green : Colors.primary,
      borderRadius: 100,
    },
  });

  return (
    <View style={styles.AssignmentContainer}>
      <View style={styles.AssignmentContent}>
        <MaterialIcon name="assignment" style={styles.AssignmentIcon} />
        <View style={styles.AssignmentMessage}>
          <Text style={styles.AssignmentTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.AssignmentSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.AssignmentTime} numberOfLines={1}>
            <MaterialIcon name="calendar-month" size={12} color={Colors.gray} />{' '}
            Due : {time}
          </Text>
        </View>
        {!isCompleted ? (
          <TouchableOpacity onPress={gotoDetails} style={styles.uploadBtn}>
            <MaterialIcon name="arrow-right" size={30} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <MaterialIcon name="check" size={30} color={Colors.green} />
        )}
      </View>
    </View>
  );
};
