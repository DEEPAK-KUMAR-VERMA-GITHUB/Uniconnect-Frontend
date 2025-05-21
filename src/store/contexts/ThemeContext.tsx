import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {Colors} from '../../constants/Constants';

// Define theme types
export type ThemeType = 'light' | 'dark';

//  theme object with all colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  muted: string;
  card: string;
  notification: string;
  green: string;
  gray: string;
  lightGray: string;
}

// Define light theme colors
export const lightTheme: ThemeColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  success: Colors.success,
  danger: Colors.danger,
  warning: Colors.warning,
  info: Colors.info,
  background: Colors.light,
  surface: Colors.white,
  text: Colors.dark,
  textSecondary: Colors.muted,
  border: Colors.lightGray,
  muted: Colors.muted,
  card: Colors.white,
  notification: Colors.danger,
  green: Colors.green,
  gray: Colors.gray,
  lightGray: Colors.lightGray,
};

// Define dark theme colors
export const darkTheme: ThemeColors = {
  primary: Colors.darkPrimary,
  secondary: Colors.darkSecondary,
  success: Colors.darkSuccess,
  danger: Colors.darkDanger,
  warning: Colors.darkWarning,
  info: Colors.darkInfo,
  background: Colors.black,
  surface: Colors.darkBlack,
  text: Colors.darkWhite,
  textSecondary: Colors.darkMuted,
  border: Colors.darkGray,
  muted: Colors.darkMuted,
  card: Colors.darkBlack,
  notification: Colors.darkDanger,
  green: Colors.darkGreen,
  gray: Colors.darkGray,
  lightGray: Colors.darkLightGray,
};

// Create theme context
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create theme provider
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();

  // Initialize theme state
  const [theme, setTheme] = useState<ThemeType>(
    deviceColorScheme === 'dark' ? 'dark' : 'light',
  );

  // Update theme when device theme changes
  useEffect(() => {
    if (deviceColorScheme) {
      setTheme(deviceColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [deviceColorScheme]);

  // Get current theme colors
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{theme, colors, toggleTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
