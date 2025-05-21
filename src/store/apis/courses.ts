import {api} from './api';
import {apiHooks, queryClient} from './queryClient';

export interface ICourse {
  _id: string;
  name: string;
  code: string;
  department: string;
  status: string;
}

export interface ICourseOption {
  label: string;
  value: string;
}

export interface ICourseResponse {
  data: {
    data: ICourse[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

const COURSES_ENDPOINT = '/courses';

export const useCoursesByDepartment = (departmentId: string) => {
  return apiHooks.useGet<ICourse[], ICourseOption[]>(
    `${COURSES_ENDPOINT}/get-courses-by-department/${departmentId}`,
    {
      select: data =>
        data.map(course => ({
          label: course.name,
          value: course._id,
        })),
      enabled: !!departmentId,
    },
  );
};
