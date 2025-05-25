import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useCallback, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../store/contexts/AuthContext';
import Toast from '../components/Toast';
import {useRefresh} from '../utils/useRefresh';

export const NotesScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user, isLoading} = useAuth();
  const subjects = user?.associations.subjects;

  const [refreshing, setRefreshing] = useState(false);
  const {refreshUserProfile} = useRefresh();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserProfile({showToast: false});
      Toast.success('Profile refreshed');
    } catch (error) {
      Toast.error('Failed to refresh profile');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUserProfile]);

  const handleSubjectPress = subject => {
    navigation.navigate(Screens.SubjectNotes, {
      subject,
    });
  };

  return (
    <CustomSafeAreaView
      navigation={navigation as any}
      contentContainerStyle={{flex: 1, gap: 10}}>
      <TabHeader
        title="My Subjects"
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading subjects...</Text>
        </View>
      ) : !subjects || subjects.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No subjects found</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          renderItem={({item}) => (
            <SubjectCard
              key={item._id}
              name={item.name}
              code={item.code}
              onPress={() => handleSubjectPress(item)}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </CustomSafeAreaView>
  );
};

type SubjectCardProps = {
  name: string;
  code: string;
  onPress: () => void;
};

const SubjectCard: FC<SubjectCardProps> = ({name, code, onPress}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 2,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    code: {
      fontSize: 14,
      color: Colors.gray,
    },
    icon: {
      backgroundColor: Colors.lightGray,
      padding: 10,
      borderRadius: 50,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.code}>{code}</Text>
      </View>
      <View style={styles.icon}>
        <MaterialIcon name="arrow-forward" size={24} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};
