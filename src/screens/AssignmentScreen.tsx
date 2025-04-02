import {Dispatch, FC, SetStateAction, use, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomButton,
  CustomDatePicker,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
  Divider,
  TabHeader,
  UploaderButton,
  UploadResourceBtn,
} from '../components/GlobalComponents';
import {useNavigation} from '@react-navigation/native';
import {Colors, Screens} from '../constants/Constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {courses, semesters, sessions, subjects} from '../data';
import {DocumentPickerResponse} from '@react-native-documents/picker';

export const AssignmentScreen: FC = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleUpload = () => {
    navigation.navigate(Screens.AssignmentSubmit as never);
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      gap: 5,
    },
    assignmentsContainer: {
      flex: 1,
      paddingVertical: 10,
    },
  });

  return (
    <CustomSafeAreaView
      contentContainerStyle={styles.content}
      navigation={navigation as any}
      tabHeader="My Assignments">
      <ScrollView
        style={styles.assignmentsContainer}
        showsVerticalScrollIndicator={false}>
        <Assignment
          title="Math Assignment"
          subtitle="Complete Problems 15-30 from chapter"
          time="20"
          isCompleted={false}
          gotoDetails={handleUpload}
        />
      </ScrollView>
      <UploadResourceBtn handleUploadClick={() => setModalVisible(true)} />
      <UploadModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </CustomSafeAreaView>
  );
};

type AssignmentProps = {
  title: string;
  subtitle: string;
  time: string;
  gotoDetails: () => void;
  isCompleted?: boolean;
};

const Assignment: FC<AssignmentProps> = ({
  title,
  subtitle,
  time,
  gotoDetails,
  isCompleted = false,
}) => {
  const styles = StyleSheet.create({
    AssignmentContainer: {
      width: '95%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
      backgroundColor: isCompleted ? Colors.lightGray : Colors.white,
      borderRadius: 10,
      alignSelf: 'center',
    },
    AssignmentContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    AssignmentMessage: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    AssignmentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
    },
    AssignmentSubtitle: {
      fontSize: 14,
      color: Colors.muted,
    },
    AssignmentTime: {
      fontSize: 12,
      color: Colors.gray,
    },
    AssignmentIcon: {
      fontSize: 24,
      color: isCompleted ? 'transparent' : Colors.primary,
    },
    goToBtn: {
      padding: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 5,
      backgroundColor: isCompleted ? Colors.green : Colors.primary,
      borderRadius: 100,
    },
  });

  return (
    <View style={styles.AssignmentContainer}>
      <View style={styles.AssignmentContent}>
        <MaterialIcon name="assignment" style={styles.AssignmentIcon} />
        <View style={styles.AssignmentMessage}>
          <Text style={styles.AssignmentTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.AssignmentSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.AssignmentTime} numberOfLines={1}>
            <MaterialIcon name="calendar-month" size={12} color={Colors.gray} />{' '}
            Due : {time}
          </Text>
        </View>
        {!isCompleted ? (
          <TouchableOpacity onPress={gotoDetails} style={styles.goToBtn}>
            <MaterialIcon name="arrow-right" size={30} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <MaterialIcon name="check" size={30} color={Colors.green} />
        )}
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
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Calculate today and max date (7 days from today)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

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

  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate >= today && selectedDate <= maxDate) {
      setDate(selectedDate);
    } else {
      Alert.alert(
        'Invalid Date',
        'Please select a date between today and 7 days from now',
      );
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
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
              Upload Course Assignment
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
              label="Assignment Title"
              placeholder="Enter Note Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              onInputFocus={() => handleInputFocus('title', 0)}
              onBlur={() => setFocusedInput(null)}
            />
            <CustomInput
              label="Due Date"
              placeholder={date.toLocaleDateString()}
              backgroundColor={Colors.light}
              boxPadding={5}
              editable={false}
              rightIcon="calendar-month"
              onRightIconCLick={openDatePicker}
              value={date.toLocaleDateString()}
            />
            {showDatePicker && (
              <CustomDatePicker
                label="Select Due Date"
                onDateChange={handleDateChange}
                isVisible={showDatePicker}
                onClose={closeDatePicker}
                currentDate={date}
                minimumDate={today} // Set minimum date to today
                maximumDate={maxDate} // Set maximum date to 7 days from today
              />
            )}
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
