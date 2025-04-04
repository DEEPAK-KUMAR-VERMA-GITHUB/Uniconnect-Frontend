import {FC} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FilterState} from './types';

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CustomDialog: FC<DialogProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.dialogContainer}>
        <Text style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogMessage}>{message}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

interface FilterProps {
  departments: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const CustomFilter: React.FC<FilterProps> = ({
  departments,
  filters,
  onFilterChange,
}) => (
  <View style={styles.filterContainer}>
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>Department:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {departments.map(dept => (
          <TouchableOpacity
            key={dept}
            style={[
              styles.filterChip,
              filters.department === dept && styles.filterChipActive,
            ]}
            onPress={() =>
              onFilterChange({
                ...filters,
                department: filters.department === dept ? '' : dept,
              })
            }>
            <Text
              style={[
                styles.filterChipText,
                filters.department === dept && styles.filterChipTextActive,
              ]}>
              {dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // ... existing styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dialogMessage: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#721c24',
  },
  dismissText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  pageButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.5,
  },
  pageButtonText: {
    color: 'white',
  },
  pageInfo: {
    fontSize: 14,
  },
  userDetailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  userDetailsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  detailValue: {
    flex: 2,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  headerCell: {
    flex: 1,
    padding: 12,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: 'white',
  },
  cell: {
    flex: 1,
    padding: 12,
    minWidth: 120,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4,
    marginVertical: 2,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 12,
    margin: 8,
    borderRadius: 4,
  },

  exportButton: {
    backgroundColor: '#28a745',
    padding: 12,
    margin: 8,
    borderRadius: 4,
  },
  exportButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 8,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filterChip: {
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#007bff',
  },
  filterChipText: {
    color: '#495057',
  },
  filterChipTextActive: {
    color: 'white',
  },
});
