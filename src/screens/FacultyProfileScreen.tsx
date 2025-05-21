import React, {FC, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../store/contexts/AuthContext';
import {useTheme} from '../store/contexts/ThemeContext';
import {CustomButton} from '../components/GlobalComponents';
import Toast from '../components/Toast';
import {RootStackParamList} from '../navigation/types';
import {api} from '../store/apis/api';

interface Department {
  _id: string;
  name: string;
  code: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  course: Course;
  semester: {
    _id: string;
    name: string;
    number: number;
  };
}

const FacultyProfileScreen: FC = () => {
  const {user, logout, updateUser} = useAuth();
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    facultyId: user?.facultyId || '',
    designation: user?.designation || '',
  });

  console.log(user);

  const handleLogout = async () => {
    try {
      await logout();
      Toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.error('Failed to logout');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Only allow updating certain fields
      const updateData = {
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
      };

      const response = await api.put(`/users/${user?._id}`, updateData);

      if (response.data?.data) {
        updateUser(response.data.data);
        Toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form data
    setProfileData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      facultyId: user?.facultyId || '',
      designation: user?.designation || '',
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    // navigation.navigate('ChangePassword');
    Alert.alert(
      'Feature Coming Soon',
      'Change password functionality will be available soon.',
    );
  };

  // Create styles using theme colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: 60,
      paddingBottom: 20,
      alignItems: 'center',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    profileImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      elevation: 5,
      shadowColor: colors.lightGray,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    profileInitial: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colors.primary,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.surface,
      marginBottom: 5,
    },
    designation: {
      fontSize: 16,
      color: colors.surface,
      opacity: 0.8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
      marginTop: 10,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.lightGray,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    infoIcon: {
      marginRight: 10,
      color: colors.primary,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      width: 80,
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    input: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      padding: 0,
    },
    subjectCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      elevation: 2,
      shadowColor: colors.lightGray,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    subjectName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    subjectCode: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    courseInfo: {
      fontSize: 14,
      color: colors.primary,
      marginTop: 5,
    },
    semesterInfo: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
    logoutButton: {
      backgroundColor: colors.danger,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    logoutText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: 'bold',
    },
    noSubjectsText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
    },
  });

  // Get profile initial (first letter of name)
  const getProfileInitial = () => {
    return user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
      }>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {/* Replace with actual image if available */}
          <Text style={styles.profileInitial}>{getProfileInitial()}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.designation}>{user?.designation}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={24} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Name:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.fullName}
                onChangeText={text =>
                  setProfileData({...profileData, fullName: text})
                }
              />
            ) : (
              <Text style={styles.infoValue}>{user?.fullName}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phone:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.phoneNumber}
                onChangeText={text =>
                  setProfileData({...profileData, phoneNumber: text})
                }
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={24} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Faculty ID:</Text>
            <Text style={styles.infoValue}>{user?.facultyId}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="business" size={24} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>
              {user?.department.name || 'Loading...'}
            </Text>
          </View>

          {isEditing ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Save"
                onPress={handleSaveProfile}
                backgroundColor={colors.success}
                width="48%"
              />
              <CustomButton
                title="Cancel"
                onPress={handleCancelEdit}
                backgroundColor={colors.muted}
                width="48%"
              />
            </View>
          ) : (
            <CustomButton
              title="Edit Profile"
              onPress={handleEditProfile}
              backgroundColor={colors.primary}
            />
          )}

          <CustomButton
            title="Change Password"
            onPress={handleChangePassword}
            backgroundColor={colors.secondary}
            style={{marginTop: 10}}
          />
        </View>

        <Text style={styles.sectionTitle}>Teaching Subjects</Text>
        {user?.associations.subjects.length > 0 ? (
          user?.associations.subjects.map(subject => (
            <View key={subject._id} style={styles.subjectCard}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectCode}>Code: {subject.code}</Text>
              <Text style={styles.courseInfo}>
                Course: {subject.course.name} ({subject.course.code})
              </Text>
              <Text style={styles.semesterInfo}>
                Semester: {subject.semester.name}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSubjectsText}>No subjects assigned yet</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FacultyProfileScreen;
