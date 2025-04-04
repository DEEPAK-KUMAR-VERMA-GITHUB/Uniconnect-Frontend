import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../constants/Constants';
import {CustomButton, CustomInput, Divider} from '../GlobalComponents';
import {AddNewButton} from './AddNewButton';
import {formatNotificationTime} from '../../utils/helper';

// Define the type for notifications
export interface NotificationProps {
  id: string;
  title: string;
  subtitle: string;
  timestamp?: string; // Optional timestamp for sorting/display
  status?: 'read' | 'unread'; // Optional status
}

// Create the notifications list with sample data
export const NotificationsList: NotificationProps[] = [
  {
    id: '1',
    title: 'New Student Registration',
    subtitle: 'A new student has registered for the Fall semester',
    timestamp: '2024-01-15T10:30:00',
    status: 'unread',
  },
  {
    id: '2',
    title: 'Course Update',
    subtitle: 'Changes have been made to Computer Science 101 schedule',
    timestamp: '2024-01-14T15:45:00',
    status: 'read',
  },
  {
    id: '3',
    title: 'System Maintenance',
    subtitle: 'Scheduled maintenance on Saturday at 2 AM',
    timestamp: '2024-01-13T09:00:00',
    status: 'read',
  },
  {
    id: '4',
    title: 'Faculty Meeting',
    subtitle: 'Reminder: Faculty meeting tomorrow at 3 PM',
    timestamp: '2024-01-12T14:20:00',
    status: 'unread',
  },
  {
    id: '5',
    title: 'Exam Schedule Posted',
    subtitle: 'Final examination schedule is now available',
    timestamp: '2024-01-11T11:15:00',
    status: 'read',
  },
  {
    id: '6',
    title: 'Library Hours Update',
    subtitle: 'New library hours effective next week',
    timestamp: '2024-01-10T16:30:00',
    status: 'read',
  },
  {
    id: '7',
    title: 'Campus Event',
    subtitle: 'Annual sports day registration now open',
    timestamp: '2024-01-09T13:45:00',
    status: 'unread',
  },
  {
    id: '8',
    title: 'Holiday Notice',
    subtitle: 'Campus will be closed for upcoming holidays',
    timestamp: '2024-01-08T10:00:00',
    status: 'read',
  },
  {
    id: '9',
    title: 'Scholarship Deadline',
    subtitle: 'Last date to apply for merit scholarship',
    timestamp: '2024-01-07T09:30:00',
    status: 'unread',
  },
  {
    id: '10',
    title: 'New Course Offerings',
    subtitle: 'Spring semester course catalog now available',
    timestamp: '2024-01-06T14:00:00',
    status: 'read',
  },
];

// You can also add a function to sort notifications by date
export const sortNotifications = (notifications: NotificationProps[]) => {
  return [...notifications].sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });
};

export const Notifications: FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [notifications, setNotifications] =
    useState<NotificationProps[]>(NotificationsList);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingNotification, setEditingNotification] =
    useState<NotificationProps | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Implement API call to fetch notifications
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNotification = (title: string, description: string) => {
    const newNotification: NotificationProps = {
      id: Date.now().toString(), // Use proper ID generation in production
      title,
      subtitle: description,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setModalVisible(false);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id),
    );
  };

  const handleEditNotification = (notification: NotificationProps) => {
    setEditingNotification(notification);
    setModalVisible(true);
  };

  return (
    <>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Notification
            {...item}
            onEdit={() => handleEditNotification(item)}
            onDelete={() => handleDeleteNotification(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications available</Text>
        }
      />
      <AddNewButton setModalVisible={setModalVisible} />
      <AddNotificationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleAddNotification}
        editingNotification={editingNotification}
        onClose={() => setEditingNotification(null)}
      />
    </>
  );
};

const Notification: FC<
  NotificationProps & {
    onEdit: () => void;
    onDelete: () => void;
  }
> = ({id, title, subtitle, timestamp, status, onEdit, onDelete}) => {
  return (
    <View
      style={[
        styles.notificationContainer,
        status === 'unread' && styles.unreadNotification,
      ]}>
      <TouchableOpacity onPress={onEdit}>
        <MaterialIcons name="edit" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.notificationContentContainer}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.notificationSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        {timestamp && (
          <Text style={styles.timestamp}>
            {formatNotificationTime(timestamp)}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color={Colors.danger} />
      </TouchableOpacity>
      {status === 'unread' && <View style={styles.unreadDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
  },
  listContainer: {
    gap: 5,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    marginTop: 20,
  },
  notificationContainer: {
    width: '95%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    elevation: 2,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primary,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
  notificationContentContainer: {
    flex: 1,
  },
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
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: Colors.lightGray,
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },

  unreadNotification: {
    backgroundColor: Colors.info, // or any subtle highlight color
  },
  timestamp: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

type AddNotificationModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onSubmit: (title: string, description: string) => void;
  editingNotification?: NotificationProps | null;
  onClose: () => void;
};

const AddNotificationModal: FC<AddNotificationModalProps> = ({
  modalVisible,
  setModalVisible,
  onSubmit,
  editingNotification,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (editingNotification) {
      setTitle(editingNotification.title);
      setDescription(editingNotification.subtitle);
    }
  }, [editingNotification]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      // TODO: Show error message to user
      return;
    }
    onSubmit(title.trim(), description.trim());
    handleClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingNotification
                ? 'Edit Notification'
                : 'Add New Notification'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <Divider />

          <ScrollView
            ref={scrollViewRef}
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Title"
              placeholder="Enter Notification Title"
              value={title}
              onChangeText={setTitle}
              backgroundColor={Colors.light}
              boxPadding={5}
            />

            <CustomInput
              label="Description"
              placeholder="Enter Notification Description"
              value={description}
              onChangeText={setDescription}
              backgroundColor={Colors.light}
              boxPadding={5}
              multiline
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Cancel"
                onPress={handleClose}
                width="45%"
                backgroundColor={Colors.danger}
              />
              <CustomButton
                title={editingNotification ? 'Update' : 'Add'}
                onPress={handleSubmit}
                width="45%"
                backgroundColor={Colors.green}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
