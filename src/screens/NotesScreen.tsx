import {FC, ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export const NotesScreen: FC = () => {
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
      <TabHeader title="My Notes" leftIconClick={() => navigation.goBack()} />

      <NoteSection subjectTitle="Mathematics">
        <Note
          subjectTitle="Mathematics"
          subjectSemester="Semester 1"
          uploadedDate="12/09/2021"
          facultyName="Dr. John Doe"
          onPress={() => console.log('Download')}
          icon="folder"
        />
      </NoteSection>
    </CustomSafeAreaView>
  );
};

type NoteSectionProps = {
  children?: ReactNode;
  subjectTitle: string;
};

const NoteSection: FC<NoteSectionProps> = ({children, subjectTitle}) => {
  return (
    <View
      style={{
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{subjectTitle}</Text>
      {children}
    </View>
  );
};

type NoteProps = {
  subjectTitle: string;
  subjectSemester: string;
  uploadedDate: string;
  facultyName: string;
  onPress?: () => void;
  icon?: string;
};

const Note: FC<NoteProps> = ({
  subjectTitle,
  subjectSemester,
  uploadedDate,
  facultyName,
  icon = 'folder',
  onPress,
}) => {
  const styles = StyleSheet.create({
    noteContainer: {
      width: '100%',
      padding: 27,
      backgroundColor: Colors.white,
      borderRadius: 10,
      elevation: 5,
      gap: 15,
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: Colors.gray,
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    noteSubject: {
      fontSize: 14,
      color: Colors.muted,
    },
    noteFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    noteUploaded: {
      color: Colors.gray,
    },
    noteFaculty: {
      color: Colors.gray,
    },
    noteDownload: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      backgroundColor: Colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      justifyContent: 'center',
    },
    noteDownloadText: {
      color: Colors.white,
    },
  });

  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteHeader}>
        <View style={{gap: 5}}>
          <Text style={styles.noteTitle}>{subjectTitle}</Text>
          <Text style={styles.noteSubject}>{subjectSemester}</Text>
        </View>
        <View>
          <MaterialIcon name={icon} size={40} color={Colors.primary} />
        </View>
      </View>
      <View style={styles.noteFooter}>
        <View style={{gap: 5}}>
          <Text style={styles.noteUploaded}>Uploaded : {uploadedDate} </Text>
          <Text style={styles.noteFaculty}>Faculty : {facultyName}</Text>
        </View>
        <TouchableOpacity style={styles.noteDownload} onPress={onPress}>
          <Text style={styles.noteDownloadText}>Download</Text>
          <MaterialIcon name="download" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
