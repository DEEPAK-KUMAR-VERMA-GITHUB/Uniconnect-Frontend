import {FC, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useAuth} from '../store/contexts/AuthContext';
import {useFacultySubjects} from '../store/apis/subjects';

export const FacultySubjectsScreen: FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {data: subjects, isLoading} = useFacultySubjects(user?._id);

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader
        title="My Subjects"
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading subjects...</Text>
        </View>
      ) : subjects?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No subjects assigned to you</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
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
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 1,
      paddingBottom: 10,
      marginBottom: 10,
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
      gap: 5,
      marginBottom: 10,
    },
    infoText: {
      color: Colors.gray,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    actionText: {
      color: Colors.white,
      marginLeft: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{subject.name}</Text>
        <View style={styles.icon}>
          <MaterialIcon name="book" size={24} color={Colors.white} />
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
          Session: {subject.session?.name || 'N/A'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(Screens.SubjectNotesScreen, {subject})
          }>
          <MaterialIcon name="description" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(Screens.SubjectPYQsScreen, {subject})
          }>
          <MaterialIcon name="quiz" size={20} color={Colors.white} />
          <Text style={styles.actionText}>PYQs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate(Screens.SubjectAssignmentsScreen, {subject})
          }>
          <MaterialIcon name="assignment" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Assignments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
