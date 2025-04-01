import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomMultiSelecter,
  CustomPicker,
  CustomSafeAreaView,
} from '../components/GlobalComponents';
import {Colors} from '../constants/Constants';
import {courses, departments, designations, semesters, sessions} from '../data';
import {facultyRegisterSchema} from '../schemas/registrationSchema';

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
  const [selectedCourse, setSelectedCourses] = useState<
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
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          mobileNumber: '',
          facultyId: '',
          department: '',
          session: '',
          semester: '',
          courses: [],
        }}
        validationSchema={facultyRegisterSchema}
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
              label="Faculty ID"
              placeholder="Enter your Faculty ID"
              leftIcon="123"
              onChangeText={handleChange('facultyId')}
              onBlur={handleBlur('facultyId')}
              error={errors.facultyId}
            />

            <CustomPicker
              label="Select Department"
              selectedItem={selectedDepartment}
              setSelectedItem={setSelectedDepartment}
              itemsList={departments}
              onValueChange={itemValue => handleChange('department')(itemValue)}
            />

            <CustomPicker
              label="Select Session"
              selectedItem={selectedSession}
              setSelectedItem={setSelectedSession}
              itemsList={sessions}
              onValueChange={itemValue => handleChange('session')(itemValue)}
            />

            <CustomPicker
              label="Select Semester"
              selectedItem={selectedSemester}
              setSelectedItem={setSelectedSemester}
              itemsList={semesters}
              onValueChange={itemValue => handleChange('semester')(itemValue)}
            />

            <CustomPicker
              label="Select Designation"
              selectedItem={selectedDesignation}
              setSelectedItem={setSelectedDesignation}
              itemsList={designations}
              onValueChange={itemValue =>
                handleChange('designation')(itemValue)
              }
            />

            <CustomMultiSelecter
              items={courses}
              uniqueKey="label"
              displayKey="value"
              onSelectedItemsChange={selectedItems => {
                handleChange('courses')(
                  selectedItems.map(item => item.value).join(','),
                );
                setSelectedCourses(selectedItems);
              }}
              selectedItems={selectedCourse}
              selectText="Pick Courses"
              searchInputPlaceholderText="Search Courses..."
              onChangeInput={course => console.log(course)}
              noItemsText="Invalid Course Name"
            />

            <Text style={styles.textSubTitle}>
              By creating an account, you agree to our Terms of Service and
              Privacy
            </Text>

            <CustomButton
              title="Register Now"
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
            />
          </>
        )}
      </Formik>
    </CustomSafeAreaView>
  );
};
