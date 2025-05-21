import {useNavigation} from '@react-navigation/native';
import {FC, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useFacultySubjects} from '../store/apis/subjects';
import {useAuth} from '../store/contexts/AuthContext';

export const PYQsScreen: FC = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {data: subjects, isLoading, refetch} = useFacultySubjects(user?._id);

  const filteredSubjects = subjects?.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader title="Previous Year Questions" />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading subjects...</Text>
        </View>
      ) : filteredSubjects?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No subjects found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSubjects}
          renderItem={({item}) => (
            <SubjectCard subject={item} navigation={navigation} />
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
};

const SubjectCard: FC<SubjectCardProps> = ({subject, navigation}) => {
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

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Course: {subject.course?.name || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          Semester: {subject.semester?.name || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          Faculty: {subject.faculty?.fullName || 'Not Assigned'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
