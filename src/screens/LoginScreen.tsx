import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text} from 'react-native';
import {
  CustomButton,
  CustomInput,
  LinkText,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {LoginFormValues, LoginSchema} from '../schemas/loginSchema';

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

  const handleLogin = async (email: string, password: string) => {
    console.log(email, password);
  };

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
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
          isValid,
          touched,
        }) => (
          <>
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              secureTextEntry={true}
            />
            <CustomButton
              title="Login"
              onPress={() => handleSubmit()}
              disabled={!isValid || isSubmitting}
            />
          </>
        )}
      </Formik>

      <LinkText linkText="Forgot Password ?" onPress={() => {}} />
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
