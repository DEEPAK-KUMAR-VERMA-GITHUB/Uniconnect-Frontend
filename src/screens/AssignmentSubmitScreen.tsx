import {FC} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {
  CustomButton,
  CustomSafeAreaView,
  TabHeader,
} from '../components/GlobalComponents';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {Colors, Screens} from '../constants/Constants';

export const AssignmentSubmitScreen: FC = () => {
  const navigation = useNavigation();

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
        title="Submit Assignment"
        leftIconClick={() => navigation.navigate(Screens.Assignments as never)}
      />
      <AssignmentInfoCard />

      <CustomButton
        title="Upload Assignment"
        onPress={() => Alert.alert('Upload')}
        width={'50%'}
      />
    </CustomSafeAreaView>
  );
};

const AssignmentInfoCard: FC = () => {
  const styles = StyleSheet.create({
    container: {
      width: '95%',
      backgroundColor: Colors.white,
      padding: 20,
      borderRadius: 10,
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 1,
      gap: 10,
    },
    headerContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.gray,
      paddingBottom: 10,
    },
    textHeader: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    infoTitle: {
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Data Structrues Assignment</Text>
      </View>
      <View style={{gap: 5}}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Course : </Text>
          <Text>CS201 - Data Structures</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Due Date : </Text>
          <Text>May 15, 2025 - 11:59 PM</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Status :</Text>
          <Text style={{color: Colors.danger}}>Not Submitted</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Points :</Text>
          <Text>100</Text>
        </View>
      </View>
    </View>
  );
};
