import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Alert,
  TextInput,
} from 'react-native';
import {
  CustomButton,
  CustomInput,
  LinkText,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {LoginFormValues, LoginSchema} from '../schemas/loginSchema';
import {useAuth} from '../store/contexts/AuthContext';
import ToastAlert from '../components/Toast';

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.current,
  },
  textSubtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
});

type RootStackParamList = {
  Login: undefined;
  Option: undefined;
};

export const LoginScreen: FC = () => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();
  const {login} = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Show success message if login is successful
      ToastAlert.success('Login successful!');
    } catch (error: any) {
      // Get the error message from the backend response
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while trying to log in.';
      const errorTitle = error.response?.data?.error || 'Error';

      ToastAlert.error(errorTitle, errorMessage);
      console.error('Login error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: Colors.light,
        justifyContent: 'center',
        paddingHorizontal: 40,
        alignItems: 'center',
        gap: 20,
      }}>
      <Text style={styles.textTitle}>Welcome Back</Text>
      <Text style={styles.textSubtitle}>
        Sign in to your account to continue
      </Text>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={async (values, {setSubmitting}) => {
          try {
            setSubmitting(true);
            await handleLogin(values.email, values.password);
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}>
        {({
          values,
          setFieldValue,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
          isValid,
          touched,
          setFieldTouched,
        }) => (
          <>
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={text => {
                setFieldValue('email', text);
                setFieldTouched('email', true);
              }}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={text => {
                setFieldValue('password', text);
                setFieldTouched('password', true);
              }}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              rightIcon={isPasswordVisible ? 'visibility' : 'visibility-off'}
              onRightIconClick={() => {
                setIsPasswordVisible(prev => !prev);
              }}
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
            />
            <CustomButton
              title="Login"
              onPress={() => handleSubmit()}
              disabled={!isValid || isSubmitting}
            />
          </>
        )}
      </Formik>

      <LinkText
        linkText="Forgot Password ?"
        onPress={() => {
          navigator.navigate(Screens.ForgotPassword as never);
        }}
      />
      <LinkText
        text="Don't have an account ?"
        linkText="Sign Up"
        onPress={() => {
          navigator.navigate(Screens.Option as never);
        }}
      />
    </KeyboardAvoidingView>
  );
};
