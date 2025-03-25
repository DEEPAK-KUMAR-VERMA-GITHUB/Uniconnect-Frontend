import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Screens} from '../constants/Constants';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.light,
    rowGap: 30,
  },
  textTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 50,
  },
  textSubTitle: {
    fontSize: 14,
    color: Colors.dark,
  },
  cardBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    textAlign: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: '#24273a',
    marginTop: 10,
    textAlign: 'center',
  },
  cardButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    alignItems: 'center',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export const OptionScreen: FC = () => {
  const navigator = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textTitle}>Choose Your Role</Text>
      <Text style={styles.textSubTitle}>
        Select how you want to register with our platform
      </Text>
      <CardBox
        iconName="school"
        iconColor={Colors.primary}
        cardTitle="Faculty"
        cardSubTitle="Register as a teacher, professor, or educational staff member"
        buttonText="Continue As Faculty"
        buttonColor={Colors.primary}
        titleColor={Colors.primary}
        onBtnPress={() => navigator.navigate(Screens.FacultyRegister as never)}
      />

      <CardBox
        iconName="account-circle"
        iconColor={Colors.green}
        cardTitle="Student"
        cardSubTitle="Register as a student to access courses and learning materials"
        buttonText="Continue As Student"
        buttonColor={Colors.green}
        titleColor={Colors.primary}
        onBtnPress={() => navigator.navigate(Screens.StudentRegister as never)}
      />

      <View style={{flexDirection: 'row', columnGap: 5}}>
        <Text>Already have an account ? </Text>
        <TouchableOpacity
          onPress={() => navigator.navigate(Screens.Login as never)}>
          <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

type CardBoxProps = {
  iconName: string;
  iconColor: string;
  cardTitle: string;
  cardSubTitle: string;
  buttonText: string;
  buttonColor: string;
  titleColor: string;
  onBtnPress: () => void;
};

const CardBox: FC<CardBoxProps> = ({
  iconName,
  iconColor,
  cardTitle,
  cardSubTitle,
  buttonText,
  buttonColor,
  titleColor,
  onBtnPress,
}) => (
  <View style={styles.cardBox}>
    <MaterialIcons name={iconName} size={50} color={iconColor} />
    <Text style={[styles.cardTitle, {color: titleColor}]}>{cardTitle}</Text>
    <Text style={styles.cardSubTitle}>{cardSubTitle}</Text>
    <TouchableOpacity onPress={onBtnPress}>
      <Text style={[styles.cardButton, {backgroundColor: buttonColor}]}>
        {' '}
        {buttonText}{' '}
      </Text>
    </TouchableOpacity>
  </View>
);
