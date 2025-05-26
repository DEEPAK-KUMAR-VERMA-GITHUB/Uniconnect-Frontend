import {DocumentPickerResponse} from '@react-native-documents/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  CustomInput,
  CustomSafeAreaView,
  Divider,
  TabHeader,
  UploaderButton,
  UploadResourceBtn,
} from '../components/GlobalComponents';
import {Colors, Screens} from '../constants/Constants';
import {useAuth} from '../store/contexts/AuthContext';
import {
  useGetAssignments,
  useUploadAssignment,
  useDeleteAssignment,
  useSubmitAssignmentSolution,
} from '../store/apis/assignments';
import Toast from '../components/Toast';
import {downloadFile} from '../utils/fileUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRefresh} from '../utils/useRefresh';

export const SubjectAssignmentsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {subject} = route.params;
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionModalVisible, setSubmissionModalVisible] =
    useState<boolean>(false);
  const {
    data: assignments,
    refetch,
    isLoading,
  } = useGetAssignments(
    subject._id,
    user?.role === 'faculty' ? subject.faculty._id : undefined,
  );

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

  const {mutate: deleteAssignment} = useDeleteAssignment();

  const handleDeleteAssignment = (assignmentId: string) => {
    deleteAssignment(
      {subjectId: subject._id, assignmentId},
      {
        onSuccess: () => {
          Toast.success('Assignment deleted successfully');
          refetch();
        },
        onError: error => {
          Toast.error('Failed to delete assignment');
          console.error('Delete error:', error);
        },
      },
    );
  };

  const handleSubmitSolution = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmissionModalVisible(true);
  };

  const handleViewSubmissions = (assignment: any) => {
    navigation.navigate(
      Screens.AssignmentSubmissions as never,
      {
        assignment,
        subjectName: subject.name,
      } as never,
    );
  };

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader
        title={`${subject.name} Assignments`}
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading assignments...</Text>
        </View>
      ) : assignments?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No assignments found for this subject</Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          renderItem={({item}) => (
            <AssignmentCard
              title={item.title}
              dueDate={new Date(item.dueDate).toLocaleDateString()}
              uploadedDate={new Date(item.assignedAt).toLocaleDateString()}
              facultyName={item.assignedBy?.fullName || 'Faculty'}
              fileUrl={item.file}
              navigation={navigation}
              canDelete={user?.role === 'faculty'}
              canSubmit={user?.role === 'student'}
              canViewSubmissions={user?.role === 'faculty'}
              assignmentId={item._id}
              onDelete={() => handleDeleteAssignment(item._id)}
              onSubmit={() => handleSubmitSolution(item)}
              onViewSubmissions={() => handleViewSubmissions(item)}
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

      {user?.role === 'faculty' && (
        <UploadResourceBtn handleUploadClick={() => setModalVisible(true)} />
      )}

      <UploadModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        subjectId={subject._id}
        refetch={refetch}
      />

      {selectedAssignment && (
        <SubmissionModal
          modalVisible={submissionModalVisible}
          setModalVisible={setSubmissionModalVisible}
          assignment={selectedAssignment}
        />
      )}
    </CustomSafeAreaView>
  );
};

type AssignmentCardProps = {
  title: string;
  dueDate: string;
  uploadedDate: string;
  facultyName: string;
  fileUrl: string;
  navigation: any;
  canDelete?: boolean;
  canSubmit?: boolean;
  canViewSubmissions?: boolean;
  assignmentId?: string;
  onDelete?: () => void;
  onSubmit?: () => void;
  onViewSubmissions?: () => void;
};

const AssignmentCard: FC<AssignmentCardProps> = ({
  title,
  dueDate,
  uploadedDate,
  facultyName,
  fileUrl,
  navigation,
  canDelete,
  canSubmit,
  canViewSubmissions,
  assignmentId,
  onDelete,
  onSubmit,
  onViewSubmissions,
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
      borderBottomColor: Colors.lightGray,
      borderBottomWidth: 1,
      paddingBottom: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    icon: {
      backgroundColor: Colors.primary,
      padding: 8,
      borderRadius: 50,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    info: {
      gap: 5,
    },
    date: {
      color: Colors.gray,
    },
    faculty: {
      color: Colors.gray,
    },
    dueDate: {
      color: Colors.danger,
      fontWeight: 'bold',
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    actionButton: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    downloadBtn: {
      backgroundColor: Colors.green,
    },
    submitBtn: {
      backgroundColor: Colors.blue,
    },
    viewBtn: {
      backgroundColor: Colors.purple,
    },
    deleteBtn: {
      backgroundColor: Colors.danger,
    },
    actionText: {
      color: Colors.white,
    },
  });

  const handleViewPdf = async () => {
    if (!fileUrl) {
      Alert.alert('Error', 'File URL not available');
      return;
    }

    Toast.info('Preparing document...');
    const result = await downloadFile(fileUrl, title);

    if (result.success) {
      navigation.navigate(
        Screens.PdfViewer as never,
        {
          uri: result.filePath,
          title,
        } as never,
      );
    } else {
      Toast.error('Failed to open document');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.icon}>
          <MaterialIcon name="assignment" size={24} color={Colors.white} />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.dueDate}>Due: {dueDate}</Text>
          <Text style={styles.date}>Uploaded: {uploadedDate}</Text>
          <Text style={styles.faculty}>Faculty: {facultyName}</Text>
        </View>
        <View style={styles.actions}>
          {canDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteBtn]}
              onPress={handleDelete}>
              <MaterialIcon name="delete" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canSubmit && (
            <TouchableOpacity
              style={[styles.actionButton, styles.submitBtn]}
              onPress={onSubmit}>
              <Text style={styles.actionText}>Submit</Text>
              <MaterialIcon
                name="upload-file"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}

          {canViewSubmissions && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewBtn]}
              onPress={onViewSubmissions}>
              <MaterialIcon name="list" size={20} color={Colors.black} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadBtn]}
            onPress={handleViewPdf}>
            <MaterialIcon name="visibility" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

type UploadModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  subjectId: string;
  refetch: any;
};

const UploadModal: FC<UploadModalProps> = ({
  modalVisible,
  setModalVisible,
  subjectId,
  refetch,
}) => {
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {mutate: uploadAssignment} = useUploadAssignment();
  const [dueDate, setDueDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // add ref for scrollview
  const scrollViewRef = useRef<ScrollView>(null);
  // Add state to track currently focused input
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Function to handle input focus
  const handleInputFocus = (inputName: string, y: number) => {
    setFocusedInput(inputName);
    // Scroll to the focused input if it's below keyboard
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true,
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date && event.type !== 'dismissed') {
      setSelectedDate(date);
      setDueDate(date.toISOString());
    }
  };

  const handleUpload = () => {
    try {
      if (!title) {
        Alert.alert('Error', 'Please enter a title');
        return;
      }

      if (!dueDate) {
        Alert.alert('Error', 'Please select a due date');
        return;
      }

      if (!file) {
        Alert.alert('Error', 'Please select a file');
        return;
      }

      setIsUploading(true);
      uploadAssignment(
        {
          file: {
            uri: file.uri,
            type: file.type,
            name: file.name,
          },
          title,
          subjectId,
          dueDate,
        },
        {
          onSuccess: () => {
            refetch();
            setIsUploading(false);
            setModalVisible(false);
            Toast.success('Assignment uploaded successfully');
            // Reset form
            setTitle('');
            setDueDate('');
            setFile(undefined);
          },
          onError: error => {
            setIsUploading(false);
            Toast.error('Failed to upload assignment');
            console.error('Upload error:', error);
          },
        },
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 27,
      alignItems: 'center',
      width: '90%',
      gap: 10,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Assign</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: Colors.lightGray,
              }}>
              <MaterialIcon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <Divider />

          <ScrollView
            ref={scrollViewRef}
            style={{width: '100%'}}
            showsHorizontalScrollIndicator={false}>
            <CustomInput
              label="Assignment Title"
              placeholder="Enter Assignment Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              value={title}
              onChangeText={setTitle}
              onInputFocus={() => handleInputFocus('title', 0)}
              onBlur={() => setFocusedInput(null)}
            />

            <View style={{width: '100%', marginBottom: 10}}>
              <Text style={{marginBottom: 5, fontWeight: '500'}}>Due Date</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light,
                  padding: 12,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setShowDatePicker(true)}>
                <Text>{dueDate || 'Select Due Date'}</Text>
                <MaterialIcon
                  name="calendar-today"
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              }}>
              <CustomButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                width={'45%'}
                backgroundColor={Colors.danger}
              />

              {file ? (
                <CustomButton
                  title={isUploading ? 'Uploading...' : 'Upload'}
                  onPress={handleUpload}
                  width={'45%'}
                  disabled={isUploading}
                />
              ) : (
                <UploaderButton
                  file={file}
                  setFile={setFile}
                  setModalVisible={setModalVisible}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

type SubmissionModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  assignment: any;
};

const SubmissionModal: FC<SubmissionModalProps> = ({
  modalVisible,
  setModalVisible,
  assignment,
}) => {
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {mutate: submitSolution} = useSubmitAssignmentSolution();

  const handleSubmit = () => {
    if (!file) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    setIsUploading(true);
    submitSolution(
      {
        file: {
          uri: file.uri,
          type: file.type,
          name: file.name,
        },
        assignmentId: assignment._id,
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          setModalVisible(false);
          Toast.success('Solution submitted successfully');
          setFile(undefined);
        },
        onError: error => {
          setIsUploading(false);
          Toast.error('Failed to submit solution');
          console.error('Upload error:', error);
        },
      },
    );
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 27,
      alignItems: 'center',
      width: '90%',
      gap: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Submit Solution
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: Colors.lightGray,
              }}>
              <MaterialIcon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <Divider />

          <Text style={styles.title}>Assignment: {assignment.title}</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 10,
            }}>
            <CustomButton
              title="Cancel"
              onPress={() => setModalVisible(false)}
              width={'45%'}
              backgroundColor={Colors.danger}
            />

            {file ? (
              <CustomButton
                title={isUploading ? 'Submitting...' : 'Submit'}
                onPress={handleSubmit}
                width={'45%'}
                disabled={isUploading}
              />
            ) : (
              <UploaderButton
                file={file}
                setFile={setFile}
                setModalVisible={setModalVisible}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
