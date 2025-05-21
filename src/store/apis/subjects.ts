import {useQuery} from '@tanstack/react-query';
import {api} from './api';

const getUserSubjects = async () => {
  const response = await api.get('/subjects/user');
  return response.data.data;
};

export const useGetUserSubjects = () => {
  return useQuery({
    queryKey: ['userSubjects'],
    queryFn: getUserSubjects,
  });
};

export const useFacultySubjects = (facultyId: string) => {
  return useQuery({
    queryKey: ['facultySubjects', facultyId],
    queryFn: async () => {
      const response = await api.get(`/subjects/faculty/${facultyId}`);
      return response.data.data.subjects;
    },
    enabled: !!facultyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
