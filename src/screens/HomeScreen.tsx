// src/screens/HomeScreen.js with pull-to-refresh functionality
import {useNavigation} from '@react-navigation/native';
import {FC, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
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
import {useRefresh} from '../utils/useRefresh';
import Toast from '../components/Toast';
import {formatNotificationTime} from '../utils/helper';

export const HomeScreen: FC = () => {
  const {user, isLoading} = useAuth();
  const {colors, theme} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const {refreshAllData} = useRefresh();

  const [assignmentData, setAssignmentData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [pyqData, setPyqData] = useState([]);
  console.log(user);

  useEffect(() => {
    const {assignments, notes, pyqs} = user?.teachingAssignments;
    if (assignments) {
      setAssignmentData(assignments);
    }
    if (notes) {
      setNoteData(notes);
    }
    if (pyqs) {
      setPyqData(pyqs);
    }
  }, [user]);

  const sections = [
    {
      title: 'Recent Assignments',
      link: 'View All',
      data: assignmentData.map(assignment => {
        return {
          title: assignment.title,
          subtitle: `Due Date: ${formatNotificationTime(assignment.dueDate)}`,
          icon: 'assignment',
          status: assignment.status,
        };
      }),
      handleClick: () => {
        navigation.navigate(Screens.Assignments as never);
      },
    },
    {
      title: 'Recent Notes',
      link: 'View All',
      data: noteData.map(note => {
        return {
          title: note.title,
          subtitle: `Subject: ${note.subject.name} ${note.subject.code}`,
          icon: 'description',
        };
      }),
      handleClick: () => {
        navigation.navigate(Screens.Notes as never);
      },
    },
    {
      title: 'Recent PYQs',
      link: 'View All',
      data: pyqData.map(pyq => {
        return {
          title: pyq.title,
          subtitle: `Subject: ${pyq.subject.name} ${pyq.subject.code}`,
          icon: 'book',
        };
      }),
      handleClick: () => {
        navigation.navigate(Screens.PYQs as never);
      },
    },
  ];

  const navigation = useNavigation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      refreshAllData({showToast: false});
      Toast.success('Data refreshed successfully');
    } catch (error) {
      Toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAllData]);

  const renderSection = ({item}: {item: (typeof sections)[0]}) => (
    <CustomSection
      title={item.title}
      link={item.link}
      handleClick={item.handleClick}>
      <FlatList
        data={item.data}
        renderItem={({item: sectionItem}) => (
          <CustomSectionItems
            itemIcon={sectionItem.icon}
            itemTitle={sectionItem.title}
            itemSubtitle={sectionItem.subtitle}
            itemStatus={sectionItem.status}
            itemStatusBorderRadius={50}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{alignItems: 'center'}}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
            }}>
            <Text style={{color: colors.textSecondary}}>No data found</Text>
          </View>
        }
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
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
      color: colors.card,
    },
    textSubtitle: {
      fontSize: 18,
      color: colors.card,
    },
    iconContainer: {
      padding: 10,
      backgroundColor: colors.card,
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
