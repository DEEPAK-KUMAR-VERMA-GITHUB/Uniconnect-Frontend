import React, {FC} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {
  CustomButton,
  CustomInput,
  CustomSafeAreaView,
  LinkText,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {LoginSchema} from '../schemas/loginSchema';

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

export const LoginScreen: FC = () => {
  const navigator = useNavigation();

  const handleLogin = async (email: string, password: string) => {
    console.log(email, password);
  };

  return (
    <CustomSafeAreaView>
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
        }) => (
          <>
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password}
              secureTextEntry={true}
            />
            <CustomButton
              title="Login"
              onPress={handleSubmit}
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
    </CustomSafeAreaView>
  );
};
