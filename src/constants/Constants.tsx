// Constants.tsx
export const Colors = Object.freeze({
  primary: '#00489c',
  secondary: '#FF8C00',
  success: '#32CD32',
  danger: '#DC143C',
  warning: '#FFD700',
  info: '#00BFFF',
  light: '#f1f4f8',
  dark: '#333333',
  muted: '#6C757D',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
  green: '#09b12d',
  gray: '#aaa',
  lightGray: '#e5e5e5',

  darkPrimary: '#001f4d',
  darkSecondary: '#FF6600',
  darkSuccess: '#228B22',
  darkDanger: '#8B0000',
  darkWarning: '#FFA500',
  darkInfo: '#1E90FF',
  darkLight: '#d9d9d9',
  darkMuted: '#808080',
  darkWhite: '#f2f2f2',
  darkBlack: '#666666',
  darkTransparent: 'rgba(0, 0, 0, 0.5)',
  darkCurrent: 'currentColor',
  darkGreen: '#008000',
  darkGray: '#808080',
  darkLightGray: '#d3d3d3',
});

export const Screens = Object.freeze({
  Splash: 'SplashScreen',
  Landing: 'LandingScreen',
  Login: 'LoginScreen',
  Option: 'OptionScreen',
  StudentRegister: 'StudentRegisterScreen',
  FacultyRegister: 'FacultyRegisterScreen',
  ForgotPassword: 'ForgotPasswordScreen',
  Home: 'Home',
  Notes: 'Notes',
  PYQs: 'PYQs',
  Assignments: 'Assignments',
  Profile: 'Profile',
  Notifications: 'Notifications',
  AssignmentSubmit: 'AssignmentSubmitScreen',
  SubjectNotes: 'SubjectNotes',
  SubjectPYQs: 'SubjectPYQsScreen',
  PdfViewer: 'PdfViewer',
});

export enum AdminScreens {
  Dashboard = 'Dashboard',
  Users = 'Users',
  Assignments = 'Assignments',
  Notifications = 'Notifications',
  Settings = 'Settings',
}

export enum NotificationStates {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

//TODO - Replace with production api url
export const BASE_URL = 'http://10.0.2.2:8000/api/v1';
