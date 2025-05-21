import {DocumentPickerResponse} from '@react-native-documents/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
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
  useGetAssignmentSolutions,
  useUploadAssignmentSolution,
} from '../store/apis/assignments';
import Toast from '../components/Toast';
import {assignmentUploadSchema, solutionUploadSchema} from '../schemas/assignmentSchema';
import * as yup from 'yup';
import {downloadFile} from '../utils/fileUtils';

export const SubjectAssignmentsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {subject} = route.params;
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {data: assignments, isLoading, refetch} = useGetAssignments(subject._id);
  const {mutate: deleteAssignment} = useDeleteAssignment();
  const isFaculty = user?.role === 'faculty';

  const handleDeleteAssignment = (assignmentId: string) => {
    deleteAssignment(
      {assignmentId},
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
              uploadedDate={new Date(item.createdAt).toLocaleDateString()}
              facultyName={item.assignedBy?.fullName || 'Faculty'}
              fileUrl={item.fileUrl}
              navigation={navigation}
              canDelete={isFaculty}
              assignmentId={item._id}
              onDelete={() => handleDeleteAssignment(item._id)}
              isFaculty={isFaculty}
              subjectId={subject._id}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
        />
      )}

      {isFaculty && (
        <UploadResourceBtn handleUploadClick={() => setModalVisible(true)} />
      )}

      <UploadModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        subjectId={subject._id}
      />
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
  assignmentId: string;
  onDelete?: () => void;
  isFaculty: boolean;
  subjectId: string;
};

const AssignmentCard: FC<AssignmentCardProps> = ({
  title,
  dueDate,
  uploadedDate,
  facultyName,
  fileUrl,
  navigation,
  canDelete,
  assignmentId,
  onDelete,
  isFaculty,
  subjectId,
}) => {
  const [solutionModalVisible, setSolutionModalVisible] = useState<boolean>(false);
  const [viewSolutionsModalVisible, setViewSolutionsModalVisible] = useState<boolean>(false);
  
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
      flex: 1,
      marginRight: 10,
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
    solutionBtn: {
      backgroundColor: Colors.blue,
    },
    viewSolutionsBtn: {
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
      navigation.navigate(Screens.PdfViewer, {
        uri: result.filePath,
        title,
      });
    } else {
      Toast.error('Failed to open document');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Assignment', 'Are you sure you want to delete this assignment?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onDelete,
        style: 'destructive',
      },
    ]);
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
            <TouchableOpacity style={[styles.actionButton, styles.deleteBtn]} onPress={handleDelete}>
              <MaterialIcon name="delete" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={[styles.actionButton, styles.downloadBtn]} onPress={handleViewPdf}>
            <Text style={styles.actionText}>View</Text>
            <MaterialIcon name="visibility" size={20} color={Colors.white} />
          </TouchableOpacity>
          
          {isFaculty ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewSolutionsBtn]} 
              onPress={() => setViewSolutionsModalVisible(true)}>
              <Text style={styles.actionText}>Solutions</Text>
              <MaterialIcon name="list" size={20} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.solutionBtn]} 
              onPress={() => setSolutionModalVisible(true)}>
              <Text style={styles.actionText}>Submit</Text>
              <MaterialIcon name="upload-file" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Solution Upload Modal for Students */}
      <SolutionUploadModal
        modalVisible={solutionModalVisible}
        setModalVisible={setSolutionModalVisible}
        assignmentId={assignmentId}
        subjectId={subjectId}
      />
      
      {/* View Solutions Modal for Faculty */}
      <ViewSolutionsModal
        modalVisible={viewSolutionsModalVisible}
        setModalVisible={setViewSolutionsModalVisible}
        assignmentId={assignmentId}
        assignmentTitle={title}
      />
    </View>
  );
};

type UploadModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  subjectId: string;
};

