// Uniconnect/src/screens/AssignmentScreen.tsx
import {FC, useCallback, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useFacultySubjects} from '../store/apis/subjects';
import {useAuth, User} from '../store/contexts/AuthContext';
import Toast from '../components/Toast';
import {useRefresh} from '../utils/useRefresh';

export const AssignmentScreen: FC = () => {
  const navigation = useNavigation();
  const {user, isLoading} = useAuth();
  const subjects =
    user?.role === 'faculty'
      ? useFacultySubjects(user?._id).data
      : user?.associations.subjects;

  const [refreshing, setRefreshing] = useState(false);
  const {refreshUserProfile} = useRefresh();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserProfile({showToast: false});
      Toast.success('Profile refreshed');
    } catch (error) {
      Toast.error('Failed to refresh profile');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUserProfile]);

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader title="Assignments" />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading subjects...</Text>
        </View>
      ) : subjects?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No subjects found</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          renderItem={({item}) => (
            <SubjectCard subject={item} navigation={navigation} user={user} />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </CustomSafeAreaView>
  );
};

type SubjectCardProps = {
  subject: any;
  navigation: any;
  user: User | null;
};

const SubjectCard: FC<SubjectCardProps> = ({subject, navigation, user}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 15,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    icon: {
      backgroundColor: Colors.primary,
      padding: 8,
      borderRadius: 50,
    },
    info: {
      marginTop: 10,
      gap: 5,
    },
    infoText: {
      color: Colors.gray,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(
          Screens.SubjectAssignments as never,
          {subject} as never,
        )
      }>
      <View style={styles.header}>
        <Text style={styles.title}>{subject.name}</Text>
        <View style={styles.icon}>
          <MaterialIcon name="assignment" size={24} color={Colors.white} />
        </View>
      </View>

      {user?.role === 'student' ? (
        <View style={styles.info}>
          <Text style={styles.infoText}>Code: {subject.code}</Text>
          <Text style={styles.infoText}>Credits: {subject.credits}</Text>
        </View>
      ) : (
        <View style={styles.info}>
          <Text style={styles.infoText}>
            Course: {subject.course?.name || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            Semester: {subject.semester?.semesterName || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            Faculty: {subject.faculty?.fullName || 'Not Assigned'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
