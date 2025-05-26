import {pick, types} from '@react-native-documents/picker';
import {useNavigation} from '@react-navigation/native';
import {FC, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomSafeAreaView,
  Divider,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useAuth} from '../store/contexts/AuthContext';

export const StudentProfileScreen: FC = () => {
  const {user, logout} = useAuth();

  const navigation = useNavigation();

  // states
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>(
    '../assets/images/uniconnect_logo.png',
  );

  // function to change image
  const handleChangeImage = async () => {
    try {
      const [pickResult] = await pick({
        type: types.images,
      });
      setImageUri(decodeURI(pickResult.uri));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Show success message
      Alert.alert('Success', 'Logged out successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate(Screens.Login as never),
        },
      ]);
    } catch (error: any) {
      // Show error message
      const errorMessage = error.response?.data?.message || 'Failed to logout';
      Alert.alert('Error', errorMessage, [{text: 'OK'}]);
    }
  };

  const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      width: '95%',
      padding: 20,
      alignSelf: 'center',
    },
    imageContainer: {
      width: 125,
      aspectRatio: 1,
      borderRadius: 100,
      marginBottom: 10,
      borderWidth: 3,
      borderColor: Colors.primary,
      position: 'relative',
    },
    image: {
      borderRadius: 100,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    chooseImage: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: Colors.white,
      borderRadius: 100,
      padding: 5,
      elevation: 3,
    },
    headerText: {
      fontSize: 27,
      fontWeight: 'bold',
      color: Colors.primary,
    },
    personalDetailsContainer: {
      width: '90%',
      padding: 20,
      backgroundColor: Colors.white,
      borderRadius: 10,
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 3,
      alignSelf: 'center',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    detailItemContents: {
      flex: 1,
    },
    detailItemTitle: {
      fontSize: 12,
      color: Colors.muted,
    },
    detailItemValue: {
      fontSize: 16,
      color: Colors.black,
      fontWeight: 'bold',
    },
    detailItemIcon: {
      padding: 5,
      backgroundColor: Colors.light,
      borderRadius: 5,
    },
    actionButtons: {
      width: '90%',
      gap: 10,
      alignItems: 'center',
      marginVertical: 20,
      alignSelf: 'center',
    },
  });

  return (
    <CustomSafeAreaView
      navigation={navigation as any}
      contentContainerStyle={{
        flex: 1,
      }}
      tabHeader="Profile">
      <ScrollView style={{width: '100%'}}>
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={
                imageUri === '../assets/images/uniconnect_logo.png'
                  ? require('../assets/images/uniconnect_logo.png')
                  : {uri: imageUri}
              }
            />
            <TouchableHighlight
              style={styles.chooseImage}
              onPress={handleChangeImage}>
              <MaterialIcon name="camera" size={20} color={Colors.info} />
            </TouchableHighlight>
          </View>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        <View style={styles.personalDetailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Full Name</Text>
              <TextInput
                style={styles.detailItemValue}
                value={user?.fullName}
                editable={false}
              />
            </View>
            <TouchableOpacity style={styles.detailItemIcon}>
              <MaterialIcon name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Email Address</Text>
              <TextInput
                style={styles.detailItemValue}
                value={user?.email}
                editable={false}
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity style={styles.detailItemIcon}>
              <MaterialIcon name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Mobile Number</Text>
              <TextInput
                style={styles.detailItemValue}
                value={`+91 ${user?.phoneNumber}`}
                editable={false}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity style={styles.detailItemIcon}>
              <MaterialIcon name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.personalDetailsContainer}>
          <Text style={styles.headerText}>Academic Information</Text>
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Roll Number</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value={user?.rollNumber}
              />
            </View>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Session</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value={user?.associations.sessions[0].name}
              />
            </View>
          </View>
          <Divider />
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Course</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value={user?.associations.courses[0].name}
              />
            </View>
          </View>
          <Divider />
          <View style={styles.detailItem}>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Semester</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value={user?.associations.semesters[0].semesterName}
              />
            </View>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Section</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value="A"
              />
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <CustomButton
            title="Save Changes"
            onPress={() => navigation.navigate(Screens.Login as never)}
            disabled={!isDataChanged}
            backgroundColor={isDataChanged ? Colors.green : Colors.muted}
          />
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            backgroundColor={Colors.secondary}
          />

          <Text style={{color: Colors.muted, fontStyle: 'italic'}}>
            Last Updated : 12/12/2021
          </Text>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