const UploadModal: FC<UploadModalProps> = ({
  modalVisible,
  setModalVisible,
  subjectId,
}) => {
  const [title, setTitle] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {mutate: uploadAssignment} = useUploadAssignment();

  const scrollViewRef = useRef<ScrollView>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleInputFocus = (inputName: string, y: number) => {
    setFocusedInput(inputName);
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true,
    });
  };

  const handleUpload = () => {
    try {
      // Validate form data
      assignmentUploadSchema.validateSync({
        title,
        dueDate,
        file,
      });

      setIsUploading(true);
      uploadAssignment(
        {
          file: {
            uri: file!.uri,
            type: file!.type,
            name: file!.name,
          },
          title,
          dueDate,
          subjectId,
        },
        {
          onSuccess: () => {
            setIsUploading(false);
            setModalVisible(false);
            Toast.success('Assignment uploaded successfully');
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
      if (error instanceof yup.ValidationError) {
        Alert.alert('Validation Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
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
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Upload Assignment
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
            
            <CustomInput
              label="Due Date (YYYY-MM-DD)"
              placeholder="Enter Due Date"
              backgroundColor={Colors.light}
              boxPadding={5}
              value={dueDate}
              onChangeText={setDueDate}
              onInputFocus={() => handleInputFocus('dueDate', 60)}
              onBlur={() => setFocusedInput(null)}
            />

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
                  title={isUploading ? 'Uploading...' : 'Upload Assignment'}
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

type SolutionUploadModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  assignmentId: string;
  subjectId: string;
};

const SolutionUploadModal: FC<SolutionUploadModalProps> = ({
  modalVisible,
  setModalVisible,
  assignmentId,
  subjectId,
}) => {
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {mutate: uploadSolution} = useUploadAssignmentSolution();

  const handleUpload = () => {
    try {
      // Validate form data
      solutionUploadSchema.validateSync({
        file,
      });

      setIsUploading(true);
      uploadSolution(
        {
          file: {
            uri: file!.uri,
            type: file!.type,
            name: file!.name,
          },
          assignmentId,
          subjectId,
        },
        {
          onSuccess: () => {
            setIsUploading(false);
            setModalVisible(false);
            Toast.success('Solution uploaded successfully');
            setFile(undefined);
          },
          onError: error => {
            setIsUploading(false);
            Toast.error('Failed to upload solution');
            console.error('Upload error:', error);
          },
        },
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        Alert.alert('Validation Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
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
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Submit Assignment Solution
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

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={{marginBottom: 15}}>
              Upload your solution file for this assignment.
            </Text>
            
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                width={'45%'}
                backgroundColor={Colors.danger}
              />

              {file ? (
                <CustomButton
                  title={isUploading ? 'Uploading...' : 'Submit Solution'}
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
          </View>
        </View>
      </View>
    </Modal>
  );
};

type ViewSolutionsModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  assignmentId: string;
  assignmentTitle: string;
};

const ViewSolutionsModal: FC<ViewSolutionsModalProps> = ({
  modalVisible,
  setModalVisible,
  assignmentId,
  assignmentTitle,
}) => {
  const navigation = useNavigation();
  const {data: solutions, isLoading} = useGetAssignmentSolutions(assignmentId);

  const handleViewSolution = async (solution: any) => {
    if (!solution.fileUrl) {
      Alert.alert('Error', 'File URL not available');
      return;
    }

    Toast.info('Preparing document...');
    const result = await downloadFile(solution.fileUrl, `${solution.student?.fullName}-solution`);

    if (result.success) {
      navigation.navigate(Screens.PdfViewer, {
        uri: result.filePath,
        title: `${solution.student?.fullName}'s Solution`,
      });
    } else {
      Toast.error('Failed to open document');
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
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    solutionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
    },
    studentInfo: {
      flex: 1,
    },
    studentName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    submissionDate: {
      color: Colors.gray,
      fontSize: 12,
    },
    viewButton: {
      backgroundColor: Colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    viewButtonText: {
      color: Colors.white,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: Colors.gray,
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
          <View style={styles.header}>
            <Text style={styles.title}>Solutions for {assignmentTitle}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          
          <Divider />
          
          {isLoading ? (
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text>Loading solutions...</Text>
            </View>
          ) : solutions?.length === 0 ? (
            <Text style={styles.emptyText}>No solutions submitted yet</Text>
          ) : (
            <FlatList
              data={solutions}
              renderItem={({item}) => (
                <View style={styles.solutionItem}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.student?.fullName}</Text>
                    <Text style={styles.submissionDate}>
                      Submitted: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleViewSolution(item)}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item._id}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
