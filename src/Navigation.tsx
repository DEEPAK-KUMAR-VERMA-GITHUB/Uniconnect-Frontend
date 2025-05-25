import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {OptionScreen} from '../src/screens/OptionScreen';
import {BottomTabBar} from './components/BottomTabBar';
import {Screens} from './constants/Constants';
import {AssignmentScreen} from './screens/AssignmentScreen';
import {AssignmentSubmitScreen} from './screens/AssignmentSubmitScreen';
import FacultyProfileScreen from './screens/FacultyProfileScreen';
import {FacultyRegistrationScreen} from './screens/FacultyRegistrationScreen';
import {ForgotPasswordScreen} from './screens/ForgotPasswordScreen';
import {HomeScreen} from './screens/HomeScreen';
import {LandingScreen} from './screens/LandingScreen';
import {LoginScreen} from './screens/LoginScreen';
import {NotesScreen} from './screens/NotesScreen';
import {NotificationsScreen} from './screens/NotificationsScreen';
import {PYQsScreen} from './screens/PYQsScreen';
import SplashScreen from './screens/SplashScreen';
import {StudentProfileScreen} from './screens/StudentProfileScreen';
import {StudentRegisterScreen} from './screens/StudentRegisterScreen';
import {SubjectNotesScreen} from './screens/SubjectNotesScreen';
import {useAuth} from './store/contexts/AuthContext';
import {PdfViewerScreen} from './screens/PdfViewerScreen';
import {SubjectPYQsScreen} from './screens/SubjectPYQsScreen';
import {SubjectAssignmentsScreen} from './screens/SubjectAssignmentsScreen';
import {AssignmentSubmissionsScreen} from './screens/AssignmentSubmissionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// signedIn navigation
export const SignedInNavigation: FC = () => {
  const {user} = useAuth();

  return (
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
      {user?.role === 'faculty' ? (
        <Tab.Screen name={Screens.Profile} component={FacultyProfileScreen} />
      ) : (
        <Tab.Screen name={Screens.Profile} component={StudentProfileScreen} />
      )}
      <Stack.Screen
        name={Screens.SubjectNotes}
        component={SubjectNotesScreen}
      />
      <Stack.Screen name={Screens.SubjectPYQs} component={SubjectPYQsScreen} />
      <Stack.Screen name={Screens.PdfViewer} component={PdfViewerScreen} />

      <Stack.Screen
        name={Screens.SubjectAssignments}
        component={SubjectAssignmentsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.AssignmentSubmissions}
        component={AssignmentSubmissionsScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export const SignedOutNavigation: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Screens.Splash}
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
      <Stack.Screen
        name={Screens.ForgotPassword}
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
