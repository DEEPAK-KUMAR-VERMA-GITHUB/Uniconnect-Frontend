import {DocumentPickerResponse} from '@react-native-documents/picker';
import {useNavigation} from '@react-navigation/native';
import {Dispatch, FC, ReactNode, SetStateAction, useRef, useState} from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
  Divider,
  TabHeader,
  UploaderButton,
  UploadResourceBtn,
} from '../components/GlobalComponents';
import {Colors} from '../constants/Constants';
import {courses, semesters, sessions, subjects} from '../data';

export const NotesScreen: FC = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <CustomSafeAreaView
      navigation={navigation as any}
      contentContainerStyle={{flex: 1, gap: 10}}>
      <TabHeader title="My Notes" leftIconClick={() => navigation.goBack()} />

      <FlatList
        data={[
          {
            id: '1',
            subjectTitle: 'Mathematics',
            subjectSemester: 'Semester 1',
            uploadedDate: '12/09/2021',
            facultyName: 'Dr. John Doe',
            onPress: () => console.log('Download'),
            icon: 'folder',
          },
        ]}
        renderItem={({item}) => (
          <NoteSection subjectTitle={item.subjectTitle}>
            <Note
              subjectTitle={item.subjectTitle}
              subjectSemester={item.subjectSemester}
              uploadedDate={item.uploadedDate}
              facultyName={item.facultyName}
              onPress={item.onPress}
              icon={item.icon}
            />
          </NoteSection>
        )}
        keyExtractor={item => item.id}
      />

      <UploadResourceBtn handleUploadClick={() => setModalVisible(true)} />
      <UploadModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
        justifyContent: 'center',
        alignItems: 'center',
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
      width: '95%',
      padding: 27,
      backgroundColor: Colors.white,
      borderRadius: 10,
      elevation: 5,
      gap: 15,
      alignSelf: 'center',
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
      backgroundColor: Colors.green,
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

type UploadModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

const UploadModal: FC<UploadModalProps> = ({modalVisible, setModalVisible}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(
    courses[0].value,
  );
  const [selectedSession, setSelectedSession] = useState<string>(
    sessions[0].value,
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
    semesters[0].value,
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjects[0].value,
  );
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();

  // add ref for scrollview
  const scrollViewRef = useRef<ScrollView>(null);
  // Add state to track currently focused input
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Function to handle input focus
  const handleInputFocus = (inputName: string, y: number) => {
    setFocusedInput(inputName);
    // Scroll to the focused input if it's below keyboard
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true,
    });
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 27,
      alignItems: 'center',
      width: '90%',
      gap: 10,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Upload Course Notes
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: Colors.lightGray,
              }}>
              <MaterialIcon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <Divider />

          <ScrollView
            ref={scrollViewRef}
            style={{width: '100%'}}
            showsHorizontalScrollIndicator={false}>
            <CustomInput
              label="Note Title"
              placeholder="Enter Note Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              onInputFocus={() => handleInputFocus('title', 0)}
              onBlur={() => setFocusedInput(null)}
            />
            <CustomPicker
              label="Select Course"
              selectedItem={selectedCourse}
              setSelectedItem={setSelectedCourse}
              itemsList={courses}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCourse(itemValue);
              }}
              backgroundColor={Colors.light}
            />

            <CustomPicker
              label="Select Session"
              selectedItem={selectedSession}
              setSelectedItem={setSelectedSession}
              itemsList={sessions}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedSession(itemValue);
              }}
              backgroundColor={Colors.light}
            />

            <CustomPicker
              label="Select Semester"
              selectedItem={selectedSemester}
              setSelectedItem={setSelectedSemester}
              itemsList={semesters}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedSemester(itemValue);
              }}
              backgroundColor={Colors.light}
            />

            <CustomPicker
              label="Select Subject"
              selectedItem={selectedSubject}
              setSelectedItem={setSelectedSubject}
              itemsList={subjects}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedSubject(itemValue);
              }}
              backgroundColor={Colors.light}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              }}>
              <CustomButton
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                }}
                width={'45%'}
                backgroundColor={Colors.danger}
              />

              <UploaderButton
                file={file}
                setFile={setFile}
                setModalVisible={setModalVisible}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
