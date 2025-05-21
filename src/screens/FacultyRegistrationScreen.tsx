import {Formik} from 'formik';
import React, {FC, useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomPicker,
} from '../components/GlobalComponents';
import Toast from '../components/Toast';
import {Colors, Screens} from '../constants/Constants';
import {designations} from '../data';
import {facultyRegisterSchema} from '../schemas/registrationSchema';
import {useDepartments} from '../store/apis/departments';
import {queryClient} from '../store/apis/queryClient';
import {useCreateUser} from '../store/apis/users';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

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
    paddingBlock: 50,
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 20,
  },
});

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  facultyId: string;
  department: string;
  designation: string;
};

const initialValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  facultyId: '',
  department: '',
  designation: '',
};

export const FacultyRegistrationScreen: FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const {data: departments = [], error} = useDepartments();
  const {mutate: createUser} = useCreateUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = useCallback(
    (values: FormValues) => {
      setIsRegistering(true);
      createUser(
        {
          ...values,
          role: 'faculty',
        },
        {
          onSuccess: () => {
            setIsRegistering(false);
            Toast.success('Registration successful');
            navigation.navigate(Screens.Login);
          },
          onError: error => {
            setIsRegistering(false);
            Toast.error('Registration failed');
          },
        },
      );
    },
    [createUser, navigation],
  );

  if (error) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load departments</Text>
        <CustomButton
          title="Retry"
          onPress={() => {
            queryClient.invalidateQueries({queryKey: ['departments']});
          }}
        />
      </KeyboardAvoidingView>
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
          validationSchema={facultyRegisterSchema}
          onSubmit={handleSubmit}>
          {({
            values,
            errors,
            isValid,
            handleBlur,
            handleChange,
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
                onChangeText={text => {
                  setFieldValue('fullName', text);
                  setFieldTouched('fullName', true);
                }}
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
                onChangeText={text => {
                  setFieldValue('email', text);
                  setFieldTouched('email', true);
                }}
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
                onRightIconClick={() => setIsPasswordVisible(prev => !prev)}
                value={values.password}
                onChangeText={text => {
                  setFieldValue('password', text);
                  setFieldTouched('password', true);
                }}
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
                onChangeText={text => {
                  setFieldValue('phoneNumber', text);
                  setFieldTouched('phoneNumber', true);
                }}
                onBlur={handleBlur('phoneNumber')}
                error={errors.phoneNumber}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <CustomInput
                label="Faculty ID"
                placeholder="Enter your Faculty ID"
                leftIcon="123"
                value={values.facultyId}
                onChangeText={text => {
                  setFieldValue('facultyId', text);
                  setFieldTouched('facultyId', true);
                }}
                onBlur={handleBlur('facultyId')}
                error={errors.facultyId}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <CustomPicker
                label="Select Department"
                selectedItem={values.department}
                setSelectedItem={value => {
                  setFieldValue('department', value);
                  setFieldTouched('department', true);
                }}
                itemsList={[
                  {label: 'Select Department', value: ''},
                  ...departments,
                ]}
                onValueChange={itemValue => {
                  setFieldValue('department', itemValue);
                  setFieldTouched('department', true);
                }}
              />

              <CustomPicker
                label="Select Designation"
                selectedItem={values.designation}
                setSelectedItem={value => {
                  setFieldValue('designation', value);
                  setFieldTouched('designation', true);
                }}
                itemsList={designations}
                onValueChange={itemValue => {
                  setFieldValue('designation', itemValue);
                  setFieldTouched('designation', true);
                }}
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
