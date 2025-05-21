// ForgotPasswordScreen.tsx
import {Formik} from 'formik';
import React, {FC, useCallback, useState} from 'react';
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
  LinkText,
} from '../components/GlobalComponents';
import Toast from '../components/Toast';
import {Colors, Screens} from '../constants/Constants';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
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
    paddingBlock: 50,
    gap: 20,
  },
  lockIcon: {
    padding: 14,
    backgroundColor: Colors.primary,
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
    marginBottom: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    padding: 14,
    backgroundColor: Colors.green,
    borderRadius: 100,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    color: Colors.current,
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

type FormValues = {
  email: string;
};

const initialValues: FormValues = {
  email: '',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      'Invalid email address',
    )
    .required('Email is required'),
});

export const ForgotPasswordScreen: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = useCallback((values: FormValues) => {
    setIsSubmitting(true);

    // Simulate API call for password reset
    setTimeout(() => {
      // In a real app, you would call an API endpoint here
      // For example:
      // api.forgotPassword(values.email)
      //   .then(() => {
      //     setIsSubmitting(false);
      //     setIsSuccess(true);
      //   })
      //   .catch(error => {
      //     setIsSubmitting(false);
      //     Toast.error(error.message || 'Failed to send reset link');
      //   });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  }, []);

  const handleBackToLogin = () => {
    navigation.navigate(Screens.Login);
  };

  if (isSuccess) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.content, styles.successContainer]}
          showsVerticalScrollIndicator={false}>
          <MaterialIcon
            name="check-circle"
            size={40}
            color={Colors.white}
            style={styles.successIcon}
          />
          <Text style={styles.textTitle}>Email Sent</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions.
          </Text>
          <Text style={styles.textSubTitle}>
            If you don't receive an email within a few minutes, please check
            your spam folder.
          </Text>
          <CustomButton title="Back to Login" onPress={handleBackToLogin} />
        </ScrollView>
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
          name="lock-reset"
          size={40}
          color={Colors.white}
          style={styles.lockIcon}
        />
        <Text style={styles.textTitle}>Forgot Password</Text>
        <Text style={styles.textSubTitle}>
          Enter your email address and we'll send you a link to reset your
          password
        </Text>

        <View style={styles.formContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={forgotPasswordSchema}
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
              <View style={{display: 'flex', rowGap: 25}}>
                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  leftIcon="mail-outline"
                  value={values.email}
                  onChangeText={text => {
                    setFieldValue('email', sanitizeInput(text));
                    setFieldTouched('email', true);
                  }}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <CustomButton
                  title={isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  onPress={handleSubmit}
                  disabled={!isValid || isSubmitting}
                />
              </View>
            )}
          </Formik>
        </View>

        <View style={styles.linkContainer}>
          <LinkText
            text="Remember your password?"
            linkText="Login"
            onPress={handleBackToLogin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
