import {FC} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomSafeAreaView,
  TabHeader,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useGetAssignmentSubmissions} from '../store/apis/assignments';
import {downloadFile} from '../utils/fileUtils';
import Toast from '../components/Toast';

export const AssignmentSubmissionsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {assignment, subjectName} = route.params;
  const {data: submissions, isLoading} = useGetAssignmentSubmissions(assignment._id);

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader
        title={`Submissions: ${assignment.title}`}
        subtitle={subjectName}
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading submissions...</Text>
        </View>
      ) : submissions?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No submissions found for this assignment</Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          renderItem={({item}) => (
            <SubmissionCard
              studentName={item.student?.fullName || 'Student'}
              submittedDate={new Date(item.createdAt).toLocaleDateString()}
              fileUrl={item.fileUrl}
              navigation={navigation}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
        />
      )}
    </CustomSafeAreaView>
  );
};

type SubmissionCardProps = {
  studentName: string;
  submittedDate: string;
  fileUrl: string;
  navigation: any;
};

const SubmissionCard: FC<SubmissionCardProps> = ({
  studentName,
  submittedDate,
  fileUrl,
  navigation,
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 15,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    info: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    date: {
      color: Colors.gray,
    },
    viewBtn: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      backgroundColor: Colors.green,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    viewText: {
      color: Colors.white,
    },
  });

  const handleViewSubmission = async () => {
    if (!fileUrl) {
      Toast.error('File URL not available');
      return;
    }

    Toast.info('Preparing document...');
    const result = await downloadFile(fileUrl, `${studentName}_submission`);

    if (result.success) {
      navigation.navigate(Screens.PdfViewer as never, {
        uri: result.filePath,
        title: `${studentName}'s Submission`,
      } as never);
    } else {
      Toast.error('Failed to open document');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{studentName}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.date}>Submitted: {submittedDate}</Text>
        <TouchableOpacity style={styles.viewBtn} onPress={handleViewSubmission}>
          <Text style={styles.viewText}>View</Text>
          <MaterialIcon name="visibility" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
