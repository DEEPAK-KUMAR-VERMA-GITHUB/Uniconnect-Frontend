import { useNavigation } from '@react-navigation/native';
import { FC, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { CustomSafeAreaView, TabHeader } from '../components/GlobalComponents';
import { Colors, Screens } from '../constants/Constants';
import { useAuth, User } from '../store/contexts/AuthContext';

export const PYQsScreen: FC = () => {
  const {user, isLoading} = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const subjects = user?.associations.subjects;

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader title="Previous Year Questions" />

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
      onPress={() => navigation.navigate(Screens.SubjectPYQs, {subject})}>
      <View style={styles.header}>
        <Text style={styles.title}>{subject.name}</Text>
        <View style={styles.icon}>
          <MaterialIcon name="quiz" size={24} color={Colors.white} />
        </View>
      </View>
      {user?.role === 'student' ? (
        <View style={styles.info}>
          <Text style={styles.infoText}>Code: {subject.code || 'N/A'}</Text>
          <Text style={styles.infoText}>
            Credits: {subject.credits || 'N/A'}
          </Text>
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
