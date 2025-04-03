import {useNavigation} from '@react-navigation/native';
import {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomDatePicker,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
  Divider,
  UploaderButton,
  UploadResourceBtn,
} from '../components/GlobalComponents';
import {Colors} from '../constants/Constants';
import {courses, semesters, sessions, subjects} from '../data';
import {DocumentPickerResponse} from '@react-native-documents/picker';

export const PYQsScreen: FC = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const files = [];
  return (
    <CustomSafeAreaView
      contentContainerStyle={{
        flex: 1,
        gap: 10,
      }}
      navigation={navigation as any}
      tabHeader="Previous Year Questions">
      <SubjectCard
        courseName="Computer Science"
        subjectName="Data Structures"
        subjectCode="CS 101"
        uploadedYear="2021"
        subjectSemester="1st"
        uploadedBy="Dr. Smith"
        downloadFile={() => {}}
      />

      <UploadResourceBtn handleUploadClick={() => setModalVisible(true)} />
      <UploadModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
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
      alignSelf: 'center',
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
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  // years on previous 100 including current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => ({
    label: (currentYear - i).toString(),
    value: (currentYear - i).toString(),
  }));

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
              Upload Question Paper
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: Colors.lightGray,
              }}>
              <MaterialIcons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <Divider />

          <ScrollView
            ref={scrollViewRef}
            style={{width: '100%'}}
            showsHorizontalScrollIndicator={false}>
            <CustomInput
              label="Paper Title"
              placeholder="Enter Paper Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              onInputFocus={() => handleInputFocus('title', 0)}
              onBlur={() => setFocusedInput(null)}
            />
            <CustomPicker
              label="Select Year"
              selectedItem={year}
              setSelectedItem={setYear}
              itemsList={years}
              onValueChange={(itemValue, itemIndex) => {
                setYear(itemValue);
              }}
              backgroundColor={Colors.light}
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
