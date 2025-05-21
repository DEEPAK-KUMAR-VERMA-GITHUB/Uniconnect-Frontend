import {DocumentPickerResponse} from '@react-native-documents/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {QueryObserverResult} from '@tanstack/react-query';
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
import * as yup from 'yup';
import {
  CustomButton,
  CustomInput,
  CustomSafeAreaView,
  Divider,
  TabHeader,
  UploaderButton,
  UploadResourceBtn,
} from '../components/GlobalComponents';
import Toast from '../components/Toast';
import {Colors, Screens} from '../constants/Constants';
import {resourceUploadSchema} from '../schemas/resourceSchema';
import {
  useDeleteResource,
  useGetResource,
  useUploadResource,
} from '../store/apis/resources';
import {useAuth} from '../store/contexts/AuthContext';
import {downloadFile} from '../utils/fileUtils';

export const SubjectNotesScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {subject} = route.params;
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {data: notes, isLoading, refetch} = useGetResource(subject._id, 'note');
  const {mutate: deleteNote} = useDeleteResource();

  const handleDeleteNote = (noteId: string) => {
    deleteNote(
      {
        resourceId: noteId,
        subjectId: subject._id,
      },
      {
        onSuccess: () => {
          Toast.success('Note deleted successfully');
          refetch();
        },
        onError: error => {
          Toast.error('Error deleting note');
          console.error('Delete Error : ', error);
        },
      },
    );
  };

  return (
    <CustomSafeAreaView
      contentContainerStyle={{flex: 1, gap: 10}}
      navigation={navigation as any}>
      <TabHeader
        title={`${subject.name} Notes`}
        leftIconClick={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading notes...</Text>
        </View>
      ) : notes?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No notes found for this subject</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={({item}) => (
            <NoteCard
              title={item.title}
              uploadedDate={new Date(item.createdAt).toLocaleDateString()}
              facultyName={item.uploadedBy?.fullName || 'Faculty'}
              fileUrl={item.fileUrl}
              navigation={navigation}
              canDelete={user?.role === 'faculty' ? true : false}
              noteId={item.id}
              onDelete={() => handleDeleteNote(item._id)}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{padding: 10, gap: 10}}
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

type NoteCardProps = {
  title: string;
  uploadedDate: string;
  facultyName: string;
  fileUrl: string;
  navigation: any;
  canDelete?: boolean;
  noteId?: string;
  onDelete?: () => void;
};

const NoteCard: FC<NoteCardProps> = ({
  title,
  uploadedDate,
  facultyName,
  fileUrl,
  navigation,
  canDelete,
  noteId,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.icon}>
          <MaterialIcon name="description" size={24} color={Colors.white} />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.date}>Uploaded: {uploadedDate}</Text>
          <Text style={styles.faculty}>Faculty: {facultyName}</Text>
        </View>
        <View style={styles.actions}>
          {canDelete && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
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
  refetch: QueryObserverResult<any, Error>;
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
  const {mutate: uploadNote} = useUploadResource();

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
        type: 'note',
      });

      setIsUploading(true);
      uploadNote(
        {
          file: {
            uri: file!.uri,
            type: file!.type,
            name: file!.name,
          },
          title,
          subjectId,
          type: 'note',
          year: new Date().getFullYear().toString(),
        },
        {
          onSuccess: () => {
            refetch();
            setIsUploading(false);
            setModalVisible(false);
            Toast.success('Note uploaded successfully');
            // Reset form
            setTitle('');
            setFile(undefined);
          },
          onError: error => {
            setIsUploading(false);
            Toast.error('Failed to upload note');
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
              Upload Course Notes
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
              label="Note Title"
              placeholder="Enter Note Title"
              backgroundColor={Colors.light}
              boxPadding={5}
              value={title}
              onChangeText={setTitle}
              onInputFocus={() => handleInputFocus('title', 0)}
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
                  title={isUploading ? 'Uploading...' : 'Upload Note'}
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
