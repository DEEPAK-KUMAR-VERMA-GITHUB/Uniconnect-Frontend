import {useNavigation} from '@react-navigation/native';
import {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from './../constants/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 17,
  },
  logoImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    borderRadius: 100,
  },
  titleText: {fontSize: 40, color: 'white', fontWeight: 'bold'},
  subTitleText: {fontSize: 20, color: 'white', fontWeight: 'bold'},
  button: {
    backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 80,
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 20,
  },
});

const SplashScreen: FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('LandingScreen' as never);
  };

  return (
    <LinearGradient
      colors={[Colors.info, Colors.primary]}
      useAngle
      angle={135}
      angleCenter={{x: 0.5, y: 0.5}}
      style={styles.linearGradient}>
      <Image
        source={require('../assets/images/uniconnect_logo.png')}
        style={styles.logoImage}
      />

      <Text style={styles.titleText}>Uniconnect</Text>
      <Text style={styles.subTitleText}>Connect with your peers</Text>

      <TouchableOpacity onPress={handleGetStarted}>
        <Text style={styles.button}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SplashScreen;
