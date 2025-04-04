// Add these imports at the top
import {FC, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {CustomSafeAreaView} from '../GlobalComponents';
import {Colors} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

// Add this interface for the assignment data structure
interface Assignment {
  id: string;
  title: string;
  subtitle: string;
  dueDate: string;
  session: string;
  course: string;
  semester: string;
  subject: string;
  isCompleted: boolean;
}

// Modify the AssignmentScreen component
export const Assignments: FC = () => {
  const [groupBy, setGroupBy] = useState<
    'session' | 'course' | 'semester' | 'subject'
  >('session');

  // Sample data - replace with your actual data source
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Math Assignment',
      subtitle: 'Complete Problems 15-30',
      dueDate: '2024-02-20',
      session: '2023-24',
      course: 'BSc Computer Science',
      semester: 'Semester 1',
      subject: 'Mathematics',
      isCompleted: false,
    },
    // Add more assignments...
  ];

  const groupAssignments = (assignments: Assignment[]) => {
    return assignments.reduce(
      (groups: {[key: string]: Assignment[]}, assignment) => {
        const key = assignment[groupBy];
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(assignment);
        return groups;
      },
      {},
    );
  };

  const renderGroupedAssignments = () => {
    const grouped = groupAssignments(assignments);

    return Object.entries(grouped).map(([group, assignments]) => (
      <View key={group} style={styles.groupContainer}>
        <Text style={styles.groupHeader}>{group}</Text>
        {assignments.map(assignment => (
          <Assignment
            key={assignment.id}
            title={assignment.title}
            subtitle={assignment.subtitle}
            time={assignment.dueDate}
            isCompleted={assignment.isCompleted}
            gotoDetails={() => {
              /* View assignment details */
            }}
          />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView>
      <View style={styles.filterContainer}>
        {['session', 'course', 'semester', 'subject'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              groupBy === filter && styles.filterButtonActive,
            ]}
            onPress={() => setGroupBy(filter as any)}>
            <Text
              style={[
                styles.filterText,
                groupBy === filter && styles.filterTextActive,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        style={styles.assignmentsContainer}
        showsVerticalScrollIndicator={false}>
        {renderGroupedAssignments()}
      </ScrollView>
    </SafeAreaView>
  );
};

type AssignmentProps = {
  title: string;
  subtitle: string;
  time: string;
  gotoDetails: () => void;
  isCompleted?: boolean;
};

const Assignment: FC<AssignmentProps> = ({
  title,
  subtitle,
  time,
  gotoDetails,
  isCompleted = false,
}) => {
  const styles = StyleSheet.create({
    AssignmentContainer: {
      width: '95%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
      backgroundColor: isCompleted ? Colors.lightGray : Colors.white,
      borderRadius: 10,
      alignSelf: 'center',
    },
    AssignmentContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    AssignmentMessage: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    AssignmentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
    },
    AssignmentSubtitle: {
      fontSize: 14,
      color: Colors.muted,
    },
    AssignmentTime: {
      fontSize: 12,
      color: Colors.gray,
    },
    AssignmentIcon: {
      fontSize: 24,
      color: isCompleted ? 'transparent' : Colors.primary,
    },
    goToBtn: {
      padding: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 5,
      backgroundColor: isCompleted ? Colors.green : Colors.primary,
      borderRadius: 100,
    },
  });

  return (
    <View style={styles.AssignmentContainer}>
      <View style={styles.AssignmentContent}>
        <MaterialIcon name="assignment" style={styles.AssignmentIcon} />
        <View style={styles.AssignmentMessage}>
          <Text style={styles.AssignmentTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.AssignmentSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.AssignmentTime} numberOfLines={1}>
            <MaterialIcon name="calendar-month" size={12} color={Colors.gray} />{' '}
            Due : {time}
          </Text>
        </View>
        {!isCompleted ? (
          <TouchableOpacity onPress={gotoDetails} style={styles.goToBtn}>
            <MaterialIcon name="arrow-right" size={30} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <MaterialIcon name="check" size={30} color={Colors.green} />
        )}
      </View>
    </View>
  );
};

// Add these additional styles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 5,
  },
  assignmentsContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.black,
  },
  filterTextActive: {
    color: Colors.white,
  },
  groupContainer: {
    marginBottom: 20,
    padding: 10,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
