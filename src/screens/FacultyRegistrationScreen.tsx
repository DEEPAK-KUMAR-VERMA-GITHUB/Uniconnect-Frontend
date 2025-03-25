import {FC, useState} from 'react';
import {Text, View} from 'react-native';
import {
  CustomButton,
  CustomInput,
  CustomMultiSelecter,
  CustomPicker,
  CustomSafeAreaView,
} from '../components/GlobalComponents';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {StyleSheet} from 'react-native';
import {courses, departments, designations, semesters, sessions} from '../data';
import MultiSelect from 'react-native-multiple-select';

const styles = StyleSheet.create({
  addIcon: {
    padding: 14,
    backgroundColor: Colors.green,
    borderRadius: 100,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.current,
    textAlign: 'center',
  },
  textSubTitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export const FacultyRegistrationScreen: FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<
    Array<{label: string; value: string}>
  >([]);
  const [selectedSession, setSelectedSession] = useState<string>('0');
  const [selectedSemester, setSelectedSemester] = useState<string>('0');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('0');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('0');

  return (
    <CustomSafeAreaView contentContainerStyle={{flex: 0}}>
      <MaterialIcon
        name="person-add"
        size={40}
        color={Colors.white}
        style={styles.addIcon}
      />
      <Text style={styles.textTitle}>Create Account</Text>
      <Text style={styles.textSubTitle}>
        Join our community by filling out the registration form below
      </Text>
      <CustomInput
        label="Full Name"
        placeholder="Enter your full name"
        leftIcon="short-text"
      />
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        leftIcon="mail-outline"
      />
      <CustomInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        leftIcon="lock-outline"
        rightIcon="visibility-off"
      />
      <CustomInput
        label="Mobile Number"
        placeholder="9876543210"
        leftIcon="call"
        keyboardType="phone-pad"
      />
      <CustomInput
        label="Faculty ID"
        placeholder="Enter your Faculty ID"
        leftIcon="123"
      />

      <CustomPicker
        label="Select Department"
        selectedItem={selectedDepartment}
        setSelectedItem={setSelectedDepartment}
        itemsList={departments}
      />

      <CustomPicker
        label="Select Session"
        selectedItem={selectedSession}
        setSelectedItem={setSelectedSession}
        itemsList={sessions}
      />

      <CustomPicker
        label="Select Semester"
        selectedItem={selectedSemester}
        setSelectedItem={setSelectedSemester}
        itemsList={semesters}
      />

      <CustomPicker
        label="Select Designation"
        selectedItem={selectedDesignation}
        setSelectedItem={setSelectedDesignation}
        itemsList={designations}
      />

      <CustomMultiSelecter
        items={courses}
        uniqueKey="label"
        displayKey="value"
        onSelectedItemsChange={setSelectedCourse}
        selectedItems={selectedCourse}
        selectText="Pick Courses"
        searchInputPlaceholderText="Search Courses..."
        onChangeInput={course => console.log(course)}
        noItemsText="Invalid Course Name"
      />

      <Text style={styles.textSubTitle}>
        By creating an account, you agree to our Terms of Service and Privacy
      </Text>

      <CustomButton title="Register Now" onPress={() => {}} />
    </CustomSafeAreaView>
  );
};
