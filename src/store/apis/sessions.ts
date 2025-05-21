import {api} from './api';
import {apiHooks, queryClient} from './queryClient';

export interface ISession {
  _id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ISessionOption {
  label: string;
  value: string;
}

const SESSIONS_ENDPOINT = '/sessions';

export const useSessionsByCourse = (courseId: string) => {
  return apiHooks.useGet<ISession[], ISessionOption[]>(
    `${SESSIONS_ENDPOINT}/get-sessions/${courseId}`,
    {
      select: data =>
        data.map(session => ({
          label: session.name,
          value: session._id,
        })),
      enabled: !!courseId,
    },
  );
};
