import {Formik} from 'formik';
import React, {FC, useState, useEffect, useMemo, useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomPicker,
} from '../components/GlobalComponents';
import Toast from '../components/Toast';
import {Colors, Screens} from '../constants/Constants';
import {studentRegisterSchema} from '../schemas/registrationSchema';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useDepartments} from '../store/apis/departments';
import {useCoursesByDepartment} from '../store/apis/courses';
import {useSessionsByCourse} from '../store/apis/sessions';
import {useSemestersBySession} from '../store/apis/semesters';
import {useCreateUser} from '../store/apis/users';
import {sanitizeInput} from '../utils/helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  content: {
    width: '90%',
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    gap: 10,
  },
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
  errorText: {
    color: Colors.danger,
    marginBottom: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  rollNumber: string;
  department: string;
  course: string;
  session: string;
  semester: string;
};

const initialValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  rollNumber: '',
  department: '',
  course: '',
  session: '',
  semester: '',
};

export const StudentRegisterScreen: FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {mutate: createUser} = useCreateUser();

  // Fetch departments
  const {
    data: departmentsData = [],
    error: departmentsError,
    isLoading: isDepartmentsLoading,
  } = useDepartments();

  // Fetch courses based on selected department
  const {
    data: coursesData = [],
    error: coursesError,
    isLoading: isCoursesLoading,
  } = useCoursesByDepartment(selectedDepartment);

  // Fetch sessions based on selected course
  const {
    data: sessionsData = [],
    error: sessionsError,
    isLoading: isSessionsLoading,
  } = useSessionsByCourse(selectedCourse);

  // Fetch semesters based on selected session
  const {
    data: semestersData = [],
    error: semestersError,
    isLoading: isSemestersLoading,
  } = useSemestersBySession(selectedSession);

  // Memoize the departments list with a default empty option
  const departments = useMemo(() => {
    return [{label: 'Select Department', value: ''}, ...departmentsData];
  }, [departmentsData]);

  // Memoize the courses list with a default empty option
  const courses = useMemo(() => {
    return [{label: 'Select Course', value: ''}, ...coursesData];
  }, [coursesData]);

  // Memoize the sessions list with a default empty option
  const sessions = useMemo(() => {
    return [{label: 'Select Session', value: ''}, ...sessionsData];
  }, [sessionsData]);

  // Memoize the semesters list with a default empty option
  const semesters = useMemo(() => {
    return [{label: 'Select Semester', value: ''}, ...semestersData];
  }, [semestersData]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  // Handle department selection
  const handleDepartmentChange = useCallback(
    (value: string, setFieldValue: any, setFieldTouched: any) => {
      setFieldValue('department', value);
      setFieldTouched('department', true);
      setSelectedDepartment(value === '' ? null : value);

      // Reset dependent fields when department changes
      setFieldValue('course', '');
      setSelectedCourse(null);
      setFieldValue('session', '');
      setSelectedSession(null);
      setFieldValue('semester', '');
    },
    [],
  );

  // Handle course selection
  const handleCourseChange = useCallback(
    (value: string, setFieldValue: any, setFieldTouched: any) => {
      setFieldValue('course', value);
      setFieldTouched('course', true);
      setSelectedCourse(value === '' ? null : value);

      // Reset dependent fields when course changes
      setFieldValue('session', '');
      setSelectedSession(null);
      setFieldValue('semester', '');
    },
    [],
  );

  // Handle session selection
  const handleSessionChange = useCallback(
    (value: string, setFieldValue: any, setFieldTouched: any) => {
      setFieldValue('session', value);
      setFieldTouched('session', true);
      setSelectedSession(value === '' ? null : value);

      // Reset semester when session changes
      setFieldValue('semester', '');
    },
    [],
  );

  // Handle semester selection
  const handleSemesterChange = useCallback(
    (value: string, setFieldValue: any, setFieldTouched: any) => {
      setFieldValue('semester', value);
      setFieldTouched('semester', true);
    },
    [],
  );

  // Handle text input changes with sanitization
  const handleTextChange = useCallback(
    (
      field: string,
      value: string,
      setFieldValue: any,
      setFieldTouched: any,
      shouldSanitize: boolean = true,
    ) => {
      setFieldValue(field, shouldSanitize ? sanitizeInput(value) : value);
      setFieldTouched(field, true);
    },
    [],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (values: FormValues) => {
      setIsRegistering(true);
      createUser(
        {
          ...values,
          role: 'student',
        },
        {
          onSuccess: () => {
            setIsRegistering(false);
            Toast.success('Registration successful');
            navigation.navigate(Screens.Login);
          },
          onError: error => {
            setIsRegistering(false);
            console.error('Registration error:', error);
            const errorMessage =
              error.response?.data?.message || 'Registration failed';
            Toast.error(errorMessage);
          },
        },
      );
    },
    [createUser, navigation],
  );

  // Handle retry for department loading error
  const handleRetry = useCallback(() => {
    // Retry fetching departments
    window.location.reload();
  }, []);

  if (departmentsError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load departments</Text>
        <CustomButton title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
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
          initialValues={initialValues}
          validationSchema={studentRegisterSchema}
          onSubmit={handleSubmit}>
          {({
            values,
            errors,
            isValid,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <>
              <CustomInput
                label="Full Name"
                placeholder="Enter your full name"
                leftIcon="short-text"
                value={values.fullName}
                onChangeText={text =>
                  handleTextChange(
                    'fullName',
                    text,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
                onBlur={handleBlur('fullName')}
                error={errors.fullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                leftIcon="mail-outline"
                value={values.email}
                onChangeText={text =>
                  handleTextChange(
                    'email',
                    text,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
                onBlur={handleBlur('email')}
                error={errors.email}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                leftIcon="lock-outline"
                rightIcon={isPasswordVisible ? 'visibility' : 'visibility-off'}
                onRightIconClick={togglePasswordVisibility}
                value={values.password}
                onChangeText={text =>
                  handleTextChange(
                    'password',
                    text,
                    setFieldValue,
                    setFieldTouched,
                    false,
                  )
                }
                onBlur={handleBlur('password')}
                error={errors.password}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <CustomInput
                label="Mobile Number"
                placeholder="9876543210"
                leftIcon="call"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={text =>
                  handleTextChange(
                    'phoneNumber',
                    text,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
                onBlur={handleBlur('phoneNumber')}
                error={errors.phoneNumber}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <CustomInput
                label="Roll Number"
                placeholder="Enter your roll number"
                leftIcon="123"
                value={values.rollNumber}
                onChangeText={text =>
                  handleTextChange(
                    'rollNumber',
                    text,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
                onBlur={handleBlur('rollNumber')}
                error={errors.rollNumber}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <CustomPicker
                label="Select Department"
                selectedItem={values.department}
                setSelectedItem={value =>
                  handleDepartmentChange(value, setFieldValue, setFieldTouched)
                }
                itemsList={departments}
                onValueChange={itemValue =>
                  handleDepartmentChange(
                    itemValue,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
              />

              <CustomPicker
                label="Select Course"
                selectedItem={values.course}
                setSelectedItem={value =>
                  handleCourseChange(value, setFieldValue, setFieldTouched)
                }
                itemsList={
                  isCoursesLoading
                    ? [{label: 'Loading...', value: ''}]
                    : courses
                }
                onValueChange={itemValue =>
                  handleCourseChange(itemValue, setFieldValue, setFieldTouched)
                }
              />

              <CustomPicker
                label="Select Session"
                selectedItem={values.session}
                setSelectedItem={value =>
                  handleSessionChange(value, setFieldValue, setFieldTouched)
                }
                itemsList={
                  isSessionsLoading
                    ? [{label: 'Loading...', value: ''}]
                    : sessions
                }
                onValueChange={itemValue =>
                  handleSessionChange(itemValue, setFieldValue, setFieldTouched)
                }
              />

              <CustomPicker
                label="Select Semester"
                selectedItem={values.semester}
                setSelectedItem={value =>
                  handleSemesterChange(value, setFieldValue, setFieldTouched)
                }
                itemsList={
                  isSemestersLoading
                    ? [{label: 'Loading...', value: ''}]
                    : semesters
                }
                onValueChange={itemValue =>
                  handleSemesterChange(
                    itemValue,
                    setFieldValue,
                    setFieldTouched,
                  )
                }
              />

              <Text style={styles.textSubTitle}>
                By creating an account, you agree to our Terms of Service and
                Privacy
              </Text>

              <CustomButton
                title={isRegistering ? 'Registering...' : 'Register Now'}
                onPress={handleSubmit}
                disabled={!isValid || isRegistering}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
