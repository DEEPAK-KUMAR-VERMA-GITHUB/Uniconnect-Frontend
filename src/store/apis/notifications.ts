import {apiHooks, queryClient} from './queryClient';

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'NOTE' | 'ASSIGNMENT' | 'PYQ' | 'NOTICE' | 'SYSTEM';
  status: 'READ' | 'UNREAD' | 'ARCHIVED';
  sender: {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
  };
  createdAt: string;
  metadata?: {
    resourceId?: string;
    assignmentId?: string;
    subjectId?: string;
  };
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: 'NOTE' | 'ASSIGNMENT' | 'PYQ' | 'NOTICE' | 'SYSTEM';
  recipients?: string[];
  targetGroups?: {
    roles?: string[];
    departments?: string[];
    courses?: string[];
  };
  metadata?: {
    resourceId?: string;
    assignmentId?: string;
    subjectId?: string;
  };
}

const NOTIFICATION_ENDPOINT = '/notifications';

export const useCreateNotification = () => {
  return apiHooks.usePost<INotification, CreateNotificationData>(
    NOTIFICATION_ENDPOINT,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [NOTIFICATION_ENDPOINT]});
      },
    },
  );
};

export const useNotifications = (status?: string) => {
  const queryParams = new URLSearchParams();
  if (status) {
    queryParams.append('status', status);
  }
  return apiHooks.useGet<INotification[]>(
    `${NOTIFICATION_ENDPOINT}?${queryParams.toString()}`,
  );
};

export const useMarkAsRead = () => {
  return apiHooks.usePatch<{}, string>(
    (notificationId: string) =>
      `${NOTIFICATION_ENDPOINT}/mark-as-read/${notificationId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [NOTIFICATION_ENDPOINT]});
      },
    },
  );
};

export const useMarkAllAsRead = () => {
  return apiHooks.usePatch<{}, {}>(`${NOTIFICATION_ENDPOINT}/read-all`, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [NOTIFICATION_ENDPOINT]});
    },
  });
};
