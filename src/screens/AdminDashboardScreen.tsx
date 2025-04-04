import {Assignments} from '../components/AdminComponents/Assignments';
import {Dashboard} from '../components/AdminComponents/Dashboard';
import {Notifications} from '../components/AdminComponents/Notifications';
import {Users} from '../components/AdminComponents/Users';

import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AdminScreens, Colors} from '../constants/Constants';

// Define types for menu items
type MenuItem = {
  id: AdminScreens;
  icon: string;
  label: string;
  component: ReactNode;
};

// Define menu items configuration
const MENU_ITEMS: MenuItem[] = [
  {
    id: AdminScreens.Dashboard,
    icon: 'dashboard',
    label: 'Dashboard',
    component: <Dashboard />,
  },
  {
    id: AdminScreens.Users,
    icon: 'people',
    label: 'Users',
    component: <Users />,
  },
  {
    id: AdminScreens.Assignments,
    icon: 'assignment',
    label: 'Assignments',
    component: <Assignments />,
  },
  {
    id: AdminScreens.Notifications,
    icon: 'notifications',
    label: 'Notifications',
    component: <Notifications />,
  },
];

export const AdminDashboardScreen: FC = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<AdminScreens>(
    AdminScreens.Dashboard,
  );

  const toggleSidebar = useCallback(() => {
    setOpenSidebar(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      {openSidebar && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={0}
            onPress={() => setOpenSidebar(false)}
          />
          <AdminSidebar
            setOpenSidebar={setOpenSidebar}
            selectedMenuItem={selectedMenuItem}
            setSelectedMenuItem={setSelectedMenuItem}
          />
        </>
      )}
      {MENU_ITEMS.find(item => item.id === selectedMenuItem)?.component}
    </SafeAreaView>
  );
};

type AdminHeaderProps = {
  openSidebar: boolean;
  toggleSidebar: () => void;
};

const AdminHeader: FC<AdminHeaderProps> = ({openSidebar, toggleSidebar}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={toggleSidebar}>
        <MaterialIcons name="menu" size={24} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Admin Dashboard</Text>
    </View>
  );
};

type AdminSidebarProps = {
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  selectedMenuItem: AdminScreens;
  setSelectedMenuItem: Dispatch<SetStateAction<AdminScreens>>;
};

const AdminSidebar: FC<AdminSidebarProps> = ({
  setOpenSidebar,
  selectedMenuItem,
  setSelectedMenuItem,
}) => {
  const handleSelect = useCallback(
    (menuId: AdminScreens) => {
      setSelectedMenuItem(menuId);
      setOpenSidebar(false);
    },
    [setSelectedMenuItem, setOpenSidebar],
  );

  return (
    <View style={styles.sidebarContainer}>
      {MENU_ITEMS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.sidebarItem,
            selectedMenuItem === item.id && styles.selectedItem,
          ]}
          onPress={() => handleSelect(item.id)}
          onBlur={() => setOpenSidebar(false)}>
          <MaterialIcons name={item.icon} size={24} color={Colors.white} />
          <Text style={styles.sidebarItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 20,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 24, // To offset the menu icon and center the text
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 110,
    backgroundColor: Colors.primary,
    padding: 20,
    width: 200,
    zIndex: 10,
    borderRadius: 8,
    shadowColor: Colors.black, // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
  },
  selectedItem: {
    backgroundColor: `${Colors.white}20`, // 20% white opacity
  },
  sidebarItemText: {
    color: Colors.white,
    marginLeft: 12,
    fontSize: 16,
  },
});
