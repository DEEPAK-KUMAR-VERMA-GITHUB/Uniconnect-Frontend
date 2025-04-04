import {FC, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {FilterState, PaginationState, SortState, User} from './types';

export const Users: FC = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [userToToggle, setUserToToggle] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  // sorting state
  const [sort, setSort] = useState<SortState>({
    field: null,
    direction: 'asc',
  });

  // filter state
  const [filters, setFilters] = useState<FilterState>({
    department: '',
    role: '',
    status: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Construct API URL with pagination, sorting, and filtering parameters
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...(sort.field && {sortBy: sort.field, sortDirection: sort.direction}),
        ...(filters.department && {department: filters.department}),
        ...(filters.role && {role: filters.role}),
        ...(filters.status && {status: filters.status}),
      });

      const response = await fetch(
        `https://api.example.com/users?${queryParams.toString()}`,
      );

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
      setPagination({
        ...pagination,
        totalItems: data.total,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, sort, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSort = (field: keyof User) => {
    setSort({
      field,
      direction:
        sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // reset to first page after filtering
    }));
  };

  const exportUsers = async () => {
    try {
      const csvContent = users
        .map(
          user =>
            `${user.id},${user.name},${user.email},${user.department},${user.role},${user.isActive}`,
        )
        .join('\n');

      const path = `${RNFS.DocumentDirectoryPath}/users.csv`;
      await RNFS.writeFile(path, csvContent, 'utf8');

      await Share.open({
        url: `file://${path}`,
        type: 'text/csv',
        filename: 'users.csv',
      });
    } catch (error) {
      setError('Failed to export users');
    }
  };

  const renderItem = ({item: user}: {item: User}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUser(user)}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.userDetails}>
        {user.department} - {user.role}
      </Text>
      <Text
        style={[
          styles.userStatus,
          {color: user.isActive === true ? 'green' : 'red'},
        ]}>
        {user.isActive}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (!loading && users.length < pagination.totalItems) {
            setPagination(prev => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }));
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  userStatus: {
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});
