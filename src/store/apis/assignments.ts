// Uniconnect/src/store/apis/assignments.ts
import {useQuery, useMutation} from '@tanstack/react-query';
import {api} from './api';

export const useGetAssignments = (subjectId: string) => {
  return useQuery({
    queryKey: ['assignments', subjectId],
    queryFn: async () => {
      const response = await api.get(`/subjects/${subjectId}/add-assignment`);
      return response.data.data.assignments;
    },
    enabled: !!subjectId,
  });
};

export const useUploadAssignment = () => {
  return useMutation({
    mutationFn: async ({file, title, subjectId, dueDate}) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('dueDate', dueDate);

      return api.post(`/subjects/${subjectId}/add-assignment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};

export const useDeleteAssignment = () => {
  return useMutation({
    mutationFn: async ({assignmentId}) => {
      return api.delete(`/assignments/${assignmentId}`);
    },
  });
};

export const useGetAssignmentSubmissions = (assignmentId: string) => {
  return useQuery({
    queryKey: ['assignmentSubmissions', assignmentId],
    queryFn: async () => {
      const response = await api.get(
        `/assignments/${assignmentId}/submissions`,
      );
      return response.data.data.submissions;
    },
    enabled: !!assignmentId,
  });
};

export const useSubmitAssignmentSolution = () => {
  return useMutation({
    mutationFn: async ({file, assignmentId}) => {
      const formData = new FormData();
      formData.append('file', file);

      return api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};
