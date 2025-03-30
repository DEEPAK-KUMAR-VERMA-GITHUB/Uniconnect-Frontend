import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {OptionScreen} from '../src/screens/OptionScreen';
import {BottomTabBar} from './components/BottomTabBar';
import {Screens} from './constants/Constants';
import {AssignmentScreen} from './screens/AssignmentScreen';
import {FacultyRegistrationScreen} from './screens/FacultyRegistrationScreen';
import {HomeScreen} from './screens/HomeScreen';
import {LandingScreen} from './screens/LandingScreen';
import {LoginScreen} from './screens/LoginScreen';
import {NotesScreen} from './screens/NotesScreen';
import {NotificationsScreen} from './screens/NotificationsScreen';
import {PYQsScreen} from './screens/PYQsScreen';
import SplashScreen from './screens/SplashScreen';
import {StudentRegisterScreen} from './screens/StudentRegisterScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AssignmentSubmitScreen} from './screens/AssignmentSubmitScreen';
import {StudentProfileScreen} from './screens/StudentProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// signedIn navigation
export const SignedInNavigation: FC = () => (
  <NavigationContainer>
    <SafeAreaProvider>
      <Tab.Navigator
        tabBar={props => <BottomTabBar {...props} />}
        initialRouteName={Screens.Home}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name={Screens.Home} component={HomeScreen} />
        <Tab.Screen name={Screens.Notes} component={NotesScreen} />
        <Tab.Screen
          name={Screens.Notifications}
          component={NotificationsScreen}
        />
        <Tab.Screen name={Screens.PYQs} component={PYQsScreen} />
        <Tab.Screen name={Screens.Assignments} component={AssignmentScreen} />
        <Tab.Screen
          name={Screens.AssignmentSubmit}
          component={AssignmentSubmitScreen}
        />

        <Tab.Screen name={Screens.Profile} component={StudentProfileScreen} />
      </Tab.Navigator>
    </SafeAreaProvider>
  </NavigationContainer>
);

export const SignedOutNavigation: FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
