import { FC, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
} from '../components/GlobalComponents';
import { Colors } from '../constants/Constants';
import { courses } from '../data';

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

export const StudentRegisterScreen: FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('0');
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
        label="Roll Number"
        placeholder="Enter your roll number"
        leftIcon="123"
      />

      <CustomPicker
        label="Select Course"
        selectedItem={selectedCourse}
        setSelectedItem={setSelectedCourse}
        itemsList={courses}
      />

      <CustomPicker
        label="Select Session"
        selectedItem={selectedCourse}
        setSelectedItem={setSelectedCourse}
        itemsList={courses}
      />

      <CustomPicker
        label="Select Semester"
        selectedItem={selectedCourse}
        setSelectedItem={setSelectedCourse}
        itemsList={courses}
      />

      <Text style={styles.textSubTitle}>
        By creating an account, you agree to our Terms of Service and Privacy
      </Text>

      <CustomButton title="Register Now" onPress={() => {}} />
    </CustomSafeAreaView>
  );
};


