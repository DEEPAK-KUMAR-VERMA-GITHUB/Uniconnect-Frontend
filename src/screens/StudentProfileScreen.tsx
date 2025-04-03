import {pick, types} from '@react-native-documents/picker';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {FC, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomSafeAreaView,
  Divider,
  TabHeader,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';

export const StudentProfileScreen: FC = () => {
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
                value="John Doe"
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
                value="johndoe@email.com"
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
                value="+91 9876543210"
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
                value="CS2023-0456"
              />
            </View>
            <View style={styles.detailItemContents}>
              <Text style={styles.detailItemTitle}>Session</Text>
              <TextInput
                style={styles.detailItemValue}
                editable={false}
                value="2023-2024"
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
                value="Computer Science & Engineering"
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
                value="4th Semester"
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
            onPress={() => navigation.navigate(Screens.Login as never)}
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
