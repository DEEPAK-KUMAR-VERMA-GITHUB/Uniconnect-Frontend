import {useNavigation} from '@react-navigation/native';
import {FC} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomSafeAreaView,
  CustomSection,
  CustomSectionItems,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useAuth, User} from '../store/contexts/AuthContext';
import {LoadingScreen} from './LoadingScreen';
import {useTheme} from '../store/contexts/ThemeContext';

export const HomeScreen: FC = () => {
  const {user, isLoading} = useAuth();
  const {colors, theme, toggleTheme} = useTheme();

  const sections = [
    {
      title: 'Recent Assignments',
      link: 'View All',
      data: [
        {
          title: 'Assignment 1',
          subtitle: 'Due Date: 12/12/2021',
          icon: 'assignment',
          status: 'In Progress',
        },
        {
          title: 'Assignment 2',
          subtitle: 'Due Date: 15/12/2021',
          icon: 'assignment',
          status: 'In Progress',
        },
        {
          title: 'Assignment 3',
          subtitle: 'Due Date: 18/12/2021',
          icon: 'assignment',
          status: 'In Progress',
        },
      ],
    },
    {
      title: 'Recent Notes',
      link: 'View All',
      data: [
        {
          title: 'Note 1',
          subtitle: 'Subject: Math',
          icon: 'description',
          status: 'N/A',
        },
        {
          title: 'Note 2',
          subtitle: 'Subject: Science',
          icon: 'description',
          status: 'N/A',
        },
        {
          title: 'Note 3',
          subtitle: 'Subject: History',
          icon: 'description',
          status: 'N/A',
        },
      ],
    },
    {
      title: 'Recent PYQs',
      link: 'View All',
      data: [
        {
          title: 'PYQ 2020',
          subtitle: 'Subject: Physics',
          icon: 'book',
          status: 'N/A',
        },
        {
          title: 'PYQ 2019',
          subtitle: 'Subject: Chemistry',
          icon: 'book',
          status: 'N/A',
        },
        {
          title: 'PYQ 2018',
          subtitle: 'Subject: Biology',
          icon: 'book',
          status: 'N/A',
        },
      ],
    },
  ];

  const navigation = useNavigation();

  const renderSection = ({item}: {item: (typeof sections)[0]}) => (
    <CustomSection title={item.title} link={item.link}>
      <FlatList
        data={item.data}
        renderItem={({item: sectionItem}) => (
          <CustomSectionItems
            itemIcon={sectionItem.icon}
            itemTitle={sectionItem.title}
            itemSubtitle={sectionItem.subtitle}
            itemStatus={sectionItem.status}
            itemStatusBorderRadius={20}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </CustomSection>
  );

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <CustomSafeAreaView
      containerStyle={{flex: 1}}
      contentContainerStyle={{
        padding: 0,
        alignContent: 'center',
        alignItems: 'center',
      }}
      navigation={navigation as any}>
      <Header navigation={navigation} user={user} />

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          alignItems: 'center',
          gap: 5,
          paddingBottom: 200,
          marginTop: 10,
        }}
      />
    </CustomSafeAreaView>
  );
};

const Header: FC<{navigation: any; user: User | null}> = ({
  navigation,
  user,
}) => {
  const {colors} = useTheme();
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
      color: colors.text,
    },
    textSubtitle: {
      fontSize: 18,
      color: colors.text,
    },
    iconContainer: {
      padding: 10,
      backgroundColor: colors.text,
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
          <Text style={styles.textTitle}>
            Hello, {user?.fullName.split(' ')[0]}
          </Text>
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
