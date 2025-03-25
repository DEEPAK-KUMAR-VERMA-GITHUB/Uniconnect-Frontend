import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import {FC} from 'react';
import {Text} from 'react-native';
import {OptionScreen} from '../src/screens/OptionScreen';
import {LoginScreen} from './screens/LoginScreen';
import {LandingScreen} from './screens/LandingScreen';
import {Screens} from './constants/Constants';
import {StudentRegisterScreen} from './screens/StudentRegisterScreen';
import {FacultyRegistrationScreen} from './screens/FacultyRegistrationScreen';
import {HomeScreen} from './screens/HomeScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// signedIn navigation
export const SignedInNavigation: FC = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName={Screens.Home}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name={Screens.Home} component={HomeScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export const SignedOutNavigation: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={`${Screens.Splash}`} component={SplashScreen} />
        <Stack.Screen name={`${Screens.Landing}`} component={LandingScreen} />
        <Stack.Screen name={`${Screens.Option}`} component={OptionScreen} />
        <Stack.Screen name={`${Screens.Login}`} component={LoginScreen} />

        <Stack.Screen
          name={`${Screens.StudentRegister}`}
          component={StudentRegisterScreen}
        />
        <Stack.Screen
          name={`${Screens.FacultyRegister}`}
          component={FacultyRegistrationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
