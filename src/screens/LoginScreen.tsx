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

  return (
    <CustomSafeAreaView>
      <Text style={styles.textTitle}>Welcome Back</Text>
      <Text style={styles.textSubtitle}>
        Sign in to your account to continue
      </Text>

      <CustomInput
        leftIcon="mail-outline"
        placeholder="Email"
        keyboardType="email-address"
      />
      <CustomInput
        leftIcon="lock-outline"
        placeholder="Password"
        rightIcon="visibility-off"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        onPress={() => {
          navigator.navigate(Screens.Home as never);
        }}
      />
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
