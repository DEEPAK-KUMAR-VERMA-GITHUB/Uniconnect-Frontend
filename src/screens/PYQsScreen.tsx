import {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {courseRoutes} from './../../../backend/src/routes/course.route';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export const PYQsScreen: FC = () => {
  const navigation = useNavigation();

  const files = [];
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
        title="Previous Year Questions"
        leftIconClick={() => navigation.goBack()}
      />

      <SubjectCard
        courseName="Computer Science"
        subjectName="Data Structures"
        subjectCode="CS 101"
        uploadedYear="2021"
        subjectSemester="1st"
        uploadedBy="Dr. Smith"
        downloadFile={() => {}}
      />
    </CustomSafeAreaView>
  );
};

type SubjectCardProps = {
  courseName: string;
  subjectName: string;
  subjectCode: string;
  uploadedYear: string;
  subjectSemester: string;
  downloadFile?: () => void;
  uploadedBy: string;
};

const SubjectCard: FC<SubjectCardProps> = ({
  courseName,
  subjectName,
  subjectCode,
  uploadedYear,
  subjectSemester,
  uploadedBy,
  downloadFile,
}) => {
  const styles = StyleSheet.create({
    courseContainer: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      width: '95%',
      padding: 10,
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 1,
      gap: 10,
      alignItems: 'center',
    },
    courseHeader: {
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 1,
      padding: 5,
      width: '100%',
    },
    courseHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    subjectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      width: '95%',
      backgroundColor: Colors.light,
      padding: 10,
      borderRadius: 5,
    },
    subjectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    fileTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    fileSubTitle: {
      fontSize: 12,
      color: Colors.muted,
    },
    downloadButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: Colors.lightGray,
    },
  });

  return (
    <View style={styles.courseContainer}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseHeaderText}>{courseName}</Text>
      </View>
      <View style={styles.subjectContainer}>
        <View style={styles.subjectHeader}>
          <View>
            <Text style={styles.fileTitle} numberOfLines={1}>
              {subjectName} • {subjectCode}
            </Text>
            <Text style={styles.fileSubTitle}>
              {uploadedBy} • {uploadedYear} • {subjectSemester}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadFile}>
            <MaterialIcons name="download" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
