import {DocumentPickerResponse} from '@react-native-documents/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
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
  useGetResource,
  useUploadResource,
  useDeleteResource,
} from '../store/apis/resources';
import Toast from '../components/Toast';
import {resourceUploadSchema} from '../schemas/resourceSchema';
import * as yup from 'yup';
import {downloadFile} from '../utils/fileUtils';

export const SubjectPYQsScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {subject} = route.params;
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    data: pyqs,
    isLoading,
    refetch,
  } = useGetResource(
    subject._id,
    'pyq',
    user?.role === 'faculty' ? subject.faculty._id : undefined,
  );
  const {mutate: deletePYQ} = useDeleteResource();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const handleDeletePYQ = (pyqId: string) => {
    deletePYQ(
      {resourceId: pyqId},
      {
        onSuccess: () => {
          Toast.success('PYQ deleted successfully');
          refetch(); // Refresh the pyqs list
        },
        onError: error => {
          Toast.error('Failed to delete PYQ');
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
        title={`${subject.name} PYQs`}
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading PYQs...</Text>
        </View>
      ) : pyqs?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No PYQs found for this subject</Text>
        </View>
      ) : (
        <FlatList
          data={pyqs}
          renderItem={({item}) => (
            <PYQCard
              title={item.title}
              year={item.year || 'N/A'}
              uploadedDate={new Date(item.createdAt).toLocaleDateString()}
              facultyName={item.uploadedBy?.fullName || 'Faculty'}
              fileUrl={item.fileUrl}
              navigation={navigation}
              canDelete={user?.role === 'faculty'}
              pyqId={item._id}
              onDelete={() => handleDeletePYQ(item._id)}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
    </CustomSafeAreaView>
  );
};

type PYQCardProps = {
  title: string;
  year: string;
  uploadedDate: string;
  facultyName: string;
  fileUrl: string;
  navigation: any;
  canDelete?: boolean;
  pyqId?: string;
  onDelete?: () => void;
};

const PYQCard: FC<PYQCardProps> = ({
  title,
  year,
  uploadedDate,
  facultyName,
  fileUrl,
  navigation,
  canDelete,
  pyqId,
  onDelete,
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
    year: {
      color: Colors.primary,
      fontWeight: 'bold',
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    download: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      backgroundColor: Colors.green,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    downloadText: {
      color: Colors.white,
    },
    deleteBtn: {
      backgroundColor: Colors.danger,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
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
    Alert.alert('Delete PYQ', 'Are you sure you want to delete this PYQ?', [
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
          <MaterialIcon name="quiz" size={24} color={Colors.white} />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.year}>Year: {year}</Text>
          <Text style={styles.date}>Uploaded: {uploadedDate}</Text>
          <Text style={styles.faculty}>Faculty: {facultyName}</Text>
        </View>
        <View style={styles.actions}>
          {canDelete && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <MaterialIcon name="delete" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.download} onPress={handleViewPdf}>
            <Text style={styles.downloadText}>Download</Text>
            <MaterialIcon name="download" size={20} color={Colors.white} />
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
  const [year, setYear] = useState<string>('');
  const [file, setFile] = useState<DocumentPickerResponse | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {mutate: uploadPYQ} = useUploadResource();

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

  const handleUpload = () => {
    try {
      // Validate form data with Yup
      resourceUploadSchema.validateSync({
        title,
        subject: subjectId,
        file,
        type: 'pyq',
        year,
      });

      setIsUploading(true);
      uploadPYQ(
        {
          file: {
            uri: file!.uri,
            type: file!.type,
            name: file!.name,
          },
          title,
          subjectId,
          type: 'pyq',
          year,
        },
        {
          onSuccess: () => {
            refetch();
            setIsUploading(false);
            setModalVisible(false);
            Toast.success('PYQ uploaded successfully');
            // Reset form
            setTitle('');
            setYear('');
            setFile(undefined);
          },
          onError: error => {
            setIsUploading(false);
            Toast.error('Failed to upload PYQ');
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
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Upload PYQ</Text>
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
              label="PYQ Title"
              placeholder="Enter PYQ Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              value={title}
              onChangeText={setTitle}
              onInputFocus={() => handleInputFocus('title', 0)}
              onBlur={() => setFocusedInput(null)}
            />

            <CustomInput
              label="Year"
              placeholder="Enter Year (e.g., 2023)"
              backgroundColor={Colors.light}
              boxPadding={5}
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              onInputFocus={() => handleInputFocus('year', 60)}
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
                  title={isUploading ? 'Uploading...' : 'Upload PYQ'}
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
