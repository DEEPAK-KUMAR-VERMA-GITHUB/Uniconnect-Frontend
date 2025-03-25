import {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Screens} from '../constants/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomButton} from '../components/GlobalComponents';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    rowGap: 27,
    padding: 27,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 100,
  },
  textTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: Colors.current,
    textAlign: 'center',
  },
  textSubTitle: {
    fontSize: 18,
    color: Colors.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textAgreement: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export const LandingScreen: FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/uniconnect_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.textTitle}>Welcome</Text>
      <Text style={styles.textSubTitle}>
        Sign in to your accout or create a new one to get started
      </Text>
      <CustomButton
        title="Login"
        onPress={() => {
          navigation.navigate('LoginScreen' as never);
        }}
      />
      <CustomButton
        title="Register"
        onPress={() => {
          navigation.navigate(Screens.Option as never);
        }}
        backgroundColor={Colors.white}
        color={Colors.dark}
        borderColor={Colors.primary}
      />

      <Text style={styles.textAgreement}>
        By continuing, you agree our "Terms of Service and Privacy Policy"
      </Text>
    </SafeAreaView>
  );
};
