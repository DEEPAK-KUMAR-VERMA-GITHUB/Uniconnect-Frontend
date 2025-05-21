// src/store/apis/semesters.ts
import {api} from './api';
import {apiHooks, queryClient} from './queryClient';

export interface ISemester {
  _id: string;
  name: string;
  session: string;
  number: number;
  status: string;
}

export interface ISemesterOption {
  label: string;
  value: string;
}

const SEMESTERS_ENDPOINT = '/semesters';

export const useSemestersBySession = (sessionId: string) => {
  return apiHooks.useGet<ISemester[], ISemesterOption[]>(
    `${SEMESTERS_ENDPOINT}/get-all-semesters/${sessionId}`,
    {
      select: data => {
        return data.map(semester => ({
          label: semester.semesterName,
          value: semester._id,
        }));
      },
      enabled: !!sessionId,
    },
  );
};
