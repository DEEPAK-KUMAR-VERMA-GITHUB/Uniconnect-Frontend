import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
} from '../components/GlobalComponents';
import {Colors} from '../constants/Constants';
import {courses, semesters, sessions} from '../data';
import {studentRegisterSchema} from '../schemas/registrationSchema';

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

      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          mobileNumber: '',
          rollNumber: '',
          course: '',
          session: '',
          semester: '',
        }}
        validationSchema={studentRegisterSchema}
        onSubmit={async (values, {setSubmitting}) => {
          try {
            setSubmitting(true);
            console.log(values);
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}>
        {({
          values,
          isSubmitting,
          errors,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <>
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              leftIcon="short-text"
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              error={errors.fullName}
            />
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              leftIcon="mail-outline"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={true}
              leftIcon="lock-outline"
              rightIcon="visibility-off"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password}
            />
            <CustomInput
              label="Mobile Number"
              placeholder="9876543210"
              leftIcon="call"
              keyboardType="phone-pad"
              onChangeText={handleChange('mobileNumber')}
              onBlur={handleBlur('mobileNumber')}
              error={errors.mobileNumber}
            />
            <CustomInput
              label="Roll Number"
              placeholder="Enter your roll number"
              leftIcon="123"
              onChangeText={handleChange('rollNumber')}
              onBlur={handleBlur('rollNumber')}
              error={errors.rollNumber}
            />

            <CustomPicker
              label="Select Course"
              selectedItem={selectedCourse}
              setSelectedItem={setSelectedCourse}
              itemsList={courses}
              onValueChange={itemValue => handleChange('course')(itemValue)}
            />

            <CustomPicker
              label="Select Session"
              selectedItem={selectedCourse}
              setSelectedItem={setSelectedCourse}
              itemsList={sessions}
              onValueChange={itemValue => handleChange('session')(itemValue)}
            />

            <CustomPicker
              label="Select Semester"
              selectedItem={selectedCourse}
              setSelectedItem={setSelectedCourse}
              itemsList={semesters}
              onValueChange={itemValue => handleChange('semester')(itemValue)}
            />

            <Text style={styles.textSubTitle}>
              By creating an account, you agree to our Terms of Service and
              Privacy
            </Text>

            <CustomButton title="Register Now" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </CustomSafeAreaView>
  );
};
