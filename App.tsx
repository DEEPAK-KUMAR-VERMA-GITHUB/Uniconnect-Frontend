import {QueryClientProvider} from '@tanstack/react-query';
import React, {FC} from 'react';
import Toast from 'react-native-toast-message';
import {GlobalLoading} from './src/components/GlobalLoading';
import {SignedInNavigation, SignedOutNavigation} from './src/Navigation';
import {LoadingScreen} from './src/screens/LoadingScreen';
import {queryClient} from './src/store/apis/queryClient';
import {AuthProvider, useAuth} from './src/store/contexts/AuthContext';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {useTheme, ThemeProvider} from './src/store/contexts/ThemeContext';

const AppContent: FC = () => {
  const {theme, colors} = useTheme();
  const {user, isAuthenticated, isLoading} = useAuth();

  // Create navigation theme based on current app theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: theme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.notification,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isLoading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <SignedInNavigation />
      ) : (
        <SignedOutNavigation />
      )}
    </NavigationContainer>
  );
};

const App: FC = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

// Component that uses the theme
const ThemedApp: FC = () => {
  const {theme, colors} = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent
      />
      <AppContent />
      <GlobalLoading />
      <Toast />
    </>
  );
};

export default App;
