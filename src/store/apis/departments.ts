import {api} from './api';
import {apiHooks, queryClient} from './queryClient';

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  status: string;
}

export interface IDepartmentOption {
  label: string;
  value: string;
}

const DEPARTMENTS_ENDPOINT = '/departments';

export const useDepartments = () => {
  return apiHooks.useGet<IDepartment[], IDepartmentOption[]>(
    `${DEPARTMENTS_ENDPOINT}/?sortBy=name&status=ACTIVE&sortOrder=asc`,
    {
      select: data =>
        data.map(department => ({
          label: department.name,
          value: department._id,
        })),
    },
  );
};

export const useCreateDepartment = () => {
  return apiHooks.usePost<IDepartment, Omit<IDepartment, '_id'>>(
    DEPARTMENTS_ENDPOINT,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [DEPARTMENTS_ENDPOINT]});
      },
    },
  );
};

export const useUpdateDepartment = () => {
  return apiHooks.usePut<IDepartment, Partial<IDepartment>>(
    DEPARTMENTS_ENDPOINT,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [DEPARTMENTS_ENDPOINT]});
      },
    },
  );
};

export const useDeleteDepartment = () => {
  return apiHooks.useDelete<IDepartment>(DEPARTMENTS_ENDPOINT, {
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [DEPARTMENTS_ENDPOINT]});
    },
  });
};
