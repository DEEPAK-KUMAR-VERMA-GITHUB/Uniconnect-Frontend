import {useNavigation} from '@react-navigation/native';
import {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  CustomButton,
  CustomInput,
  CustomSafeAreaView,
  LinkText,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {Formik} from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must contain atleast 8 characters')
    .required('Required'),
});

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
            navigator.navigate(Screens.Home as never);
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}>
        {({values, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
          <form>
            <CustomInput
              leftIcon="mail-outline"
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <CustomInput
              leftIcon="lock-outline"
              placeholder="Password"
              rightIcon="visibility-off"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            <CustomButton
              title="Sign In"
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          </form>
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
