import {apiHooks, queryClient} from './queryClient';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  facultyId: string;
  department: string;
  designation: string;
  role: 'faculty' | 'admin' | 'student';
  status: 'ACTIVE' | 'INACTIVE';
  deviceToken?: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  facultyId: string;
  department: string;
  designation: string;
  role: 'faculty' | 'admin' | 'student';
  deviceToken?: string;
}

const USERS_ENDPOINT = '/users';

export const useCreateUser = () => {
  return apiHooks.usePost<IUser, CreateUserData>(`${USERS_ENDPOINT}/register`, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [USERS_ENDPOINT]});
    },
  });
};

export const useUsers = () => {
  return apiHooks.useGet<IUser[]>(USERS_ENDPOINT);
};

export const useUpdateUser = () => {
  return apiHooks.usePut<IUser, Partial<IUser>>(USERS_ENDPOINT, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [USERS_ENDPOINT]});
    },
  });
};

export const useDeleteUser = () => {
  return apiHooks.useDelete<IUser>(USERS_ENDPOINT, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [USERS_ENDPOINT]});
    },
  });
};