import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomSafeAreaView,
  CustomSection,
  CustomSectionItems,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  NavigationAction,
  NavigationState,
  useNavigation,
} from '@react-navigation/native';

export const HomeScreen: FC = () => {
  const sectionItems = [1, 2, 3];

  const navigation = useNavigation();

  return (
    <CustomSafeAreaView
      tabBarHeight={useBottomTabBarHeight()}
      containerStyle={{flex: 1}}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        padding: 0,
        flex: 0,
      }}>
      <Header navigation={navigation} />

      <CustomSection title="Recent Assignments" link="View All">
        {sectionItems.map(sectionItem => (
          <CustomSectionItems
            itemIcon="note"
            itemTitle="Assignment 1"
            itemSubtitle="Due Date: 12/12/2021"
            itemStatus="Completed"
            itemStatusBorderRadius={20}
          />
        ))}
      </CustomSection>
      <CustomSection title="Recent Notes" link="View All">
        {sectionItems.map(sectionItem => (
          <CustomSectionItems
            itemIcon="note"
            itemTitle="Assignment 1"
            itemSubtitle="Due Date: 12/12/2021"
            itemStatus="In Progress"
            itemStatusBorderRadius={20}
          />
        ))}
      </CustomSection>
      <CustomSection title="Recent PYQs" link="View All">
        {sectionItems.map(sectionItem => (
          <CustomSectionItems
            itemIcon="note"
            itemTitle="Assignment 1"
            itemSubtitle="Due Date: 12/12/2021"
            itemStatus="In Progress"
            itemStatusBorderRadius={20}
          />
        ))}
      </CustomSection>
    </CustomSafeAreaView>
  );
};

const Header: FC<{navigation: any}> = ({navigation}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      width: '100%',
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    headerItemsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
    },
    textTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      color: Colors.white,
    },
    textSubtitle: {
      fontSize: 18,
      color: Colors.white,
    },
    iconContainer: {
      padding: 10,
      backgroundColor: Colors.white,
      borderRadius: 100,
      elevation: 5,
    },
  });

  return (
    <LinearGradient
      colors={[Colors.info, Colors.primary]}
      angle={135}
      useAngle={true}
      style={styles.container}>
      <View style={styles.headerItemsContainer}>
        <View>
          <Text style={styles.textTitle}>Hello, Student</Text>
          <Text style={styles.textSubtitle}>
            Welcome back to your dashboard
          </Text>
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate(Screens.Notifications as never)}>
          <MaterialIcon name="notifications" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
