import {useNavigation} from '@react-navigation/native';
import {FC, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useAuth} from '../store/contexts/AuthContext';
import {useGetUserSubjects} from '../store/apis/subjects';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const SubjectsScreen: FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {data: subjects = [], isLoading} = useGetUserSubjects();

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
      ) : subjects.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No subjects found</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          renderItem={({item}) => (
            <SubjectCard
              name={item.name}
              code={item.code}
              onPress={() =>
                navigation.navigate(
                  Screens.SubjectNotes as never,
                  {subjectId: item._id, subjectName: item.name} as never,
                )
              }
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
        />
      )}
    </CustomSafeAreaView>
  );
};

type SubjectCardProps = {
  name: string;
  code: string;
  onPress: () => void;
};

const SubjectCard: FC<SubjectCardProps> = ({name, code, onPress}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 2,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    code: {
      fontSize: 14,
      color: Colors.gray,
    },
    icon: {
      backgroundColor: Colors.lightGray,
      padding: 10,
      borderRadius: 50,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.code}>{code}</Text>
      </View>
      <View style={styles.icon}>
        <MaterialIcon name="arrow-forward" size={24} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};
